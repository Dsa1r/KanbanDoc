from flask import Blueprint, request, jsonify, g

from app.middleware.auth import auth_required
from app.services import task_service

tasks_bp = Blueprint('tasks', __name__, url_prefix='/api/v1/tasks')


# PATCH /api/v1/tasks/<task_id>/status   body: {"status": "IN_PROGRESS"}
@tasks_bp.route('/<task_id>/status', methods=['PATCH'])
@auth_required
def update_task_status(task_id):
    body = request.get_json(silent=True) or {}
    data = task_service.update_status(task_id, g.user.id, body.get('status'))
    return jsonify({"data": data}), 200