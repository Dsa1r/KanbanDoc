import { useState } from "react";
import { createTask } from "../services/taskService";

function AddTaskModal({
    projectId,
    stage,
    token,
    onClose,
    onTaskCreated
}) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const task = await createTask(
                projectId,
                title,
                stage,
                token
            );

            onTaskCreated(task);
            onClose();

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="modal-overlay">
            <div className="modal">

                <h2>Add Task</h2>

                <form onSubmit={handleSubmit}>

                    <label>Task Title</label>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter task title"
                        disabled={loading}
                    />

                    <label>Stage</label>

                    <input
                        type="text"
                        value={stage}
                        disabled
                    />

                    {error && <p>{error}</p>}

                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading || !title.trim()}
                    >
                        {loading ? "Creating..." : "Create Task"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;