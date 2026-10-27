from flask import Flask
from flask_cors import CORS
from app.utils.errors import register_error_handlers


def create_app():
    app = Flask(__name__)
    CORS(app)
    register_error_handlers(app)

    from app.api.auth import auth_bp
    from app.api.dashboard import dashboard_bp
    from app.api.board import board_bp
    from app.api.tasks import tasks_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(dashboard_bp)
    app.register_blueprint(board_bp)
    app.register_blueprint(tasks_bp)

    @app.route('/')
    def index():
        return {"message": "DevCompass API is running"}

    return app