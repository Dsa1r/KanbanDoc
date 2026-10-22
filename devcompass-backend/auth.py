import os
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv
from supabase import create_client, Client

# 1. Load the secret keys from your .env file
load_dotenv()

# 2. Connect to your Supabase Database
url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(url, key)

# 3. Create the "Security Department" Blueprint
auth_bp = Blueprint('auth', __name__)

# 4. Create the Register Route (DC-01)
@auth_bp.route('/api/v1/auth/signup', methods=['POST'])
def register():
    data = request.get_json() # Get the data sent by the user
    
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')

    # Security check: Did they forget the email or password?
    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Ask Supabase to securely hash the password and create the user
        response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": {"name": name}
            }
        })
        return jsonify({"message": "User created successfully!"}), 201
        
    except Exception as e:
        # If the email already exists, Supabase will trigger this error
        return jsonify({"error": str(e)}), 400
    
# Create The login Route (DC-02)
@auth_bp.route('/api/v1/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    try:
        # Ask Supabase to verify the ID card (login)
        response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        return jsonify({"message": "Welcome back! Login successful."}), 200

    except Exception as e:
        # If the password is wrong or email doesn't exist
        return jsonify({"error": str(e)}), 401
@auth_bp.route('/api/v1/auth/logout', methods=['POST'])
def logout():
    try:
        # Ask Supabase to end the session
        supabase.auth.sign_out()
        return '', 204 # 204 means "Success, no content to return"
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route: Forgot Password - Sends a password reset email to the user
@auth_bp.route('/api/v1/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')

    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        # Ask Supabase to send a password reset email
        supabase.auth.reset_password_email(email)
        return jsonify({"data": {"message": "If the email exists, a reset link has been sent"}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Route: Reset Password - Updates the user's old password with the new one
@auth_bp.route('/api/v1/auth/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    new_password = data.get('new_password')

    if not new_password:
        return jsonify({"error": "New password is required"}), 400

    try:
        # Update the user's password in Supabase
        supabase.auth.update_user({"password": new_password})
        return jsonify({"data": {"message": "Password updated"}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400