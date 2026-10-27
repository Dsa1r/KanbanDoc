from datetime import datetime, timezone

from app import extensions as ext
from app.middleware.project_access import ensure_project_member, parse_uuid
from app.services import board_service
from app.utils.constants import STATUSES
from app.utils.errors import ApiError


def update_status(task_id, user_id, new_status):
    """Move a task to another Kanban column (drag and drop) and save it in the database."""
    task_id = parse_uuid(task_id, "Task")

    if new_status not in STATUSES:
        raise ApiError(
            "VALIDATION_ERROR",
            "status must be one of TO_DO, IN_PROGRESS, TESTING_REVIEW, DONE",
            400,
        )

    rows = (
        ext.admin_client.table("tasks")
        .select("id, project_id, title, stage, current_status, note, description, resources")
        .eq("id", task_id)
        .limit(1)
        .execute()
        .data
    )
    if not rows:
        raise ApiError("NOT_FOUND", "Task not found", 404)
    task = rows[0]

    # The user must belong to the team of the task's project
    project = ensure_project_member(task["project_id"], user_id)

    if project.get("is_completed"):
        raise ApiError("PROJECT_COMPLETED", "Completed projects are read-only", 409)

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
        task = res.data[0] if res.data else {**task, "current_status": new_status}

    # Return the new progress too, so the frontend can refresh its bar without another request
    return {
        "task": board_service.task_to_dict(task),
        "progress": board_service.get_progress(project["id"]),
    }