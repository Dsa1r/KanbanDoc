# read ext.admin_client at call time so tests can swap the database
from app import extensions as ext


def get_user_projects_with_tasks(user_id):
    memberships = (ext.admin_client.table('team_members')
                   .select('team_id')
                   .eq('user_id', user_id)
                   .execute().data)

    team_ids = [m['team_id'] for m in memberships]
    if not team_ids:
        return []

    return (ext.admin_client.table('projects')
            .select('id, project_name, description, created_at, tasks(current_status)')
            .in_('team_id', team_ids)
            .order('created_at', desc=True)
            .execute().data)