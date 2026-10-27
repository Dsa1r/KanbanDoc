from flask import current_app

from app import extensions as ext
from app.repositories import project_repo
from app.services import board_service
from app.utils.constants import STAGES, STARTER_TASKS
from app.utils.errors import ApiError

NAME_MAX = 100


def _clean_name(name):
    if not isinstance(name, str) or not name.strip():
        raise ApiError("VALIDATION_ERROR", "Project name is required", 400)
    name = name.strip()
    if len(name) > NAME_MAX:
        raise ApiError("VALIDATION_ERROR", f"Project name must be {NAME_MAX} characters or less", 400)
    return name


def _clean_description(description):
    if description is None:
        return None
    if not isinstance(description, str):
        raise ApiError("VALIDATION_ERROR", "description must be text", 400)
    return description.strip() or None


def _starter_tasks():
    """Tasks of the 'Starter template' (from the database, or the built-in list if it is missing)."""
    rows = (
        ext.admin_client.table("project_templates")
        .select("default_tasks")
        .eq("template_name", "Starter template")
        .limit(1)
        .execute()
        .data
    )
    tasks = rows[0]["default_tasks"] if rows else None
    if isinstance(tasks, list):
        valid = [
            {
                "title": str(t["title"]).strip()[:255],
                "stage": str(t["stage"]).upper(),
                "note": str(t.get("note") or "")[:255],
                "description": str(t.get("description") or ""),
                "resources": t["resources"] if isinstance(t.get("resources"), list) else [],
            }
            for t in tasks
            if isinstance(t, dict)
            and str(t.get("title", "")).strip()
            and str(t.get("stage", "")).upper() in STAGES
        ]
        if valid:
            return valid
    return STARTER_TASKS


def create_project(user_id, name, description=None, template_id=0):
    """Create a project that its creator can open.

    1) a team  2) the creator as the team owner  3) the project  4) its starter tasks.
    If any step fails we delete what was already created, so no half-made project is left behind.
    """
    name = _clean_name(name)
    description = _clean_description(description)
    if template_id not in (0, 1, None, "0", "1"):
        raise ApiError("VALIDATION_ERROR", "Unknown template", 400)
    use_starter = str(template_id) == "1"

    db = ext.admin_client
    team_id = project_id = None
    try:
        team_id = db.table("teams").insert({"team_name": name}).execute().data[0]["id"]
        db.table("team_members").insert(
            {"team_id": team_id, "user_id": user_id, "is_owner": True}
        ).execute()
        project = (
            db.table("projects")
            .insert({"team_id": team_id, "project_name": name, "description": description})
            .execute()
            .data[0]
        )
        project_id = project["id"]

        tasks = []
        if use_starter:
            tasks = [
                {"project_id": project_id, "position": i, **t}
                for i, t in enumerate(_starter_tasks(), start=1)
            ]
            db.table("tasks").insert(tasks).execute()
    except Exception:
        current_app.logger.exception("create_project failed")
        if project_id:
            db.table("projects").delete().eq("id", project_id).execute()  # tasks go with it
        if team_id:
            db.table("teams").delete().eq("id", team_id).execute()  # team_members go with it
        raise ApiError("DATABASE_ERROR", "Could not create the project", 500) from None

    return {
        "id": project_id,
        "name": project["project_name"],
        "description": project.get("description"),
        "progress": board_service.calculate_progress([]),
        "board_url": f"/projects/{project_id}/board",
        "task_count": len(tasks),
    }


def get_user_projects(user_id):
    """The user's projects, each with its own progress (shape the dashboard cards expect)."""
    projects = []
    for p in project_repo.get_user_projects_with_tasks(user_id):
        progress = board_service.calculate_progress(
            [t["current_status"] for t in p.get("tasks") or []]
        )
        projects.append({
            "project_id": p["id"],
            "name": p["project_name"],
            "description": p.get("description"),
            "progress": progress,
            "board_url": f"/projects/{p['id']}/board",
            "created_at": p["created_at"],
        })
    return projects