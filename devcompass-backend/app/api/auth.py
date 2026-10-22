from flask import Blueprint, request, jsonify, g, current_app
from app.config import Config
from app.extensions import get_anon_client, admin_client
from app.middleware.auth import auth_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


def error(code, message, status):
    return jsonify({"error": {"code": code, "message": message}}), status


def user_to_dict(user):
    meta = user.user_metadata or {}
    return {
        "id": user.id,
        "email": user.email,
        "phone": meta.get("phone"),
        "name": meta.get("name"),
    }


def session_to_dict(session):
    return {
        "access_token": session.access_token,
        "refresh_token": session.refresh_token,
        "expires_in": session.expires_in,
    }


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    name = (data.get('name') or '').strip()
    phone = data.get('phone')

    if not email or not password or not name:
        return error("VALIDATION_ERROR", "name, email and password are required", 400)
    if len(password) < 8:
        return error("VALIDATION_ERROR", "password must be at least 8 characters", 400)

    try:
        res = get_anon_client().auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"name": name, "phone": phone}},
        })
    except Exception as e:
        current_app.logger.warning("signup failed: %s", e)
        if "already" in str(e).lower():
            return error("EMAIL_ALREADY_REGISTERED",
                         "An account with this email may already exist. Please try signing in", 409)
        return error("VALIDATION_ERROR", "Could not create account", 400)

    if res.user is None or (res.user.identities is not None and len(res.user.identities) == 0):
        return error("EMAIL_ALREADY_REGISTERED",
                     "An account with this email may already exist. Please try signing in", 409)

    body = {"user": user_to_dict(res.user)}
    if res.session:
        body.update(session_to_dict(res.session))
    return jsonify({"data": body}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return error("VALIDATION_ERROR", "email and password are required", 400)

    try:
        res = get_anon_client().auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
    except Exception as e:
        current_app.logger.info("login failed: %s", e)
        return error("UNAUTHORIZED", "Invalid email or password", 401)

    body = {"user": user_to_dict(res.user)}
    body.update(session_to_dict(res.session))
    return jsonify({"data": body}), 200


@auth_bp.route('/logout', methods=['POST'])
@auth_required
def logout():
    token = request.headers['Authorization'][7:]
    try:
        admin_client.auth.admin.sign_out(token)
    except Exception as e:
        current_app.logger.warning("logout failed: %s", e)
    return '', 204


@auth_bp.route('/me', methods=['GET'])
@auth_required
def me():
    return jsonify({"data": user_to_dict(g.user)}), 200


@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()

    if not email:
        return error("VALIDATION_ERROR", "email is required", 400)

    try:
        get_anon_client().auth.reset_password_for_email(
            email, {"redirect_to": Config.FRONTEND_RESET_URL}
        )
    except Exception as e:
        current_app.logger.warning("forgot-password failed: %s", e)

    return jsonify({"data": {"message": "If the email exists, a reset link has been sent"}}), 200


@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json(silent=True) or {}
    token = data.get('token') or ''
    new_password = data.get('new_password') or ''

    if not token or not new_password:
        return error("VALIDATION_ERROR", "token and new_password are required", 400)
    if len(new_password) < 8:
        return error("VALIDATION_ERROR", "password must be at least 8 characters", 400)

    try:
        user = get_anon_client().auth.get_user(token).user
        admin_client.auth.admin.update_user_by_id(user.id, {"password": new_password})
    except Exception as e:
        current_app.logger.warning("reset-password failed: %s", e)
        return error("UNAUTHORIZED", "Invalid or expired token", 401)

    return jsonify({"data": {"message": "Password updated"}}), 200