from flask import Blueprint, jsonify, g, request
from app.services import dashboard_service, project_service
from app.middleware.auth import auth_required


dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/api/v1/dashboard', methods=['GET'])
@auth_required
def get_dashboard():
    data = dashboard_service.get_dashboard(g.user)
    return jsonify({"data": data}), 200


@dashboard_bp.route('/api/v1/projects', methods=['POST'])
@auth_required
def create_project():
    data = request.get_json(silent=True) or {}

    # الـ frontend ممكن يرسل mode، أو يرسل audience، أو بس member_emails
    members = data.get('member_emails') or []
    mode = data.get('mode') or ('team' if members else 'solo')

    try:
        project = project_service.create_project(
            g.user,
            name=data.get('name'),
            description=data.get('description'),
            mode=mode,
            member_emails=members,
        )
    except project_service.ValidationError as e:
        return jsonify({"error": {"code": "VALIDATION_ERROR", "message": str(e)}}), 400
    return jsonify({"data": project}), 201


'''
@dashboard_bp.route('/api/v1/projects', methods=['POST'])
@auth_required
def create_project():
    data = request.get_json(silent=True) or {}
    try:
        project = project_service.create_project(
            g.user,
            name=data.get('name'),
            team_id=data.get('team_id'),
            description=data.get('description'),
        )
    except project_service.ValidationError as e:
        return jsonify({"error": {"code": "VALIDATION_ERROR", "message": str(e)}}), 400
    except project_service.ForbiddenError as e:
        return jsonify({"error": {"code": "FORBIDDEN", "message": str(e)}}), 403
    return jsonify({"data": project}), 201
    '''