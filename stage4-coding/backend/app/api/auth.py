import re

from flask import Blueprint, request, jsonify, g, current_app
from config import Config
from app.extensions import get_anon_client, admin_client
from app.middleware.auth import auth_required

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


def error(code, message, status):
    return jsonify({"error": {"code": code, "message": message}}), status


USERNAME_RE = re.compile(r'^[a-z0-9_.]{3,20}$')
USERNAME_RULE = "Username must be 3-20 characters: letters, numbers, _ or ."


def user_to_dict(user):
    meta = user.user_metadata or {}
    return {
        "id": user.id,
        "email": user.email,
        "phone": meta.get("phone"),
        "name": meta.get("name"),
        "username": meta.get("username"),
    }


def normalize_username(value):
    return (value or '').strip().lower().lstrip('@')


def find_profile(username):
    """The user_profiles row of this username, or None (usernames are stored lowercase)."""
    rows = (admin_client.table('user_profiles')
            .select('user_id,username,email')
            .eq('username', username)
            .limit(1)
            .execute().data)
    return rows[0] if rows else None


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
    username = normalize_username(data.get('username'))

    if not email or not password or not name or not username:
        return error("VALIDATION_ERROR", "name, username, email and password are required", 400)
    if not USERNAME_RE.match(username):
        return error("VALIDATION_ERROR", USERNAME_RULE, 400)
    if len(password) < 8:
        return error("VALIDATION_ERROR", "password must be at least 8 characters", 400)

    if find_profile(username):
        return error("USERNAME_TAKEN", "This username is already taken", 409)

    try:
        res = get_anon_client().auth.sign_up({
            "email": email,
            "password": password,
            "options": {"data": {"name": name, "phone": phone, "username": username}},
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

    try:
        admin_client.table('user_profiles').insert({
            "user_id": res.user.id,
            "username": username,
            "email": email,
        }).execute()
    except Exception as e:
        current_app.logger.warning("profile insert failed: %s", e)
        try:
            admin_client.auth.admin.delete_user(res.user.id)
        except Exception as cleanup_error:
            current_app.logger.warning("signup cleanup failed: %s", cleanup_error)
        return error("USERNAME_TAKEN", "This username is already taken", 409)

    body = {"user": user_to_dict(res.user)}
    if res.session:
        body.update(session_to_dict(res.session))
    return jsonify({"data": body}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json(silent=True) or {}
    identifier = (data.get('identifier') or data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not identifier or not password:
        return error("VALIDATION_ERROR", "username or email and password are required", 400)

    if '@' in identifier:
        email = identifier
    else:
        profile = find_profile(normalize_username(identifier))
        email = profile['email'] if profile else None

    invalid = error("UNAUTHORIZED", "Invalid username/email or password", 401)
    if not email:
        return invalid

    try:
        res = get_anon_client().auth.sign_in_with_password({
            "email": email,
            "password": password,
        })
    except Exception as e:
        current_app.logger.info("login failed: %s", e)
        return invalid

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


@auth_bp.route('/me', methods=['PATCH'])
@auth_required
def update_me():
    data = request.get_json(silent=True) or {}
    meta = dict(g.user.user_metadata or {})

    if 'name' in data:
        name = (data.get('name') or '').strip()
        if not name:
            return error("VALIDATION_ERROR", "name cannot be empty", 400)
        meta['name'] = name

    if 'phone' in data:
        meta['phone'] = (data.get('phone') or '').strip() or None

    new_username = None
    if 'username' in data:
        new_username = normalize_username(data.get('username'))
        if not USERNAME_RE.match(new_username):
            return error("VALIDATION_ERROR", USERNAME_RULE, 400)
        taken = find_profile(new_username)
        if taken and taken['user_id'] != g.user.id:
            return error("USERNAME_TAKEN", "This username is already taken", 409)
        meta['username'] = new_username

    try:
        admin_client.auth.admin.update_user_by_id(g.user.id, {"user_metadata": meta})
    except Exception as e:
        current_app.logger.warning("update profile failed: %s", e)
        return error("VALIDATION_ERROR", "Could not update your settings", 400)

    if new_username:
        try:
            existing = (admin_client.table('user_profiles').select('user_id')
                        .eq('user_id', g.user.id).limit(1).execute().data)
            if existing:
                (admin_client.table('user_profiles').update({"username": new_username})
                 .eq('user_id', g.user.id).execute())
            else:
                admin_client.table('user_profiles').insert({
                    "user_id": g.user.id,
                    "username": new_username,
                    "email": (g.user.email or '').lower(),
                }).execute()
        except Exception as e:
            current_app.logger.warning("profile save failed: %s", e)
            return error("USERNAME_TAKEN", "This username is already taken", 409)

    return jsonify({"data": {
        "id": g.user.id,
        "email": g.user.email,
        "phone": meta.get("phone"),
        "name": meta.get("name"),
        "username": meta.get("username"),
    }}), 200


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