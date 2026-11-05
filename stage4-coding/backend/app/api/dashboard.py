
from flask import Blueprint, jsonify, g, request
from app.services import dashboard_service, project_service
from app.middleware.auth import auth_required



dashboard_bp = Blueprint('dashboard', __name__)


# GET /api/v1/dashboard  -> welcome text + the user's projects with progress
@dashboard_bp.route('/api/v1/dashboard', methods=['GET'])
@auth_required
def get_dashboard():
    data = dashboard_service.get_dashboard(g.user)
    return jsonify({"data": data}), 200



@dashboard_bp.route('/api/v1/projects', methods=['POST'])
@auth_required
def create_project():
    data = request.get_json(silent=True) or {}

    members = data.get('member_emails') or []
    mode = data.get('mode') or ('team' if members else 'solo')

    try:
        project = project_service.create_project(
            g.user,
            name=data.get('name'),
            description=data.get('description'),
            mode=mode,
            member_emails=members,
            template_id=data.get('template_id'),
        )
    except project_service.ValidationError as e:
        return jsonify({"error": {"code": "VALIDATION_ERROR", "message": str(e)}}), 400

    return jsonify({"data": project}), 201

# DELETE /api/v1/projects/<id>  -> owner only
@dashboard_bp.route('/api/v1/projects/<project_id>', methods=['DELETE'])
@auth_required
def delete_project(project_id):
    project_service.delete_project(g.user, project_id)
    return '', 204

# GET /api/v1/projects/<id>  -> project + members for the edit form (owner only)
@dashboard_bp.route('/api/v1/projects/<project_id>', methods=['GET'])
@auth_required
def get_project(project_id):
    data = project_service.get_project_details(g.user, project_id)
    return jsonify({"data": data}), 200


# PATCH /api/v1/projects/<id>  -> update name, description and members (owner only)
@dashboard_bp.route('/api/v1/projects/<project_id>', methods=['PATCH'])
@auth_required
def update_project(project_id):
    data = request.get_json(silent=True) or {}

    try:
        project = project_service.update_project(
            g.user,
            project_id,
            name=data.get('name'),
            description=data.get('description'),
            member_emails=data.get('member_emails'),
        )
    except project_service.ValidationError as e:
        return jsonify({"error": {"code": "VALIDATION_ERROR", "message": str(e)}}), 400

    return jsonify({"data": project}), 200