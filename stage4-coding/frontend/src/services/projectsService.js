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
  const projectId = apiProject.project_id ?? apiProject.id;

  return {
    id: projectId,
    title: apiProject.name,
    description: apiProject.description ?? '',
    completedTasks: apiProject.progress?.done ?? 0,
    totalTasks: apiProject.progress?.total ?? 0,
    boardUrl: apiProject.board_url ?? (projectId ? `/projects/${projectId}/kanban` : undefined),
    isOwner: Boolean(apiProject.is_owner),
    updatedAt: formatRelativeTime(apiProject.updated_at ?? apiProject.created_at),
  };
}

function shouldUseMocks() {
  return import.meta.env.DEV && window.location.pathname.startsWith('/dev/');
}

let mockProjects = [...mockDashboard.projects];

export async function getDashboard() {
  if (shouldUseMocks()) {
    // Simulate a slow network in the dev preview so loading states are visible
    await new Promise((resolve) => setTimeout(resolve, 1200));
  }

  const data = shouldUseMocks()
    ? { ...mockDashboard, projects: mockProjects }
    : await apiFetch('/api/v1/dashboard', { auth: true });

  return {
    summaryText: data?.summary_text ?? '',
    projects: (data?.projects ?? []).map(toProject),
  };
}

export async function createProject({ title, description, templateId, audience, members }) {
  if (shouldUseMocks()) {
    mockProjects = [
      {
        project_id: crypto.randomUUID(),
        is_owner: true,
        name: title,
        description,
        template_id: templateId,
        progress: { done: 0, total: 0, percent: 0 },
        created_at: new Date().toISOString(),
      },
      ...mockProjects,
    ];
    return;
  }

  // POST /api/v1/projects -> the new project (with board_url)
  const created = await apiFetch('/api/v1/projects', {
    method: 'POST',
    body: {
      name: title,
      description,
      template_id: templateId,   // 1 = pre-seeded starter tasks, 0 = blank
      mode: audience,            // 'solo' | 'team'
      member_emails: members,    // only used when mode is 'team'
    },
    auth: true,
  });

  return toProject(created);
}

export async function deleteProject(projectId) {
  if (shouldUseMocks()) {
    await new Promise((resolve) => setTimeout(resolve, 600));
    mockProjects = mockProjects.filter((project) => project.project_id !== projectId);
    return;
  }

  await apiFetch(`/api/v1/projects/${projectId}`, { method: 'DELETE', auth: true });
}