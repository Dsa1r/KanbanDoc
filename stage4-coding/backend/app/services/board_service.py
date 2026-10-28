from app import extensions as ext
from app.utils.constants import STAGES, STATUSES
from app.utils.errors import ApiError


def calculate_progress(statuses):
    """statuses: list of current_status values -> {"done", "total", "percent"}"""
    total = len(statuses)
    done = sum(1 for s in statuses if s == "DONE")
    percent = round(done * 100 / total) if total else 0
    return {"done": done, "total": total, "percent": percent}


def normalize_stage(stage):
    """None/'' -> None (no filter). Otherwise must be DATABASE, BACKEND or FRONTEND."""
    if stage is None or str(stage).strip() == "":
        return None
    stage = str(stage).strip().upper()
    if stage not in STAGES:
        raise ApiError("VALIDATION_ERROR", "stage must be one of DATABASE, BACKEND, FRONTEND", 400)
    return stage


def task_to_dict(row):
    return {
        "id": row["id"],
        "title": row["title"],
        "stage_id": row["stage"],
        "current_status": row["current_status"],
        "note": row.get("note") or "",
        "description": row.get("description") or "",
        "resources": row.get("resources") or [],
    }


def _fetch_tasks(project_id):
    """All tasks of ONE project — this is what makes every project's Kanban separate."""
    return (
        ext.admin_client.table("tasks")
        .select("id, title, stage, current_status, note, description, resources")
        .eq("project_id", project_id)
        .order("position")
        .order("created_at")
        .execute()
        .data
        or []
    )


def get_progress(project_id):
    rows = _fetch_tasks(project_id)
    return calculate_progress([r["current_status"] for r in rows])


def get_board(project, stage=None):
    """Build the board: tasks grouped into the 4 status columns (+ optional stage filter).

    Progress is always calculated on the whole project, even when a stage filter is on.
    """
    stage = normalize_stage(stage)
    rows = _fetch_tasks(project["id"])

    columns = {status: [] for status in STATUSES}
    for row in rows:
        if stage and row["stage"] != stage:
            continue
        columns[row["current_status"]].append(task_to_dict(row))

    stage_progress = {
        s: calculate_progress([r["current_status"] for r in rows if r["stage"] == s])
        for s in STAGES
    }

    return {
        "project": {
            "id": project["id"],
            "name": project["project_name"],
            "description": project.get("description") or "",
            "is_completed": bool(project.get("is_completed")),
        },
        "active_stage": stage,
        "progress": calculate_progress([r["current_status"] for r in rows]),
        "stage_progress": stage_progress,
        "columns": columns,
    }


def get_upcoming(project, stage):
    """Upcoming = the stage's tasks that are still TO_DO (used by the Show More toggle)."""
    stage = normalize_stage(stage)
    if stage is None:
        raise ApiError("VALIDATION_ERROR", "stage is required", 400)
    rows = _fetch_tasks(project["id"])
    tasks = [
        task_to_dict(r) for r in rows
        if r["stage"] == stage and r["current_status"] == "TO_DO"
    ]
    return {"stage": stage, "tasks": tasks}