from flask import Blueprint, g, jsonify, request

from app.middleware.auth import auth_required
from app.services import ai_service
from app.utils.errors import ApiError

ai_bp = Blueprint("ai", __name__, url_prefix="/api/v1/projects")

FIELDS = ("product", "users", "features", "stack", "timeline")
MAX_LEN = 1000


# POST /api/v1/projects/<project_id>/ai-extract
# body: {"text": "pasted requirements / use cases"}  ->  {"data": {"answers": {...5 fields...}}}
@ai_bp.post("/<project_id>/ai-extract")
@auth_required
def extract_ai_answers(project_id):
    body = request.get_json(silent=True) or {}
    answers = ai_service.extract_answers(project_id, g.user.id, str(body.get("text", "")))
    return jsonify({"data": {"answers": answers}}), 200


# POST /api/v1/projects/<project_id>/ai-tasks
# body: {"answers": {"product": "...", "users": "...", "features": "...", "stack": "...", "timeline": "..."}}
@ai_bp.post("/<project_id>/ai-tasks")
@auth_required
def generate_ai_tasks(project_id):
    body = request.get_json(silent=True) or {}
    raw = body.get("answers") or {}

    answers = {}
    for field in FIELDS:
        value = str(raw.get(field, "")).strip()
        if not value:
            raise ApiError("VALIDATION_ERROR", f"'{field}' is required", 400)
        answers[field] = value[:MAX_LEN]

    data = ai_service.generate_project_tasks(project_id, g.user.id, answers)
    return jsonify({"data": data}), 201