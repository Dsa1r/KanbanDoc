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


# from app.data.fixed_tasks import FIXED_TASKS
# from app.extensions : ايررررورimport ext ImportError: cannot import name 'ext' from 'app.extensions' (C:\KanbanDoc\stage4-coding\backend\app\extensions.py)

#في الميثود المسؤولة عن Generate Project، بعد إنشاء المشروع والحصول على بياناته:
# project = create_project(project_data)

# if project["project_type"] == "FIXED":
    # task_service.create_fixed_tasks(project["id"])
from app.tasks_data.fixed import FIXED_TASKS
from app import extensions as ext


def create_fixed_tasks(project_id):
    created_tasks = []

    for position, task_data in enumerate(FIXED_TASKS, start=1):

        # Insert task
        task_response = (
            ext.admin_client.table("tasks")
            .insert({
                "project_id": project_id,
                "title": task_data["title"],
                "stage": task_data["stage"],
                "current_status": "TO_DO",
                "position": position
            })
            .execute()
        )

        task = task_response.data[0]
        task_id = task["id"]

        # Prepare task phases
        phases = []

        for status, phase_data in task_data["phases"].items():
            phases.append({
                "task_id": task_id,
                "status": status,
                "description": phase_data["description"],
                "why_it_matters": phase_data["why_it_matters"],
                "resources": phase_data["resources"],
                "checklist": phase_data["checklist"]
            })

        # Insert all four phases
        ext.admin_client.table("task_phases").insert(phases).execute()

        created_tasks.append(task)

    return created_tasks

def create_task(user_id, body):
    project_id = body.get("project_id")
    title = body.get("title")
    stage = body.get("stage")

    if not project_id or not title or not stage:
        raise ApiError("Missing required fields", 400)

    title = title.strip()

    if not title:
        raise ApiError("Task title is required", 400)
    
    if stage not in ["DATABASE", "BACKEND", "FRONTEND"]:
        raise ApiError("INVALID_STAGE", "Invalid task stage", 400)

        # Verify that the user belongs to this project
        # using your existing project authorization logic.

    task_response = (
        ext.admin_client.table("tasks")
        .insert({
            "project_id": project_id,
            "title": title,
            "stage": stage,
            "current_status": "TO_DO"
        })
        .execute()
    )

    task = task_response.data[0]
    task_id = task["id"]

    try:
        # Create four empty phases
        statuses = [
            "TO_DO",
            "IN_PROGRESS",
            "TESTING_REVIEW",
            "DONE"
        ]

        phases = [
                {
                "task_id": task_id,
                "status": status,
                "description": "",
                "why_it_matters": "",
                "resources": [],
                "checklist": []
            }
            for status in statuses
        ]

        ext.admin_client.table("task_phases").insert(
            phases
        ).execute()

        return board_service.task_to_dict(task)

    except Exception:
            # Rollback if phase creation fails
        ext.admin_client.table("tasks").delete().eq(
            "id", task_id
        ).execute()

        raise