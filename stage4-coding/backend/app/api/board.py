from flask import Blueprint, request, jsonify, g

from app.middleware.auth import auth_required
from app.middleware.project_access import ensure_project_member
from app.services import board_service

board_bp = Blueprint('board', __name__, url_prefix='/api/v1/projects')


# GET /api/v1/projects/<project_id>/board            -> the whole board
# GET /api/v1/projects/<project_id>/board?stage=BACKEND -> only that stage's tasks
@board_bp.route('/<project_id>/board', methods=['GET'])
@auth_required
def get_board(project_id):
    project = ensure_project_member(project_id, g.user.id)
    data = board_service.get_board(project, request.args.get('stage'))
    return jsonify({"data": data}), 200


# GET /api/v1/projects/<project_id>/stages/<stage_id>/upcoming
@board_bp.route('/<project_id>/stages/<stage_id>/upcoming', methods=['GET'])
@auth_required
def get_upcoming(project_id, stage_id):
    project = ensure_project_member(project_id, g.user.id)
    data = board_service.get_upcoming(project, stage_id)
    return jsonify({"data": data}), 200