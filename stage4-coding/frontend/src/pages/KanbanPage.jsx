import { useState } from 'react';
import BoardHeader from '../components/BoardHeader.jsx';
import NextUpBanner from '../components/NextUpBanner.jsx';
import KanbanColumn from '../components/KanbanColumn.jsx';
import { BOARD_COLUMNS, STAGES, mockBoard } from '../data/mockBoard.js';
import '../styles/kanban.css';

export default function KanbanPage() {
  const { project, tasks } = mockBoard;
  const [activeStages, setActiveStages] = useState([]);

  const doneCount = tasks.filter((task) => task.status === 'done').length;
  const progress = tasks.length > 0 ? Math.round((doneCount / tasks.length) * 100) : 0;
  const nextTask = tasks.find((task) => task.status === 'todo');

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
    // TODO: open the task details (page or modal)
    console.log('Open task', task.id);
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
              onOpenTask={handleOpenTask}
            />
          ))}
        </div>
      </main>
    </div>
  );
}