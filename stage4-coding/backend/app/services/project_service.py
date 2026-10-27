from app.extensions import get_supabase


class ValidationError(Exception):
    pass

from app.repositories import project_repo


def get_user_projects(user_id):
    rows = project_repo.get_user_projects_with_tasks(user_id)
    projects = []
    for p in rows:
        tasks = p.get('project_tasks') or []
        done = sum(1 for t in tasks if t['current_status'] == 'completed')
        projects.append({
            "id": p['id'],
            "project_name": p['project_name'],
            "description": p['description'],
            "created_at": p['created_at'],
            "total_tasks": len(tasks),
            "completed_tasks": done,
        })
    return projects

    
def create_project(name, description=None):
    # 1) validate the input
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("Project name is required")
    name = name.strip()
    if len(name) > 100:
        raise ValidationError("Project name must be 100 characters or less")

    if description is not None:
        if not isinstance(description, str):
            raise ValidationError("description must be text")
        description = description.strip() or None

    # 2) save it in the projects table
    res = (
        get_supabase()
        .table("projects")
        .insert({"project_name": name, "description": description})
        .execute()
    )
    return res.data[0]
