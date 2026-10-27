from app.extensions import get_supabase


class ValidationError(Exception):
    pass


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
