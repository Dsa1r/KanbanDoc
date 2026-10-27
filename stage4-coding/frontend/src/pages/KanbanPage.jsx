import { useState } from 'react';
import BoardHeader from '../components/BoardHeader.jsx';
import NextUpBanner from '../components/NextUpBanner.jsx';
import KanbanColumn from '../components/KanbanColumn.jsx';
import TaskDrawer from '../components/TaskDrawer.jsx';
import { BOARD_COLUMNS, STAGES, mockBoard } from '../data/mockBoard.js';
import '../styles/kanban.css';

export default function KanbanPage() {
  const { project, tasks } = mockBoard;
  const [activeStages, setActiveStages] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

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

  function handleOpenTask(task) {
    setSelectedTaskId(task.id);
  }

  function closeDrawer() {
    setSelectedTaskId(null);
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
      />

      <main className="kanban">
        {nextTask && <NextUpBanner task={nextTask} onOpen={handleOpenTask} />}

        <div className="kanban__columns">
          {BOARD_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={visibleTasks.filter((task) => task.status === column.id)}
              selectedTaskId={selectedTaskId}
              onOpenTask={handleOpenTask}
            />
          ))}
        </div>
      </main>

      {selectedTask && <TaskDrawer task={selectedTask} onClose={closeDrawer} />}
    </div>
  );
}