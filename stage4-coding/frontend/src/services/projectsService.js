import { apiFetch } from './api.js';
import { mockDashboard } from '../data/mockProjects.js';

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

// Mock data is used only in dev mode on /dev/* preview routes
function shouldUseMocks() {
  return import.meta.env.DEV && window.location.pathname.startsWith('/dev/');
}

let mockProjects = [...mockDashboard.projects];

export async function getDashboard() {
  const data = shouldUseMocks()
    ? { ...mockDashboard, projects: mockProjects }
    : await apiFetch('/api/v1/dashboard', { auth: true });

  return {
    summaryText: data?.summary_text ?? '',
    projects: (data?.projects ?? []).map(toProject),
  };
}

export async function createProject({ title, templateId, audience, members }) {
  if (shouldUseMocks()) {
    console.info('Mock create:', { title, templateId, audience, members });
    mockProjects = [
      {
        project_id: crypto.randomUUID(),
        name: title,
        template_id: templateId,
        progress: { done: 0, total: 0, percent: 0 },
        created_at: new Date().toISOString(),
      },
      ...mockProjects,
    ];
    return;
  }

  // TODO (Dana): confirm field names for the project type and team members,
  // then send them too, e.g. project_type: audience, member_emails: members
  return apiFetch('/api/v1/projects', {
    method: 'POST',
    body: { name: title, template_id: templateId },
    auth: true,
  });
}