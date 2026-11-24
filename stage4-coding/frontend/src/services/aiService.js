import { apiFetch } from './api.js'

// Fill the 5 answers from pasted requirements / use-case text.
// Returns { product, users, features, stack, timeline } (empty string when missing).
export async function extractAiAnswers(projectId, text) {
  const result = await apiFetch(`/api/v1/projects/${projectId}/ai-extract`, {
    method: 'POST',
    body: { text },
    auth: true,
  })

  const data = result?.data ?? result
  return data.answers
}

/**
 * Ask the backend to generate tasks (with phase templates) for an empty project.
 * answers: { product, users, features, stack, timeline }
 * Returns { tasks, progress, phases_missing }.
 * Generation can take up to a minute.
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