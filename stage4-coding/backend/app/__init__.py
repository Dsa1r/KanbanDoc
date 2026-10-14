import os
from datetime import timedelta

from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

from app.extensions import jwt


def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.config["JWT_SECRET_KEY"] = os.environ["JWT_SECRET_KEY"]
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
    CORS(app)
    jwt.init_app(app)

    # every auth error uses the same {"error": "..."} shape as the rest of the API
    @jwt.unauthorized_loader
    def missing_token(reason):
        return jsonify({"error": "Missing or malformed Authorization header"}), 401

    @jwt.invalid_token_loader
    def invalid_token(reason):
        return jsonify({"error": "Invalid token"}), 401

    @jwt.expired_token_loader
    def expired_token(header, payload):
        return jsonify({"error": "Token has expired"}), 401

    from app.routes.projects import bp as projects_bp

    app.register_blueprint(projects_bp)

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"}), 200

    return app
