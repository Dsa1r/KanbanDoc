from flask import Blueprint, jsonify, g

from app.middleware.auth import auth_required
from app.middleware.project_access import ensure_project_member
from app.services.kanban_service import get_kanban


kanban_bp = Blueprint(
    "kanban",
    __name__,
    url_prefix="/api/v1/projects"
)


@kanban_bp.get("/<uuid:project_id>/kanban")
@auth_required
def get_project_kanban(project_id):
    project = ensure_project_member(str(project_id), g.user.id)

    result = get_kanban(project["id"])

    return jsonify({
        "data": result
    }), 200