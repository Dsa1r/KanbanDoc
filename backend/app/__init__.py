# from multiprocessing.dummy.connection import Client

from flask import Flask
from flask_cors import CORS
from app.utils.errors import register_error_handlers
import config
from supabase import create_client, Client

def create_app():
    app = Flask(__name__)
    CORS(app)
    register_error_handlers(app)

    url: str = config.Config.SUPABASE_URL
    key: str = config.Config.SUPABASE_ANON_KEY

    if not url or not key:
        raise ValueError("Supabase credentials are missing in config.py!")
        
    app.supabase: Client = create_client(url, key)
    from app.api.auth import auth_bp
    # from app.api.dashboard import dashboard_bp

    app.register_blueprint(auth_bp)
    # app.register_blueprint(dashboard_bp)

    @app.route('/')
    def index():
        return {"message": "DevCompass API is running"}

    return app
