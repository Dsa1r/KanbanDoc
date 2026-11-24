import json
import logging
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor

from openai import OpenAI  # Groq speaks the OpenAI format, so we reuse this SDK

from app import extensions as ext
from app.middleware.project_access import ensure_project_member, parse_uuid
from app.prompts.generate_tasks import (
    EXTRACT_SYSTEM,
    PHASE_SYSTEM,
    PLAN_SYSTEM,
    build_batch_prompt,
    build_extract_prompt,
    build_plan_prompt,
)
from app.services import board_service
from app.utils.errors import ApiError

logger = logging.getLogger(__name__)

# ---------- settings (all can be overridden from .env) ----------
BASE_URL = os.getenv("AI_BASE_URL", "https://api.groq.com/openai/v1")
PLAN_MODEL = os.getenv("AI_PLAN_MODEL", "openai/gpt-oss-120b")
EXTRACT_MODEL = os.getenv("AI_EXTRACT_MODEL", "openai/gpt-oss-20b")

# One model per stage. The three stages run at the same time, each on its own model,
# so each model has its own tokens-per-minute budget.
STAGE_MODELS = {
    "DATABASE": os.getenv("AI_MODEL_DATABASE", "qwen/qwen3.8-27b"),
    "BACKEND": os.getenv("AI_MODEL_BACKEND", "openai/gpt-oss-120b"),
    "FRONTEND": os.getenv("AI_MODEL_FRONTEND", "openai/gpt-oss-20b"),
}

MIN_TASKS = 12
MAX_TASKS = 18
MIN_PER_STAGE = 4
MAX_PER_STAGE = 6
BATCH_SIZE = 4            # tasks per call inside one stage
TOKENS_PER_TASK = 900     # output budget per task (reasoning models also think inside this)
TOKENS_BASE = 900
MAX_WAIT = 30             # seconds: longest rate-limit wait we accept
MAX_TEXT_CHARS = 15000    # pasted requirements text
ANSWER_FIELDS = ("product", "users", "features", "stack", "timeline")
PHASE_STATUSES = ["TO_DO", "IN_PROGRESS", "TESTING_REVIEW", "DONE"]
STAGES = {
    "database": "DATABASE", "db": "DATABASE",
    "backend": "BACKEND", "frontend": "FRONTEND",
}

_client = None


def _ai_error(message):
    return ApiError("AI_ERROR", message, 502)


def _get_client():
    global _client
    if _client is None:
        key = os.getenv("GROQ_API_KEY")
        if not key:
            raise _ai_error("AI is not configured on the server")
        _client = OpenAI(api_key=key, base_url=BASE_URL, timeout=60, max_retries=0)
    return _client


def _wait_seconds(msg):
    """Read 'Please try again in 787.5ms / 7.2s / 1m3.4s' from a rate-limit message."""
    m = re.search(r"try again in\s+(?:(\d+)m)?\s*(?:([\d.]+)(ms|s))?", msg)
    if not m:
        return None
    minutes = int(m.group(1) or 0)
    value = float(m.group(2) or 0)
    seconds = minutes * 60 + (value / 1000 if m.group(3) == "ms" else value)
    return seconds if seconds > 0 else None


def _ask(model, system, user, max_tokens, json_mode=False, temperature=0.3):
    delay = 2
    for attempt in range(5):
        try:
            kwargs = {}
            if json_mode:
                kwargs["response_format"] = {"type": "json_object"}
            resp = _get_client().chat.completions.create(
                model=model,
                max_tokens=max_tokens,
                temperature=temperature,
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": user},
                ],
                **kwargs,
            )
            choice = resp.choices[0]
            if choice.finish_reason == "length":
                logger.warning("AI reply was cut off (model=%s). Raise the token budget.", model)
            return choice.message.content or ""
        except ApiError:
            raise
        except Exception as exc:
            msg = str(exc).lower()
            status = getattr(exc, "status_code", None)

            if json_mode and status == 400:
                logger.warning("JSON mode rejected by %s, retrying without it: %s", model, exc)
                json_mode = False
                continue

            if status == 429 and any(k in msg for k in ("per day", "(tpd)", "(rpd)")):
                logger.error("Daily limit reached for %s: %s", model, exc)
                raise _ai_error(f"Daily limit reached for {model}. Please try again later.") from exc

            retryable = status in (429, 500, 502, 503) or any(
                s in msg for s in ("rate limit", "overloaded", "unavailable", "high demand")
            )
            if retryable and attempt < 4:
                wait = _wait_seconds(msg) if status == 429 else None
                if wait is not None:
                    if wait > MAX_WAIT:
                        logger.error("Rate limit wait too long (%.0fs) on %s", wait, model)
                        raise _ai_error(f"{model} is busy. Please try again in a minute.") from exc
                    time.sleep(wait + 0.5)
                else:
                    time.sleep(delay)
                    delay *= 2
                continue

            logger.error("AI request failed (model=%s): %s", model, exc)
            raise _ai_error(f"AI request failed: {exc}") from exc
    raise _ai_error("AI request failed")


def _parse_json(text, opener, closer):
    text = re.sub(r"<think>.*?</think>", "", text or "", flags=re.S).strip()  # some models print their thinking
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(re.escape(opener) + r".*" + re.escape(closer), text, re.S)
        if match:
            try:
                return json.loads(match.group(0))
            except json.JSONDecodeError:
                pass
    raise _ai_error("AI returned invalid JSON")


# ---------- step 0: fill the 5 answers from pasted text ----------
def extract_answers(project_id, user_id, text):
    project_id = parse_uuid(project_id, "Project")
    ensure_project_member(project_id, user_id)

    text = (text or "").strip()
    if len(text) < 20:
        raise ApiError("VALIDATION_ERROR", "Please paste a longer text.", 400)
    text = text[:MAX_TEXT_CHARS]

    raw = _ask(EXTRACT_MODEL, EXTRACT_SYSTEM, build_extract_prompt(text), 1500,
               json_mode=True, temperature=0)
    data = _parse_json(raw, "{", "}")
    if not isinstance(data, dict):
        raise _ai_error("AI output is not an object")
    return {f: str(data.get(f) or "").strip()[:1000] for f in ANSWER_FIELDS}


# ---------- step 1: plan ----------
def _clean_plan(data):
    items = data.get("tasks") if isinstance(data, dict) else data
    if not isinstance(items, list):
        raise _ai_error("AI plan is not a list")
    tasks, seen = [], set()
    for it in items:
        if not isinstance(it, dict):
            continue
        title = str(it.get("title", "")).strip()[:120]
        stage = STAGES.get(str(it.get("stage", "")).strip().lower())
        if title and stage and title.lower() not in seen:
            seen.add(title.lower())
            tasks.append({"title": title, "stage": stage})
    return tasks[:MAX_TASKS]


def _counts(tasks):
    return {s: sum(1 for t in tasks if t["stage"] == s) for s in STAGE_MODELS}


def _balance_problems(tasks):
    """What is wrong with the split between stages (empty list = fine)."""
    problems = []
    if len(tasks) < MIN_TASKS:
        problems.append(f"only {len(tasks)} tasks (need at least {MIN_TASKS})")
    for stage, n in _counts(tasks).items():
        if n < MIN_PER_STAGE:
            problems.append(f"{stage} has {n} tasks (need at least {MIN_PER_STAGE})")
        elif n > MAX_PER_STAGE:
            problems.append(f"{stage} has {n} tasks (at most {MAX_PER_STAGE}; merge related ones)")
    return problems


def _plan_tasks(project, answers):
    raw = _ask(PLAN_MODEL, PLAN_SYSTEM, build_plan_prompt(project, answers), 3000, json_mode=True)
    tasks = _clean_plan(_parse_json(raw, "{", "}"))

    # One repair attempt if the split between stages is unbalanced.
    problems = _balance_problems(tasks)
    if problems:
        logger.info("Plan needs balancing: %s", "; ".join(problems))
        feedback = (
            "Your previous answer has these problems: " + "; ".join(problems) + ". "
            f"Return the full corrected list: {MIN_TASKS} to {MAX_TASKS} tasks, "
            f"{MIN_PER_STAGE} to {MAX_PER_STAGE} per stage. Merge related tasks and add missing ones."
            "\nPrevious tasks:\n"
            + "\n".join(f"- [{t['stage']}] {t['title']}" for t in tasks)
        )
        try:
            raw = _ask(PLAN_MODEL, PLAN_SYSTEM, build_plan_prompt(project, answers, feedback), 3000, json_mode=True)
            better = _clean_plan(_parse_json(raw, "{", "}"))
            if len(_balance_problems(better)) < len(problems):
                tasks = better
        except Exception as exc:
            logger.warning("Plan repair failed, keeping the first plan: %s", exc)

    if not tasks:
        raise _ai_error("AI returned no valid tasks")
    return tasks


# ---------- step 2: phase guides, one batch per stage, all stages in parallel ----------
def _empty_phase():
    return {"description": "", "why_it_matters": "", "resources": [], "checklist": []}


def _clean_phase(p):
    if not isinstance(p, dict):
        return _empty_phase()
    checklist = [str(c).strip()[:200] for c in (p.get("checklist") or []) if str(c).strip()]
    return {
        "description": str(p.get("description", "")).strip(),
        "why_it_matters": str(p.get("why_it_matters", "")).strip(),
        "resources": [],  # same as fixed.py; avoids made-up links
        "checklist": checklist[:6],
    }


def _phase_ok(p):
    """Quality gate: a phase needs a description and a real checklist."""
    return bool(p["description"]) and len(p["checklist"]) >= 2


def _phase_batch(model, project, answers, stage, chunk, all_titles):
    """chunk: list of (index, task). Returns {index: phases} for the tasks that came back valid."""
    tasks = [t for _, t in chunk]
    raw = _ask(
        model, PHASE_SYSTEM,
        build_batch_prompt(project, answers, stage, tasks, all_titles),
        TOKENS_PER_TASK * len(chunk) + TOKENS_BASE,
        json_mode=True,
    )
    data = _parse_json(raw, "{", "}")
    out = {}
    if not isinstance(data, dict):
        return out
    for n, (idx, _task) in enumerate(chunk, start=1):
        phases = {s: _clean_phase((data.get(str(n)) or {}).get(s)) for s in PHASE_STATUSES} \
            if isinstance(data.get(str(n)), dict) else None
        if phases and all(_phase_ok(p) for p in phases.values()):
            out[idx] = phases
    return out


def _stage_phases(project, answers, stage, items, all_titles):
    """Runs on ONE model for ONE stage. Never raises. Returns {index: (phases, ok)}."""
    model = STAGE_MODELS[stage]
    results = {}
    for i in range(0, len(items), BATCH_SIZE):
        chunk = items[i:i + BATCH_SIZE]
        try:
            got = _phase_batch(model, project, answers, stage, chunk, all_titles)
        except Exception as exc:
            logger.error("[%s/%s] batch failed: %s", stage, model, exc)
            got = {}

        for idx, task in chunk:  # retry the missing tasks one by one on the same model
            if idx in got:
                continue
            try:
                got.update(_phase_batch(model, project, answers, stage, [(idx, task)], all_titles))
            except Exception as exc:
                logger.error("[%s/%s] task '%s' failed: %s", stage, model, task["title"], exc)

        for idx, _task in chunk:
            results[idx] = (got[idx], True) if idx in got else ({s: _empty_phase() for s in PHASE_STATUSES}, False)
    return results


# ---------- save ----------
def _next_position(project_id):
    rows = (
        ext.admin_client.table("tasks").select("position")
        .eq("project_id", project_id).order("position", desc=True).limit(1)
        .execute().data
    )
    return (rows[0]["position"] or 0) if rows else 0


def _save(project_id, tasks, phases_by_index):
    start = _next_position(project_id)
    rows = [
        {"project_id": project_id, "title": t["title"], "stage": t["stage"],
         "current_status": "TO_DO", "position": start + i + 1}
        for i, t in enumerate(tasks)
    ]
    inserted = ext.admin_client.table("tasks").insert(rows).execute().data
    ids = [t["id"] for t in inserted]
    try:
        phase_rows = []
        for task_row, phases in zip(inserted, phases_by_index):
            for status in PHASE_STATUSES:
                phase_rows.append({"task_id": task_row["id"], "status": status, **phases[status]})
        ext.admin_client.table("task_phases").insert(phase_rows).execute()
    except Exception:
        ext.admin_client.table("tasks").delete().in_("id", ids).execute()  # rollback
        raise
    return inserted


# ---------- public ----------
def generate_project_tasks(project_id, user_id, answers):
    project_id = parse_uuid(project_id, "Project")
    project = ensure_project_member(project_id, user_id)

    if project.get("is_completed"):
        raise ApiError("PROJECT_COMPLETED", "Completed projects are read-only", 409)
    if project.get("template_id") == 1:  # 1 = starter (fixed) template
        raise ApiError("INVALID_PROJECT_TYPE", "AI generation is only for empty projects", 400)

    started = time.time()
    tasks = _plan_tasks(project, answers)
    logger.info("Plan ready: %d tasks in %.1fs", len(tasks), time.time() - started)

    items_by_stage = {}
    for i, t in enumerate(tasks):
        items_by_stage.setdefault(t["stage"], []).append((i, t))
    all_titles = [t["title"] for t in tasks]

    # The three stages run at the same time, each on its own model.
    results = {}
    with ThreadPoolExecutor(max_workers=len(STAGE_MODELS)) as pool:
        futures = [
            pool.submit(_stage_phases, project, answers, stage, items, all_titles)
            for stage, items in items_by_stage.items()
        ]
        for f in futures:
            results.update(f.result())

    ordered = [results[i] for i in range(len(tasks))]
    inserted = _save(project_id, tasks, [r[0] for r in ordered])
    missing = sum(1 for r in ordered if not r[1])
    logger.info("Generation finished in %.1fs (%d tasks, %d without phases)",
                time.time() - started, len(tasks), missing)

    return {
        "tasks": [board_service.task_to_dict(t) for t in inserted],
        "progress": board_service.get_progress(project_id),
        "phases_missing": missing,
    }