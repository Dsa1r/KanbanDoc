import StageTag from './StageTag.jsx';
import { ArrowRightIcon } from './Icons.jsx';

export default function TaskCard({ task, onOpen }) {
  return (
    <article className="task-card">
      <StageTag stage={task.stage} />
      <h3 className="task-card__title">{task.title}</h3>

      <div className="task-card__footer">
        <span className="task-card__note">{task.note}</span>
        <button
          type="button"
          className="task-card__open"
          aria-label={`Open ${task.title}`}
          onClick={() => onOpen(task)}
        >
          <ArrowRightIcon width={16} height={16} />
        </button>
      </div>
    </article>
  );
}