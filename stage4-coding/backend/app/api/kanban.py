from flask import Blueprint, request, jsonify, g

from app.middleware.auth import auth_required
from app.middleware.project_access import ensure_project_member
from app.services.kanban_service import get_kanban


kanban_bp = Blueprint('kanban', __name__, url_prefix='/api/v1/projects')


@kanban_bp.route('/<project_id>/kanban', methods=['GET'])
@auth_required
def get_project_kanban(project_id):
    project = ensure_project_member(str(project_id), g.user.id)

    result = get_kanban(project["id"])

    return jsonify({
        "data": {
            "project": {
                "id": project["id"],
                "name": project["project_name"],
                "description": project["description"] or "",
                "is_completed": project["is_completed"]
            },
            **result
        }
    }), 200