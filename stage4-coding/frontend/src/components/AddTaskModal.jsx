
import { useState } from "react";
import { createTask } from "../services/taskService";
import "./AddTaskModal.css";

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
                title.trim(),
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
        <div className="add-task-overlay" onClick={onClose}>
            <div
                className="add-task-modal"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="add-task-modal__title">
                    Add Task
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="add-task-modal__field">
                        <label htmlFor="new-task-title">
                            Task Title
                        </label>

                        <input
                            id="new-task-title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Enter task title"
                            disabled={loading}
                            autoFocus
                        />
                    </div>

                    <div className="add-task-modal__field">
                        <label htmlFor="new-task-stage">
                            Stage
                        </label>

                        <input
                            id="new-task-stage"
                            type="text"
                            value={stage}
                            disabled
                        />
                    </div>

                    {error && (
                        <p className="add-task-modal__error" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="add-task-modal__actions">
                        <button
                            type="button"
                            className="add-task-modal__cancel"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="add-task-modal__submit"
                            disabled={loading || !title.trim()}
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
