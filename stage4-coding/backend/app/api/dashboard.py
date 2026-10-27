from flask import Blueprint, jsonify, g
from app.middleware.auth import auth_required
from app.services import dashboard_service

dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/api/v1/dashboard', methods=['GET'])
@auth_required
def get_dashboard():
    data = dashboard_service.get_dashboard(g.user)
    return jsonify({"data": data}), 200