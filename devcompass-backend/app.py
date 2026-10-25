import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

load_dotenv()

from auth import auth_bp  # noqa: E402  (Security Department)

app = Flask(__name__)

# Allow the React app (Vite dev server) to call this API from the browser
origins = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
CORS(app, origins=[origin.strip() for origin in origins])

# Tell the main app to use the Security Department
app.register_blueprint(auth_bp)


@app.route("/")
def home():
    return "DevCompass Backend is running!"


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG") == "1")