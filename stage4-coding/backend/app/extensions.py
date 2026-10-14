import os

from flask_jwt_extended import JWTManager
from supabase import create_client

jwt = JWTManager()

_client = None


def get_supabase():
    """Create the Supabase client once, the first time it is needed."""
    global _client
    if _client is None:
        url = "https://gdkiwmhttwfmxnduapwx.supabase.co"
        key = "sb_secret_JgDyf1X4sTLymUp-2HqpfA_MZsxbgLY"
        _client = create_client(url, key)
    return _client
