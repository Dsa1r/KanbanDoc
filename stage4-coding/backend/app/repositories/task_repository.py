from app import extensions as ext


def get_project_tasks(project_id):
    """
    Retrieve all tasks for a project.
    """

    return (
        ext.admin_client
        .table("tasks")
        .select(
            "id, project_id, title, stage, current_status"
        )
        .eq("project_id", project_id)
        .execute()
        .data
    )


def get_task(task_id):
    """
    Retrieve a single task.
    """

    return (
        ext.admin_client
        .table("tasks")
        .select(
            "id, project_id, title, stage, current_status"
        )
        .eq("id", task_id)
        .single()
        .execute()
        .data
    )


def update_task_status(task_id, new_status):
    """
    Update the current status of a task.
    """

    return (
        ext.admin_client
        .table("tasks")
        .update({
            "current_status": new_status
        })
        .eq("id", task_id)
        .execute()
        .data
    )

def get_task_phase(task_id, status):
    """
    Retrieve the phase content for a task's current status.
    """

    return (
        ext.admin_client
        .table("task_phases")
        .select(
            "id, task_id, status, description, "
            "why_it_matters, resources, checklist"
        )
        .eq("task_id", task_id)
        .eq("status", status)
        .single()
        .execute()
        .data
    )
