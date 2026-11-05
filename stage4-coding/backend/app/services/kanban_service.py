from app.repositories.task_repository import get_project_tasks


def get_kanban(project_id):
    """
    Build the Kanban board from project tasks.
    """

    tasks = get_project_tasks(project_id)

    columns = {
        "TO_DO": [],
        "IN_PROGRESS": [],
        "TESTING_REVIEW": [],
        "DONE": []
    }

    for task in tasks:
        status = task["current_status"]

        columns[status].append({
            "id": task["id"],
            "title": task["title"],
            "stage_id": task["stage"],
            "current_status": status
        })

    total = len(tasks)

    done = sum(
        1 for task in tasks
        if task["current_status"] == "DONE"
    )

    percent = round((done / total) * 100) if total else 0

    return {
        "progress": {
            "done": done,
            "total": total,
            "percent": percent
        },
        "columns": columns
    }