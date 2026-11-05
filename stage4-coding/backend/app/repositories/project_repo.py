# read ext.admin_client at call time so tests can swap the database
from app import extensions as ext


def get_user_projects_with_tasks(user_id):
    memberships = (ext.admin_client.table('team_members')
                   .select('team_id, is_owner')
                   .eq('user_id', user_id)
                   .execute().data)

    # team_id -> is this user the owner of that team's project?
    owner_by_team = {m['team_id']: bool(m.get('is_owner')) for m in memberships}
    if not owner_by_team:
        return []

    projects = (ext.admin_client.table('projects')
                .select('id, team_id, project_name, description, created_at, tasks(current_status)')
                .in_('team_id', list(owner_by_team))
                .order('created_at', desc=True)
                .execute().data)

    for project in projects:
        project['is_owner'] = owner_by_team.get(project['team_id'], False)

    return projects