import StageTag from './StageTag.jsx';
import { ArrowRightIcon } from './Icons.jsx';

export default function TaskCard({ task, isSelected, onOpen }) {
  return (
    <button
      type="button"
      className={`task-card ${isSelected ? 'task-card--selected' : ''}`}
      aria-haspopup="dialog"
      onClick={() => onOpen(task)}
    >
      <StageTag stage={task.stage} />
      <span className="task-card__title">{task.title}</span>
      <span className="task-card__footer">
        <span className="task-card__note">{task.note}</span>
        <ArrowRightIcon className="task-card__arrow" width={16} height={16} />
      </span>
    </button>
  );
}