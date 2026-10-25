import os
import re

from dotenv import load_dotenv
from flask import Blueprint, current_app, jsonify, request
from supabase import Client, create_client
from supabase_auth.errors import AuthApiError

# Load the secret keys from your .env file
load_dotenv()

# The "Security Department" Blueprint
auth_bp = Blueprint("auth", __name__, url_prefix="/api/v1/auth")

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
PHONE_RE = re.compile(r"^\+?[0-9\s\-()]{7,20}$")
MIN_PASSWORD_LENGTH = 8


def new_auth_client() -> Client:
    """A fresh Supabase client for every request.

    The client remembers the session of the last user who logged in, so one
    shared client would mix up different users. A new one per request is cheap
    and keeps each request separate.
    """
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    if not url or not key:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be set in .env")
    return create_client(url, key)


def _error(message, status, field=None):
    body = {"error": message}
    if field:
        body["field"] = field
    return jsonify(body), status


def _public_user(user):
    meta = user.user_metadata or {}
    return {
        "id": user.id,
        "email": user.email,
        "name": meta.get("name"),
        "phone": meta.get("phone"),
    }


def _already_registered(error):
    code = getattr(error, "code", "") or ""
    message = (getattr(error, "message", "") or str(error)).lower()
    return code == "user_already_exists" or "already registered" in message


# Register Route (DC-01)
@auth_bp.route("/signup", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}  # never crashes on a missing body
    name = str(data.get("name") or "").strip()
    email = str(data.get("email") or "").strip().lower()
    password = data.get("password")
    phone = str(data.get("phone") or "").strip()

    if not name:
        return _error("Name is required", 400, "name")
    if len(name) > 100:
        return _error("Name must be 100 characters or less", 400, "name")
    if not EMAIL_RE.match(email):
        return _error("Enter a valid email address", 400, "email")
    if not isinstance(password, str) or len(password) < MIN_PASSWORD_LENGTH:
        return _error(
            f"Password must be at least {MIN_PASSWORD_LENGTH} characters", 400, "password"
        )
    if phone and not PHONE_RE.match(phone):
        return _error("Enter a valid phone number", 400, "phone")

    try:
        # Supabase hashes the password and creates the user
        response = new_auth_client().auth.sign_up(
            {
                "email": email,
                "password": password,
                "options": {"data": {"name": name, "phone": phone or None}},
            }
        )
    except AuthApiError as e:
        if _already_registered(e):
            return _error("An account with this email already exists", 409, "email")
        return _error(e.message or "Could not create the account", 400)
    except Exception:
        current_app.logger.exception("signup failed")
        return _error("Authentication service is unavailable", 503)

    # With "Confirm email" turned on, Supabase hides duplicates: it returns a
    # user with no identities instead of an error.
    user = response.user
    if user is None or getattr(user, "identities", None) == []:
        return _error("An account with this email already exists", 409, "email")

    return jsonify({"message": "User created successfully!", "user": _public_user(user)}), 201


# Login Route (DC-02)
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email") or "").strip().lower()
    password = data.get("password")

    if not email or not isinstance(password, str) or not password:
        return _error("Email and password are required", 400)

    try:
        response = new_auth_client().auth.sign_in_with_password(
            {"email": email, "password": password}
        )
    except AuthApiError as e:
        if getattr(e, "code", "") == "email_not_confirmed":
            return _error("Please confirm your email before logging in", 403)
        # the same message for a wrong password and an unknown email
        return _error("Invalid email or password", 401)
    except Exception:
        current_app.logger.exception("login failed")
        return _error("Authentication service is unavailable", 503)

    session = response.session
    return (
        jsonify(
            {
                "access_token": session.access_token,
                "refresh_token": session.refresh_token,
                "user": _public_user(response.user),
            }
        ),
        200,
    )


@auth_bp.route("/logout", methods=["POST"])
def logout():
    # Tokens live in the browser, so logging out means the frontend deletes them.
    return "", 204


# Forgot Password - sends a password reset email
@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json(silent=True) or {}
    email = str(data.get("email") or "").strip().lower()

    if not EMAIL_RE.match(email):
        return _error("Enter a valid email address", 400, "email")

    redirect_to = os.getenv("FRONTEND_URL", "http://localhost:5173") + "/reset-password"
    try:
        new_auth_client().auth.reset_password_for_email(email, {"redirect_to": redirect_to})
    except Exception:
        # never reveal whether the email exists
        current_app.logger.exception("forgot-password failed")

    return jsonify({"message": "If the email exists, a reset link has been sent"}), 200


# Reset Password - the email link gives the frontend an access_token and a refresh_token
@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json(silent=True) or {}
    access_token = data.get("access_token")
    refresh_token = data.get("refresh_token")
    new_password = data.get("new_password")

    if not isinstance(access_token, str) or not access_token:
        return _error("Reset token is required", 400)
    if not isinstance(refresh_token, str) or not refresh_token:
        return _error("Reset token is required", 400)
    if not isinstance(new_password, str) or len(new_password) < MIN_PASSWORD_LENGTH:
        return _error(
            f"Password must be at least {MIN_PASSWORD_LENGTH} characters", 400, "new_password"
        )

    try:
        client = new_auth_client()
        client.auth.set_session(access_token, refresh_token)
        client.auth.update_user({"password": new_password})
    except AuthApiError:
        return _error("This reset link is invalid or has expired", 400)
    except Exception:
        current_app.logger.exception("reset-password failed")
        return _error("Authentication service is unavailable", 503)

    return jsonify({"message": "Password updated"}), 200
