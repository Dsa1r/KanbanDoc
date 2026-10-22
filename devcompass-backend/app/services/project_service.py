from app.repositories import project_repo


def calculate_progress_percentage(tasks):
    total = len(tasks)
    done = sum(1 for t in tasks if t['current_status'] == 'DONE')
    percent = round(done / total * 100) if total else 0
    return {"done": done, "total": total, "percent": percent}


def get_user_projects(user_id):
    projects = project_repo.get_user_projects_with_tasks(user_id)
    return [
        {
            "project_id": p['id'],
            "name": p['project_name'],
            "progress": calculate_progress_percentage(p['project_tasks']),
            "board_url": f"/projects/{p['id']}/board",
        }
        for p in projects
    ]