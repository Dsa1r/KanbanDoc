import { apiFetch } from './api.js'

const STATUS_TO_UI = { TO_DO: 'todo', IN_PROGRESS: 'in_progress', TESTING_REVIEW: 'review', DONE: 'done' }
const STATUS_TO_API = Object.fromEntries(Object.entries(STATUS_TO_UI).map(([api, ui]) => [ui, api]))
const STAGE_TO_UI = { DATABASE: 'db', BACKEND: 'backend', FRONTEND: 'frontend' }

// Every URL in one place, so it is easy to match them with the Flask routes.
// Only the board path comes from the Flask code that was shared (check its prefix);
// the phase and status paths must be matched with the real routes.
const PATHS = {
  board: (projectId) => `/api/v1/projects/${projectId}/kanban`,
  phase: (taskId) => `/api/v1/tasks/${taskId}/phase`,
  status: (taskId) => `/api/v1/tasks/${taskId}/status`,
}

// A board task only carries what the card needs.
// The long content (description, resources, ...) comes from getTaskPhase().
function toTask(apiTask) {
  return {
    id: apiTask.id,
    title: apiTask.title,
    stage: STAGE_TO_UI[apiTask.stage_id] ?? apiTask.stage_id.toLowerCase(),
    status: STATUS_TO_UI[apiTask.current_status],
    note: apiTask.note ?? '',
  }
}

// One checklist item. If the JSON items in task_phases look different, change only this function.
function toChecklistItem(item) {
  return typeof item === 'string' ? { label: item } : { label: item.label ?? '' }
}

// GET board  ->  { project, tasks }
export async function getBoard(projectId) {
  const data = await apiFetch(PATHS.board(projectId), { auth: true })
  const project = data.project ?? {} // the board response should carry the project; fall back so the page still opens
  return {
    project: {
      id: project.id ?? projectId,
      name: project.name ?? 'Project board',
      description: project.description ?? '',
      isCompleted: project.is_completed ?? false,
    },
    // the API groups tasks by column; the screen filters them itself, so we flatten them
    tasks: Object.values(data.columns).flat().map(toTask),
  }
}

// GET phase  ->  the content of the task's CURRENT status (the backend reads tasks.current_status)
export async function getTaskPhase(taskId) {
  const data = await apiFetch(PATHS.phase(taskId), { auth: true })
  const phase = data.phase ?? data
  return {
    description: phase.description ?? '',
    whyItMatters: phase.why_it_matters ?? '',
    resources: phase.resources ?? [],
    checklist: (phase.checklist ?? []).map(toChecklistItem),
  }
}

// PATCH status   (status = 'todo' | 'in_progress' | 'review' | 'done')
export const updateTaskStatus = (taskId, status) =>
  apiFetch(PATHS.status(taskId), {
    method: 'PATCH',
    body: { status: STATUS_TO_API[status] },
    auth: true,
  })