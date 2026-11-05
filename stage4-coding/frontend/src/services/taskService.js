export async function createTask(
    projectId,
    title,
    stage,
    token
) {
    const response = await fetch(
        `${API_URL}/api/v1/tasks/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                project_id: projectId,
                title,
                stage
            })
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(
            result.message || "Failed to create task"
        );
    }

    return result.data;
}