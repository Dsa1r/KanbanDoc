import { apiFetch } from './api.js';

function formatRelativeTime(isoDate) {
  if (!isoDate) return null;

  const diffSeconds = Math.round((new Date(isoDate) - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [unit, secondsInUnit] of units) {
    if (Math.abs(diffSeconds) >= secondsInUnit) {
      return formatter.format(Math.round(diffSeconds / secondsInUnit), unit);
    }
  }

  return 'just now';
}

function toProject(apiProject) {
  return {
    id: apiProject.project_id ?? apiProject.id,
    title: apiProject.name,
    description: apiProject.description ?? '',
    completedTasks: apiProject.progress?.done ?? 0,
    totalTasks: apiProject.progress?.total ?? 0,
    boardUrl: apiProject.board_url,
    updatedAt: formatRelativeTime(apiProject.updated_at ?? apiProject.created_at),
  };
}

export async function getDashboard() {
  const data = await apiFetch('/api/v1/dashboard', { auth: true });

  return {
    summaryText: data?.summary_text ?? '',
    projects: (data?.projects ?? []).map(toProject),
  };
}

export async function createProject({ title, templateId }) {
  return apiFetch('/api/v1/projects', {
    method: 'POST',
    body: { name: title, template_id: templateId },
    auth: true,
  });
}