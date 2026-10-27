from supabase import create_client
from config import Config

def get_anon_client():
    return create_client(Config.SUPABASE_URL, Config.SUPABASE_ANON_KEY)

admin_client = create_client(Config.SUPABASE_URL, Config.SUPABASE_SERVICE_KEY)


def get_supabase():
    return admin_client