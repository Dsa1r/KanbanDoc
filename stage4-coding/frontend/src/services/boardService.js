import { apiFetch } from './api.js'

const STATUS_TO_UI = { TO_DO: 'todo', IN_PROGRESS: 'in_progress', TESTING_REVIEW: 'review', DONE: 'done' }
const STATUS_TO_API = Object.fromEntries(Object.entries(STATUS_TO_UI).map(([api, ui]) => [ui, api]))
const STAGE_TO_UI = { DATABASE: 'db', BACKEND: 'backend', FRONTEND: 'frontend' }

function toTask(apiTask) {
  return {
    id: apiTask.id,
    title: apiTask.title,
    stage: STAGE_TO_UI[apiTask.stage_id] ?? apiTask.stage_id.toLowerCase(),
    status: STATUS_TO_UI[apiTask.current_status],
    note: apiTask.note,
    description: apiTask.description,
    resources: apiTask.resources ?? [],
  }
}

// GET /api/v1/projects/:id/board  ->  { project, tasks }
export async function getBoard(projectId) {
  const data = await apiFetch(`/api/v1/projects/${projectId}/board`, { auth: true })
  return {
    project: {
      id: data.project.id,
      name: data.project.name,
      description: data.project.description,
      isCompleted: data.project.is_completed,
    },
    // the API groups tasks by column; the screen filters them itself, so we flatten them
    tasks: Object.values(data.columns).flat().map(toTask),
  }
}

// PATCH /api/v1/tasks/:id/status   (status = 'todo' | 'in_progress' | 'review' | 'done')
export const updateTaskStatus = (taskId, status) =>
  apiFetch(`/api/v1/tasks/${taskId}/status`, {
    method: 'PATCH',
    body: { status: STATUS_TO_API[status] },
    auth: true,
  })