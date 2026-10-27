from flask import jsonify


class ApiError(Exception):
    def __init__(self, code, message, status):
        self.code = code
        self.message = message
        self.status = status


def register_error_handlers(app):
    @app.errorhandler(ApiError)
    def handle_api_error(e):
        return jsonify({"error": {"code": e.code, "message": e.message}}), e.status

    @app.errorhandler(404)
    def handle_404(e):
        return jsonify({"error": {"code": "NOT_FOUND", "message": "Resource not found"}}), 404

    @app.errorhandler(500)
    def handle_500(e):
        return jsonify({"error": {"code": "INTERNAL_ERROR", "message": "Something went wrong"}}), 500
    
