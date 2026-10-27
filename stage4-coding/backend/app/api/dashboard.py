from flask import Blueprint, request, jsonify, g

from app.middleware.auth import auth_required
from app.services import dashboard_service, project_service

dashboard_bp = Blueprint('dashboard', __name__)


# GET /api/v1/dashboard  -> welcome text + the user's projects with progress
@dashboard_bp.route('/api/v1/dashboard', methods=['GET'])
@auth_required
def get_dashboard():
    data = dashboard_service.get_dashboard(g.user)
    return jsonify({"data": data}), 200


# POST /api/v1/projects   body: {"name": "...", "description": "...", "template_id": 0 | 1}
#   template_id 1 = pre-seeded template (ready-made tasks), 0 = blank project
@dashboard_bp.route('/api/v1/projects', methods=['POST'])
@auth_required
def create_project():
    body = request.get_json(silent=True) or {}
    project = project_service.create_project(
        g.user.id, body.get('name'), body.get('description'), body.get('template_id', 0)
    )
    return jsonify({"data": project}), 201