import { apiFetch } from './api.js';
import { mockDashboard, mockMembers } from '../data/mockProjects.js';

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
    boardUrl: apiProject.board_url ?? (projectId ? `/projects/${projectId}/board` : undefined),
    isOwner: Boolean(apiProject.is_owner),
    updatedAt: formatRelativeTime(apiProject.updated_at ?? apiProject.created_at),
  };
}

function toMember(apiMember) {
  return {
    userId: apiMember.user_id,
    email: apiMember.email ?? '',
    isOwner: Boolean(apiMember.is_owner),
    role: apiMember.is_qa ? 'qa' : 'member',
  };
}

// Mock data is used only in dev mode on /dev/* preview routes
function shouldUseMocks() {
  return import.meta.env.DEV && window.location.pathname.startsWith('/dev/');
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let mockProjects = [...mockDashboard.projects];
const mockMembersByProject = { ...mockMembers };

export async function getDashboard() {
  if (shouldUseMocks()) {
    // Simulate a slow network in the dev preview so loading states are visible
    await delay(1200);
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
      members,                   // [{ email, role }] — only used when mode is 'team'
    },
    auth: true,
  });

  return toProject(created);
}

export async function deleteProject(projectId) {
  if (shouldUseMocks()) {
    await delay(600);
    mockProjects = mockProjects.filter((project) => project.project_id !== projectId);
    return;
  }

  // DELETE /api/v1/projects/<id> -> owner only
  await apiFetch(`/api/v1/projects/${projectId}`, { method: 'DELETE', auth: true });
}

export async function getProjectDetails(projectId) {
  if (shouldUseMocks()) {
    await delay(500);
    const project = mockProjects.find((item) => item.project_id === projectId);
    if (!project) throw new Error('Project not found');

    return {
      id: project.project_id,
      title: project.name,
      description: project.description ?? '',
      members: (mockMembersByProject[projectId] ?? []).map(toMember),
    };
  }

  // GET /api/v1/projects/<id> -> owner only
  const data = await apiFetch(`/api/v1/projects/${projectId}`, { auth: true });
  return {
    id: data.id,
    title: data.name,
    description: data.description ?? '',
    members: (data.members ?? []).map(toMember),
  };
}

export async function updateProject(projectId, { title, description, members }) {
  if (shouldUseMocks()) {
    await delay(600);
    mockProjects = mockProjects.map((project) =>
      project.project_id === projectId
        ? { ...project, name: title, description, updated_at: new Date().toISOString() }
        : project,
    );
    const owners = (mockMembersByProject[projectId] ?? []).filter((member) => member.is_owner);
    mockMembersByProject[projectId] = [
      ...owners,
      ...members.map(({ email, role }) => ({
        user_id: email,
        email,
        is_owner: false,
        is_qa: role === 'qa',
      })),
    ];
    return;
  }

  // PATCH /api/v1/projects/<id> -> owner only
  const updated = await apiFetch(`/api/v1/projects/${projectId}`, {
    method: 'PATCH',
    body: { name: title, description, members },
    auth: true,
  });
  return toProject(updated);
}