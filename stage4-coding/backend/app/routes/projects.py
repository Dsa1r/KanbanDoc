from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from postgrest.exceptions import APIError

from app.services import project_service as svc

bp = Blueprint("projects", __name__, url_prefix="/api")


@bp.post("/projects")
@jwt_required()
def create_project():
    data = request.get_json(silent=True) or {}
    try:
        project = svc.create_project(
            name=data.get("project_name"),
            description=data.get("description"),
        )
    except svc.ValidationError as e:
        return jsonify({"error": str(e)}), 400
    except APIError:
        return jsonify({"error": "Database error"}), 500
    return jsonify(project), 201
