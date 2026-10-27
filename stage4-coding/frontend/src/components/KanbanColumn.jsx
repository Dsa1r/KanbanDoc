import { useState } from 'react';
import TaskCard from './TaskCard.jsx';

// onMoveTask is optional: without it the column is read-only (no dragging).
export default function KanbanColumn({ column, tasks, selectedTaskId, onOpenTask, onMoveTask }) {
  const titleId = `column-${column.id}-title`;
  const [isOver, setIsOver] = useState(false);

  function handleDrop(event) {
    event.preventDefault();
    setIsOver(false);
    const taskId = event.dataTransfer.getData('text/plain');
    if (taskId) onMoveTask(taskId, column.id);
  }

  return (
    <section
      className={`kanban-column ${isOver ? 'kanban-column--over' : ''}`}
      aria-labelledby={titleId}
      onDragOver={
        onMoveTask
          ? (event) => {
              event.preventDefault();
              setIsOver(true);
            }
          : undefined
      }
      onDragLeave={onMoveTask ? () => setIsOver(false) : undefined}
      onDrop={onMoveTask ? handleDrop : undefined}
    >
      <header className="kanban-column__header">
        <span
          className={`kanban-column__dot kanban-column__dot--${column.color}`}
          aria-hidden="true"
        />
        <div className="kanban-column__heading">
          <h2 id={titleId} className="kanban-column__title">{column.title}</h2>
          <p className="kanban-column__subtitle" lang="ja">{column.subtitle}</p>
        </div>
        <span className="kanban-column__count" aria-label={`${tasks.length} tasks`}>
          {tasks.length}
        </span>
      </header>

      <div className="kanban-column__list">
        {tasks.length === 0 ? (
          <p className="kanban-column__empty">No tasks</p>
        ) : (
          tasks.map((task) => (
            // the wrapper is what gets dragged (buttons are not draggable in every browser)
            <div
              key={task.id}
              className="kanban-column__draggable"
              draggable={Boolean(onMoveTask)}
              onDragStart={(event) => event.dataTransfer.setData('text/plain', String(task.id))}
            >
              <TaskCard
                task={task}
                isSelected={task.id === selectedTaskId}
                onOpen={onOpenTask}
              />
            </div>
          ))
        )}
      </div>
    </section>
  );
}