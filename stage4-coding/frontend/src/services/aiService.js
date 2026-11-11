import { apiFetch } from './api.js'

/**
 * Ask the backend to generate tasks (with phase templates) for an empty project.
 * answers: { product, users, features, stack, timeline }
 * Returns { tasks, progress, phases_missing }.
 * Generation can take up to a minute or two.
 */
export async function generateAiTasks(projectId, answers) {
  const result = await apiFetch(`/api/v1/projects/${projectId}/ai-tasks`, {
    method: 'POST',
    body: { answers },
    auth: true,
  })

  // Support both shapes: { data: {...} } and the already-unwrapped object
  return result?.data ?? result
}