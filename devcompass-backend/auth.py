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