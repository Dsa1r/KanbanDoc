
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import BoardHeader from '../components/BoardHeader.jsx';
import NextUpBanner from '../components/NextUpBanner.jsx';
import KanbanColumn from '../components/KanbanColumn.jsx';
import TaskDrawer from '../components/TaskDrawer.jsx';
import AddTaskModal from '../components/AddTaskModal.jsx';

import {
  BOARD_COLUMNS,
  STAGES,
  mockBoard,
} from '../data/mockBoard.js';

import {
  getBoard,
  getTaskPhase,
  updateTaskStatus,
} from '../services/boardService.js';

import '../styles/kanban.css';

export default function KanbanPage() {

  const { projectId } = useParams();

  // Authentication token
  const token = localStorage.getItem('access_token');

  const [project, setProject] = useState(
    projectId ? null : mockBoard.project
  );

  const [tasks, setTasks] = useState(
    projectId ? [] : mockBoard.tasks
  );

  const [isLoading, setIsLoading] = useState(Boolean(projectId));
  const [error, setError] = useState('');

  const [activeStages, setActiveStages] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [phaseVersion, setPhaseVersion] = useState(0);

  // Add Task Modal
  const [showAddTask, setShowAddTask] = useState(false);

  // Load board
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

  // Board calculations
  const readOnly = Boolean(project?.isCompleted);

  const doneCount = tasks.filter(
    (task) => task.status === 'done'
  ).length;

  const progress = tasks.length > 0
    ? Math.round((doneCount / tasks.length) * 100)
    : 0;

  const nextTask = tasks.find(
    (task) => task.status === 'todo'
  );

  const selectedTask = tasks.find(
    (task) => task.id === selectedTaskId
  );

  // Filter tasks by stage
  const visibleTasks =
    activeStages.length === 0
      ? tasks
      : tasks.filter((task) =>
          activeStages.includes(task.stage)
        );

  function toggleStage(stageId) {

    setActiveStages((prevStages) =>
      prevStages.includes(stageId)
        ? prevStages.filter((id) => id !== stageId)
        : [...prevStages, stageId]
    );

  }

  // Move task between columns
  async function handleMoveTask(taskId, newStatus) {

    const task = tasks.find(
      (item) => item.id === taskId
    );

    if (!task || task.status === newStatus || readOnly) {
      return;
    }

    const oldStatus = task.status;

    const setStatus = (status) => {
      setTasks((prev) =>
        prev.map((item) =>
          item.id === taskId
            ? { ...item, status }
            : item
        )
      );
    };

    // Update UI immediately
    setStatus(newStatus);
    setError('');

    if (!projectId) return;

    try {

      await updateTaskStatus(taskId, newStatus);

      setPhaseVersion((version) => version + 1);

    } catch (err) {

      setStatus(oldStatus);
      setError(err.message);

    }

  }

  // Loading state
  if (isLoading) {
    return (
      <p className="kanban-status">
        Loading board…
      </p>
    );
  }

  // Project not found
  if (!project) {
    return (
      <p
        className="kanban-status kanban-status--error"
        role="alert"
      >
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

        {error && (
          <p
            className="kanban-status kanban-status--error"
            role="alert"
          >
            {error}
          </p>
        )}

        {/* Add Task Button */}
        {projectId && !readOnly && (
          <button
            type="button"
            className="kanban__add-task-btn"
            onClick={() => setShowAddTask(true)}
          >
            + Add Task
          </button>
        )}

        {/* Next Task */}
        {nextTask && (
          <NextUpBanner
            task={nextTask}
            onOpen={(task) => setSelectedTaskId(task.id)}
          />
        )}

        {/* Kanban Columns */}
        <div className="kanban__columns">

          {BOARD_COLUMNS.map((column) => (

            <KanbanColumn
              key={column.id}
              column={column}
              tasks={visibleTasks.filter(
                (task) => task.status === column.id
              )}
              selectedTaskId={selectedTaskId}
              onOpenTask={(task) =>
                setSelectedTaskId(task.id)
              }
              onMoveTask={
                readOnly ? undefined : handleMoveTask
              }
            />

          ))}

        </div>

      </main>

      {/* Add Task Modal */}
      {showAddTask && (

          <AddTaskModal
              projectId={projectId}
              stage=""
              token={token}
              onClose={() => setShowAddTask(false)}
              onTaskCreated={() => {
                  getBoard(projectId)
                      .then((board) => {
                          setProject(board.project);
                          setTasks(board.tasks);
                      })
                      .catch((err) => {
                          setError(err.message);
                      });
              }}
          />

      )}

      {/* Task Details Drawer */}
      {selectedTask && (

        <TaskDrawer
          task={selectedTask}
          columns={BOARD_COLUMNS}
          onChangeStatus={
            readOnly ? undefined : handleMoveTask
          }
          loadPhase={
            projectId ? getTaskPhase : undefined
          }
          phaseVersion={phaseVersion}
          onClose={() => setSelectedTaskId(null)}
        />

      )}

    </div>

  );

}
