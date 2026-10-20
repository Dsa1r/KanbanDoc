from flask import Flask
from auth import auth_bp  # 1. Import new Security Department

app = Flask(__name__)

# 2. I am telling the main app to use the Security Department
app.register_blueprint(auth_bp)

@app.route('/')
def home():
    return "DevCompass Backend is running!"

if __name__ == '__main__':
    app.run(debug=True)