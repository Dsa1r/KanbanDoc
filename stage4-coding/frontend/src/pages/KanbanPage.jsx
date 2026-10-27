import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BoardHeader from '../components/BoardHeader.jsx';
import NextUpBanner from '../components/NextUpBanner.jsx';
import KanbanColumn from '../components/KanbanColumn.jsx';
import TaskDrawer from '../components/TaskDrawer.jsx';
import { BOARD_COLUMNS, STAGES, mockBoard } from '../data/mockBoard.js';
import { getBoard, updateTaskStatus } from '../services/boardService.js';
import '../styles/kanban.css';

export default function KanbanPage() {
  // /projects/:projectId/board  -> real data from the API
  // /dev/kanban (no projectId)  -> the mock board, for UI work without a backend
  const { projectId } = useParams();

  const [project, setProject] = useState(projectId ? null : mockBoard.project);
  const [tasks, setTasks] = useState(projectId ? [] : mockBoard.tasks);
  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [error, setError] = useState('');
  const [activeStages, setActiveStages] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    if (!projectId) return undefined;
    let ignore = false;

    getBoard(projectId)
      .then((board) => {
        if (ignore) return;
        setProject(board.project);
        setTasks(board.tasks);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      })
      .finally(() => {
        if (!ignore) setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [projectId]);

  const readOnly = Boolean(project?.isCompleted);
  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const nextTask = tasks.find((task) => task.status === 'todo');
  const selectedTask = tasks.find((task) => task.id === selectedTaskId);

  const visibleTasks =
    activeStages.length === 0
      ? tasks
      : tasks.filter((task) => activeStages.includes(task.stage));

  function toggleStage(stageId) {
    setActiveStages((prevStages) =>
      prevStages.includes(stageId)
        ? prevStages.filter((id) => id !== stageId)
        : [...prevStages, stageId],
    );
  }

  // Move a task to another column: update the screen first, then save it,
  // and put the task back if the server says no.
  async function handleMoveTask(taskId, newStatus) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task || task.status === newStatus || readOnly) return;

    const oldStatus = task.status;
    const setStatus = (status) =>
      setTasks((prev) => prev.map((item) => (item.id === taskId ? { ...item, status } : item)));

    setStatus(newStatus);
    setError('');
    if (!projectId) return; // mock board: nothing to save

    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (err) {
      setStatus(oldStatus);
      setError(err.message);
    }
  }

  if (isLoading) {
    return <p className="kanban-status">Loading board…</p>;
  }

  if (!project) {
    return (
      <p className="kanban-status kanban-status--error" role="alert">
        {error || 'Board not found.'}
      </p>
    );
  }

  return (
    <div className="kanban-page">
      <BoardHeader
        projectName={project.name}
        description={project.description}
        progress={progress}
        stages={STAGES}
        activeStages={activeStages}
        onToggleStage={toggleStage}
        backTo={projectId ? '/dashboard' : null}
      />

      <main className="kanban">
        {error && <p className="kanban-status kanban-status--error" role="alert">{error}</p>}

        {nextTask && <NextUpBanner task={nextTask} onOpen={(task) => setSelectedTaskId(task.id)} />}

        <div className="kanban__columns">
          {BOARD_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={visibleTasks.filter((task) => task.status === column.id)}
              selectedTaskId={selectedTaskId}
              onOpenTask={(task) => setSelectedTaskId(task.id)}
              onMoveTask={readOnly ? undefined : handleMoveTask}
            />
          ))}
        </div>
      </main>

      {selectedTask && (
        <TaskDrawer
          task={selectedTask}
          columns={BOARD_COLUMNS}
          onChangeStatus={readOnly ? undefined : handleMoveTask}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}