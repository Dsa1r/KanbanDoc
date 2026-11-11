import logging

# We read `ext.admin_client` at call time so the tests can swap in a fake database.
from app import extensions as ext
from app.repositories import project_repo
from app.services.task_service import create_fixed_tasks
from app.utils.constants import STAGES
from app.utils.errors import ApiError
from app.middleware.project_access import ensure_project_owner


logger = logging.getLogger(__name__)


class ValidationError(Exception):
    pass


BLANK_TEMPLATE = 0      # 3 stages, no tasks
STARTER_TEMPLATE = 1    # 3 stages + fixed tasks
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
        "is_owner": bool(p.get('is_owner')),
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


def _rollback(project_id, team_id):
    """Undo a half-finished creation. Deleting the project removes its tasks, the team removes its members."""
    try:
        if project_id:
            ext.admin_client.table('projects').delete().eq('id', project_id).execute()

        if team_id:
            ext.admin_client.table('teams').delete().eq('id', team_id).execute()

    except Exception:
        pass  # never hide the original error behind a clean-up error

ALLOWED_ROLES = ("member", "qa")


def _normalize_members(members, member_emails, owner_email):
    """Return {email: is_qa}. Accepts the new shape [{email, role}] or the old list of emails."""
    if members is None:
        # old shape: every email is a normal member
        members = [
            {"email": e, "role": "member"}
            for e in (member_emails or [])
            if isinstance(e, str) and e.strip()
        ]

    if not isinstance(members, list):
        raise ValidationError("members must be a list")

    result = {}
    for m in members:
        if not isinstance(m, dict):
            raise ValidationError("Each member must have an email and a role")

        email = m.get("email")
        role = m.get("role") or "member"

        if not isinstance(email, str) or not email.strip():
            raise ValidationError("Each member needs an email")
        if role not in ALLOWED_ROLES:
            raise ValidationError("role must be 'member' or 'qa'")

        email = email.strip().lower()
        if email == owner_email:
            continue  # the owner is added separately

        result[email] = (role == "qa")

    return result


def create_project(user, name, description=None, mode="solo",
                   member_emails=None, members=None,
                   template_id=BLANK_TEMPLATE, **_ignored):

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

    owner_email = (getattr(user, "email", "") or "").lower()
    member_roles = {}   # user_id -> is_qa

    if mode == "team":
        wanted = _normalize_members(members, member_emails, owner_email)

        found, missing = _find_user_ids_by_emails(list(wanted))

        if missing:
            raise ValidationError("No account found for: " + ", ".join(sorted(missing)))

        member_roles = {found[email]: is_qa for email, is_qa in wanted.items()}

    team_id = project_id = None

    try:
        team = ext.admin_client.table('teams').insert(
            {"team_name": name}
        ).execute().data[0]

        team_id = team['id']

        member_rows = [
            {"team_id": team_id, "user_id": user.id, "is_owner": True, "is_qa": False}
        ]

        member_rows += [
            {"team_id": team_id, "user_id": uid, "is_owner": False, "is_qa": is_qa}
            for uid, is_qa in member_roles.items()
        ]

        ext.admin_client.table('team_members').insert(member_rows).execute()

        project = (
            ext.admin_client.table('projects')
            .insert({
                "project_name": name,
                "description": description,
                "team_id": team_id,
                "template_id": template_id,
            })
            .execute()
            .data[0]
        )

        project_id = project['id']

        # Create fixed tasks and their four phases
        tasks = []

        if template_id == STARTER_TEMPLATE:
            tasks = create_fixed_tasks(project_id)

        project['tasks'] = [
            {"current_status": "TO_DO"}
            for _ in tasks
        ]

        project['is_owner'] = True
        return _to_api_project(project)

    except Exception as exc:
        # print the real reason in the backend terminal (the API only returns a generic message)
        logger.exception("create_project failed")

        _rollback(project_id, team_id)

        raise ApiError(
            "DATABASE_ERROR",
            "Could not create the project. Nothing was saved.",
            500
        ) from exc


def delete_project(user, project_id):
    """Delete a project, its tasks and its team. Only the owner can do this."""
    project = ensure_project_owner(project_id, user.id)

    try:
        # deleting the project also deletes its tasks (on delete cascade)
        ext.admin_client.table('projects').delete().eq('id', project['id']).execute()
        # deleting the team also deletes its members (on delete cascade)
        if project.get('team_id'):
            ext.admin_client.table('teams').delete().eq('id', project['team_id']).execute()
    except Exception as exc:
        logger.exception("delete_project failed")
        raise ApiError("DATABASE_ERROR", "Could not delete the project. Please try again.", 500) from exc


def _get_user_email(user_id):
    try:
        response = ext.admin_client.auth.admin.get_user_by_id(user_id)
        return getattr(response.user, 'email', '') or ''
    except Exception:
        logger.warning("Could not load the email of user %s", user_id)
        return ''


def get_project_details(user, project_id):
    """Project info and its members (with emails) for the edit form. Only the owner can do this."""
    project = ensure_project_owner(project_id, user.id)
    members = project_repo.get_team_members(project['team_id'])

    return {
        "id": project['id'],
        "name": project['project_name'],
        "description": project.get('description'),
        "members": [
            {
                "user_id": m['user_id'],
                "email": _get_user_email(m['user_id']),
                "is_owner": bool(m.get('is_owner')),
                "is_qa": bool(m.get('is_qa')),
            }
            for m in members
        ],
    }


def update_project(user, project_id, name=None, description=None, member_emails=None, members=None):
    """Update the name, description and members of a project. Only the owner can do this."""
    project = ensure_project_owner(project_id, user.id)

    if not isinstance(name, str) or not name.strip():
        raise ValidationError("Project name is required")
    name = name.strip()
    if len(name) > 100:
        raise ValidationError("Project name must be 100 characters or less")

    if description is not None and not isinstance(description, str):
        raise ValidationError("description must be text")
    description = (description or '').strip() or None

    if member_emails is None:
        member_emails = []
    if not isinstance(member_emails, list):
        raise ValidationError("member_emails must be a list")

    owner_email = (getattr(user, 'email', '') or '').lower()
    wanted = _normalize_members(members, member_emails, owner_email)
    found, missing = _find_user_ids_by_emails(list(wanted))
    if missing:
        raise ValidationError("No account found for: " + ", ".join(sorted(missing)))
    wanted_roles = {found[email]: is_qa for email, is_qa in wanted.items()}

    team_id = project['team_id']
    current = project_repo.get_team_members(team_id)
    current_roles = {m['user_id']: bool(m.get('is_qa')) for m in current if not m.get('is_owner')}

    to_add = set(wanted_roles) - set(current_roles)
    to_remove = set(current_roles) - set(wanted_roles)
    to_update = {
        uid for uid in set(wanted_roles) & set(current_roles)
        if wanted_roles[uid] != current_roles[uid]
    }

    try:
        (ext.admin_client.table('projects')
         .update({"project_name": name, "description": description})
         .eq('id', project['id'])
         .execute())
        (ext.admin_client.table('teams')
         .update({"team_name": name})
         .eq('id', team_id)
         .execute())

        if to_add:
            ext.admin_client.table('team_members').insert([
                {"team_id": team_id, "user_id": uid, "is_owner": False, "is_qa": wanted_roles[uid]}
                for uid in to_add
            ]).execute()

        for uid in to_update:
            (ext.admin_client.table('team_members')
             .update({"is_qa": wanted_roles[uid]})
             .eq('team_id', team_id)
             .eq('user_id', uid)
             .execute())

        if to_remove:
            (ext.admin_client.table('team_members')
             .delete()
             .eq('team_id', team_id)
             .in_('user_id', list(to_remove))
             .execute())
    except Exception as exc:
        logger.exception("update_project failed")
        raise ApiError("DATABASE_ERROR", "Could not save the changes. Please try again.", 500) from exc

    updated = project_repo.get_project_with_tasks(project['id'])
    updated['is_owner'] = True
    return _to_api_project(updated)