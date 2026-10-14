"""Dev-only: print a JWT for a user id, so you can test with curl or Postman.

Usage (from the backend/ folder):
    python -m scripts.make_token <user-uuid>
"""
import sys

from flask_jwt_extended import create_access_token

from app import create_app

app = create_app()
with app.app_context():
    print(create_access_token(identity=sys.argv[1]))
