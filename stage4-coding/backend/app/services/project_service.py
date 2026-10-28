from app.extensions import admin_client
from app.repositories import project_repo


class ValidationError(Exception):
    pass


def _to_api_project(p):
    tasks = p.get('project_tasks') or []
    done = sum(1 for t in tasks if t['current_status'] == 'completed')  # عدّلها حسب قيمة جدولك
    total = len(tasks)
    return {
        "id": p['id'],
        "name": p['project_name'],
        "description": p.get('description'),
        "created_at": p['created_at'],
        "progress": {
            "done": done,
            "total": total,
            "percent": round(done * 100 / total) if total else 0,
        },
    }


def get_user_projects(user_id):
    rows = project_repo.get_user_projects_with_tasks(user_id)
    return [_to_api_project(p) for p in rows]


def _find_user_ids_by_emails(emails):
    wanted = {e.strip().lower() for e in emails if isinstance(e, str) and e.strip()}
    found = {}
    page = 1
    while len(found) < len(wanted):
        users = admin_client.auth.admin.list_users(page=page, per_page=200)
        if not users:
            break
        for u in users:
            if u.email and u.email.lower() in wanted:
                found[u.email.lower()] = u.id
        if len(users) < 200:
            break
        page += 1
    return found, wanted - set(found)


def create_project(user, name, description=None, mode="solo",
                   member_emails=None, **_ignored):
    if not isinstance(name, str) or not name.strip():
        raise ValidationError("Project name is required")
    name = name.strip()
    if len(name) > 100:
        raise ValidationError("Project name must be 100 characters or less")

    if description is not None:
        if not isinstance(description, str):
            raise ValidationError("description must be text")
        description = description.strip() or None

    if mode not in ("solo", "team"):
        raise ValidationError("mode must be 'solo' or 'team'")

    member_ids = []
    if mode == "team" and member_emails:
        emails = [e for e in member_emails
                  if isinstance(e, str) and e.strip().lower() != (user.email or "").lower()]
        found, missing = _find_user_ids_by_emails(emails)
        if missing:
            raise ValidationError("No account found for: " + ", ".join(sorted(missing)))
        member_ids = list(found.values())

    team_id = None
    try:
        team = admin_client.table('teams').insert({"team_name": name}).execute().data[0]
        team_id = team['id']

        rows = [{"team_id": team_id, "user_id": uid} for uid in [user.id, *member_ids]]
        admin_client.table('team_members').insert(rows).execute()

        p = (admin_client.table('projects')
             .insert({"project_name": name, "description": description, "team_id": team_id})
             .execute().data[0])
        p['project_tasks'] = []
        return _to_api_project(p)
    except Exception:
        if team_id:
            admin_client.table('teams').delete().eq('id', team_id).execute()
        raise