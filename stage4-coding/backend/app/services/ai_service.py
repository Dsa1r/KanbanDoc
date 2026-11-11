import json
import os
import re
import time
from concurrent.futures import ThreadPoolExecutor

from google import genai
from google.genai import types

from app import extensions as ext
from app.middleware.project_access import ensure_project_member, parse_uuid
from app.prompts.generate_tasks import (
    PHASE_SYSTEM,
    PLAN_SYSTEM,
    build_phase_prompt,
    build_plan_prompt,
)
from app.services import board_service
from app.utils.errors import ApiError

PLAN_MODEL = os.getenv("AI_PLAN_MODEL", "gemini-2.5-flash")   # change in .env without touching code
PHASE_MODEL = os.getenv("AI_PHASE_MODEL", "gemini-2.5-flash")  # one call per task
MAX_TASKS = 16
MAX_WORKERS = 2  # free tier has a low requests-per-minute limit
PHASE_STATUSES = ["TO_DO", "IN_PROGRESS", "TESTING_REVIEW", "DONE"]
STAGES = {  # accepts a few spellings, saves your DB values
    "database": "DATABASE", "db": "DATABASE",
    "backend": "BACKEND", "frontend": "FRONTEND",
}

_client = None


def _ai_error(message):
    return ApiError("AI_ERROR", message, 502)


def _get_client():
    global _client
    if _client is None:
        key = os.getenv("GEMINI_API_KEY")
        if not key:
            raise _ai_error("AI is not configured on the server")
        _client = genai.Client(api_key=key)
    return _client


def _ask(model, system, user, max_tokens):
    delay = 5
    for attempt in range(4):
        try:
            resp = _get_client().models.generate_content(
                model=model,
                contents=user,
                config=types.GenerateContentConfig(
                    system_instruction=system,
                    max_output_tokens=max_tokens * 3,  # leaves room for the model's internal thinking
                ),
            )
            return resp.text or ""
        except ApiError:
            raise
        except Exception as exc:
            rate_limited = "429" in str(exc) or "RESOURCE_EXHAUSTED" in str(exc)
            if rate_limited and attempt < 3:
                time.sleep(delay)  # free tier: wait and retry
                delay *= 2
                continue
            raise _ai_error(f"AI request failed: {exc}") from exc


def _parse_json(text, opener, closer):
    text = re.sub(r"^```(?:json)?\s*|\s*```$", "", text.strip())
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


# ---------- step 1: plan ----------
def _plan_tasks(project, answers):
    text = _ask(PLAN_MODEL, PLAN_SYSTEM, build_plan_prompt(project, answers), 1500)
    items = _parse_json(text, "[", "]")
    if not isinstance(items, list):
        raise _ai_error("AI plan is not a list")
    tasks = []
    for it in items[:MAX_TASKS]:
        if not isinstance(it, dict):
            continue
        title = str(it.get("title", "")).strip()[:120]
        stage = STAGES.get(str(it.get("stage", "")).strip().lower())
        if title and stage:
            tasks.append({"title": title, "stage": stage})
    if not tasks:
        raise _ai_error("AI returned no valid tasks")
    return tasks


# ---------- step 2: phase templates ----------
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


def _task_phases(project, answers, task):
    """Returns (phases_dict, ok). Never raises: a failed task keeps empty phases."""
    try:
        text = _ask(PHASE_MODEL, PHASE_SYSTEM, build_phase_prompt(project, answers, task), 1500)
        data = _parse_json(text, "{", "}")
        if not isinstance(data, dict):
            raise _ai_error("phases not an object")
        return {s: _clean_phase(data.get(s)) for s in PHASE_STATUSES}, True
    except Exception:
        return {s: _empty_phase() for s in PHASE_STATUSES}, False


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

    tasks = _plan_tasks(project, answers)
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        results = list(pool.map(lambda t: _task_phases(project, answers, t), tasks))

    inserted = _save(project_id, tasks, [r[0] for r in results])
    return {
        "tasks": [board_service.task_to_dict(t) for t in inserted],
        "progress": board_service.get_progress(project_id),
        "phases_missing": sum(1 for r in results if not r[1]),
    }