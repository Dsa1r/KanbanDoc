import { apiFetch } from './api.js';

export async function createTask(projectId, title, stage) {
    if (!projectId) {
        throw new Error("Project ID is missing or undefined");
    }

    return await apiFetch('/api/v1/tasks/', {
        method: 'POST',
        body: {
            project_id: projectId,
            title,
            stage
        },
        auth: true
    });
}