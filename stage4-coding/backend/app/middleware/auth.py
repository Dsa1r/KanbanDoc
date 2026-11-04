from functools import wraps
from flask import request, jsonify, g
from app.extensions import get_anon_client


def auth_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        header = request.headers.get('Authorization', '')
        if not header.startswith('Bearer '):
            return jsonify({"error": {"code": "UNAUTHORIZED",
                                      "message": "Missing token"}}), 401
        try:
            g.user = get_anon_client().auth.get_user(header[7:]).user
        except Exception:
            return jsonify({"error": {"code": "UNAUTHORIZED",
                                      "message": "Invalid or expired token"}}), 401
        return f(*args, **kwargs)
    return wrapper