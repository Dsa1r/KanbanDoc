import { useState } from "react";
import { createTask } from "../services/taskService";
import "./AddTaskModal.css";

function AddTaskModal({
    projectId,
    stage: initialStage, // تم إعادة تسمية الـ prop لنتجنب التعارض
    token,
    onClose,
    onTaskCreated
}) {
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [stage, setStage] = useState(initialStage || ""); // الحالة المحلية المستقلة للـ select
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        if (!title.trim()) {
            setError("Task title is required");
            return;
        }

        if (!stage) {
            setError("Please select a valid stage");
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
                        <div className="form-group">
                            <label>Stage</label>
                            <select 
                                value={stage} 
                                onChange={(e) => setStage(e.target.value)}
                                disabled={loading}
                            >
                                <option value="">Select Stage</option>
                                <option value="DATABASE">DATABASE</option>
                                <option value="FRONTEND">FRONTEND</option>
                                <option value="BACKEND">BACKEND</option>
                            </select>
                        </div>
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
                            disabled={loading || !title.trim() || !stage}
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