import logging

# We read `ext.admin_client` at call time so the tests can swap in a fake database.
from app import extensions as ext
from app.repositories import project_repo
from app.services.starter_template import STARTER_TASKS
from app.utils.constants import STAGES
from app.utils.errors import ApiError


logger = logging.getLogger(__name__)


class ValidationError(Exception):
    pass


BLANK_TEMPLATE = 0      # 3 stages, no tasks
STARTER_TEMPLATE = 1    # 3 stages + the starter tasks
STARTER_TEMPLATE_NAME = "Starter template"   # optional row in project_templates
STAGE_ALIASES = {"DB": "DATABASE"}


def _to_api_project(p):
    """Shape a projects row (with its embedded tasks) the way the frontend expects it."""
    tasks = p.get('tasks') or []
    done = sum(1 for t in tasks if t.get('current_status') == 'DONE')
    total = len(tasks)
    return {
        "id": p['id'],
        "project_id": p['id'],
        "name": p['project_name'],
        "description": p.get('description'),
        "created_at": p['created_at'],
        # the dashboard card and the "after creating" redirect both open this page
        "board_url": f"/projects/{p['id']}/board",
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
        users = ext.admin_client.auth.admin.list_users(page=page, per_page=200)
        if not users:
            break
        for u in users:
            if u.email and u.email.lower() in wanted:
                found[u.email.lower()] = u.id
        if len(users) < 200:
            break
        page += 1
    return found, wanted - set(found)


def _clean_tasks(raw):
    """Keep only valid template entries: a title and a known stage."""
    cleaned = []
    for item in raw if isinstance(raw, list) else []:
        if not isinstance(item, dict):
            continue
        title = str(item.get('title') or '').strip()
        stage = str(item.get('stage') or '').strip().upper()
        stage = STAGE_ALIASES.get(stage, stage)
        if not title or stage not in STAGES:
            continue
        cleaned.append({
            "title": title[:255],
            "stage": stage,
            "note": item.get('note') or '',
            "description": item.get('description') or '',
            "resources": item.get('resources') or [],
        })
    return cleaned

def _starter_tasks():
    """Tasks for the pre-seeded template: the built-in list of 18 starter tasks."""
    return _clean_tasks(STARTER_TASKS)


def _rollback(project_id, team_id):
    """Undo a half-finished creation. Deleting the project removes its tasks, the team removes its members."""
    try:
        if project_id:
            ext.admin_client.table('projects').delete().eq('id', project_id).execute()
        if team_id:
            ext.admin_client.table('teams').delete().eq('id', team_id).execute()
    except Exception:
        pass  # never hide the original error behind a clean-up error


def create_project(user, name, description=None, mode="solo",
                   member_emails=None, template_id=BLANK_TEMPLATE, **_ignored):
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

    if template_id is None:
        template_id = BLANK_TEMPLATE
    if isinstance(template_id, bool) or template_id not in (BLANK_TEMPLATE, STARTER_TEMPLATE):
        raise ValidationError("template_id must be 0 (blank) or 1 (starter template)")

    member_ids = []
    if mode == "team" and member_emails:
        emails = [e for e in member_emails
                  if isinstance(e, str) and e.strip().lower() != (getattr(user, "email", "") or "").lower()]
        found, missing = _find_user_ids_by_emails(emails)
        if missing:
            raise ValidationError("No account found for: " + ", ".join(sorted(missing)))
        member_ids = list(found.values())

    team_id = project_id = None
    try:
        team = ext.admin_client.table('teams').insert({"team_name": name}).execute().data[0]
        team_id = team['id']

        members = [{"team_id": team_id, "user_id": user.id, "is_owner": True}]
        members += [{"team_id": team_id, "user_id": uid, "is_owner": False} for uid in member_ids]
        ext.admin_client.table('team_members').insert(members).execute()

        project = (ext.admin_client.table('projects')
                   .insert({"project_name": name, "description": description, "team_id": team_id})
                   .execute().data[0])
        project_id = project['id']

        tasks = _starter_tasks() if template_id == STARTER_TEMPLATE else []
        if tasks:
            ext.admin_client.table('tasks').insert([
                {"project_id": project_id, "position": position, **task}
                for position, task in enumerate(tasks, start=1)
            ]).execute()

        project['tasks'] = [{"current_status": "TO_DO"} for _ in tasks]
        return _to_api_project(project)
    except Exception as exc:
        # print the real reason in the backend terminal (the API only returns a generic message)
        logger.exception("create_project failed")
        _rollback(project_id, team_id)
        raise ApiError("DATABASE_ERROR", "Could not create the project. Nothing was saved.", 500) from exc