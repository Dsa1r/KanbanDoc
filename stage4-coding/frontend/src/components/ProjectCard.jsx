import { Link } from 'react-router-dom';
import { FolderIcon, MoreIcon } from './Icons.jsx';
import './ProjectCard.css';

function ProjectCard({ title, description, completedTasks, totalTasks, updatedAt, boardUrl }) {
  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <article className="project-card">
      <div className="project-card__top">
        <span className="project-card__icon">
          <FolderIcon />
        </span>
        <button
          type="button"
          className="project-card__menu"
          aria-label={`More options for ${title}`}
        >
          <MoreIcon />
        </button>
      </div>

      <h3 className="project-card__title">
        {boardUrl ? (
          <Link to={boardUrl} className="project-card__link">{title}</Link>
        ) : (
          title
        )}
      </h3>
      <p className="project-card__description">{description}</p>

      <div className="project-card__stats">
        <span>{completedTasks} of {totalTasks} tasks</span>
        <span>{progress}%</span>
      </div>

      <div
        className="project-card__track"
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${title} progress`}
      >
        <div className="project-card__fill" style={{ width: `${progress}%` }} />
      </div>

      {updatedAt && <p className="project-card__updated">Updated {updatedAt}</p>}
    </article>
  );
}

export default ProjectCard;