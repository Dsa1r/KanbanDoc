import TaskCard from './TaskCard.jsx';

export default function KanbanColumn({ column, tasks, onOpenTask }) {
  const titleId = `column-${column.id}-title`;

  return (
    <section className="kanban-column" aria-labelledby={titleId}>
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
            <TaskCard key={task.id} task={task} onOpen={onOpenTask} />
          ))
        )}
      </div>
    </section>
  );
}