from datetime import datetime, timezone

from app import extensions as ext
from app.middleware.project_access import ensure_project_member, parse_uuid
from app.repositories.task_repository import (
    get_task_phase as fetch_task_phase
)
from app.services import board_service
from app.utils.constants import STATUSES
from app.utils.errors import ApiError


def update_status(task_id, user_id, new_status):
    """Move a task to another Kanban column and save it in the database."""

    task_id = parse_uuid(task_id, "Task")

    if new_status not in STATUSES:
        raise ApiError(
            "VALIDATION_ERROR",
            "status must be one of TO_DO, IN_PROGRESS, TESTING_REVIEW, DONE",
            400,
        )

    rows = (
    ext.admin_client.table("tasks")
    .select("id, project_id, title, stage, current_status")
    .eq("id", task_id)
    .limit(1)
    .execute()
    .data
)

    if not rows:
        raise ApiError("NOT_FOUND", "Task not found", 404)

    task = rows[0]

    # Verify that the user belongs to the task's project team.
    project = ensure_project_member(task["project_id"], user_id)

    if project.get("is_completed"):
        raise ApiError(
            "PROJECT_COMPLETED",
            "Completed projects are read-only",
            409,
        )

    if task["current_status"] != new_status:
        res = (
            ext.admin_client.table("tasks")
            .update({
                "current_status": new_status,
                "updated_at": datetime.now(timezone.utc).isoformat(),
            })
            .eq("id", task_id)
            .execute()
        )

        task = res.data[0] if res.data else {
            **task,
            "current_status": new_status,
        }

    return {
        "task": board_service.task_to_dict(task),
        "progress": board_service.get_progress(project["id"]),
    }


def get_task_phase(task_id, user_id):
    """Get the phase details that match the task's current status."""

    task_id = parse_uuid(task_id, "Task")

    # 1. Fetch the task.
    rows = (
        ext.admin_client.table("tasks")
        .select("id, project_id, current_status")
        .eq("id", task_id)
        .limit(1)
        .execute()
        .data
    )

    if not rows:
        raise ApiError("NOT_FOUND", "Task not found", 404)

    task = rows[0]

    # 2. Verify project membership.
    ensure_project_member(task["project_id"], user_id)

    # 3. Fetch the phase matching the current task status.
    phase = fetch_task_phase(task_id, task["current_status"])

    if not phase:
        raise ApiError("NOT_FOUND", "Task phase not found", 404)

    return phase