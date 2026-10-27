from app.services import project_service


def get_dashboard(user):
    name = (user.user_metadata or {}).get('name', '')
    return {
        "summary_text": f"Welcome back, {name}! Continue building your project step by step.",
        "projects": project_service.get_user_projects(user.id),
    }