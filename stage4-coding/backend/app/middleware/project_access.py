import uuid

# We read `extensions.admin_client` at call time (not `from ... import admin_client`)
# so tests can swap it for a fake database in one place.
from app import extensions as ext
from app.utils.errors import ApiError


def parse_uuid(value, what="Resource"):
    """Return the value as a normalized UUID string, or raise 404 if it is not a UUID."""
    try:
        return str(uuid.UUID(str(value)))
    except ValueError:
        raise ApiError("NOT_FOUND", f"{what} not found", 404) from None


def ensure_project_member(project_id, user_id):
    """Return the project row if `user_id` belongs to the project's team.

    404 -> project does not exist
    403 -> project exists but the user is not a member of its team
    """
    project_id = parse_uuid(project_id, "Project")

    rows = (
        ext.admin_client.table("projects")
        .select("id, project_name, description, is_completed, team_id")
        .eq("id", project_id)
        .limit(1)
        .execute()
        .data
    )
    if not rows:
        raise ApiError("NOT_FOUND", "Project not found", 404)
    project = rows[0]

    is_member = False
    if project.get("team_id"):
        member = (
            ext.admin_client.table("team_members")
            .select("id")
            .eq("team_id", project["team_id"])
            .eq("user_id", user_id)
            .limit(1)
            .execute()
            .data
        )
        is_member = bool(member)

    if not is_member:
        raise ApiError("NOT_PROJECT_MEMBER", "You are not a member of this project", 403)
    return project