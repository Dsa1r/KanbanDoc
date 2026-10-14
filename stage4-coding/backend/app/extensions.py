import os

from flask_jwt_extended import JWTManager
from supabase import create_client

jwt = JWTManager()

_client = None


def get_supabase():
    """Create the Supabase client once, the first time it is needed."""
    global _client
    if _client is None:
        _client = create_client(
            os.environ["SUPABASE_URL"], os.environ["SUPABASE_SERVICE_KEY"]
        )
    return _client
