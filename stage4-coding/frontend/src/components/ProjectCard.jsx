import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { EditIcon, FolderIcon, MoreIcon, TrashIcon } from './Icons.jsx';
import './ProjectCard.css';

function ProjectCard({
  title,
  description,
  completedTasks,
  totalTasks,
  updatedAt,
  boardUrl,
  isOwner,
  onEdit,
  onDelete,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const progress = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;
  const hasActions = isOwner && (onEdit || onDelete);

  // Close the menu when clicking outside it or pressing Escape
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handleClick(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') setIsMenuOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [isMenuOpen]);

  function runAction(action) {
    setIsMenuOpen(false);
    action();
  }

  return (
    <article className="project-card">
      <div className="project-card__top">
        <span className="project-card__icon">
          <FolderIcon />
        </span>

        {hasActions && (
          <div className="project-card__menu-wrap" ref={menuRef}>
            <button
              type="button"
              className="project-card__menu"
              aria-label={`More options for ${title}`}
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen((open) => !open)}
            >
              <MoreIcon />
            </button>

            {isMenuOpen && (
              <div className="project-card__dropdown" role="menu">
                {onEdit && (
                  <button
                    type="button"
                    role="menuitem"
                    className="project-card__dropdown-item"
                    onClick={() => runAction(onEdit)}
                  >
                    <EditIcon width={16} height={16} />
                    Edit project
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    role="menuitem"
                    className="project-card__dropdown-item project-card__dropdown-item--danger"
                    onClick={() => runAction(onDelete)}
                  >
                    <TrashIcon width={16} height={16} />
                    Delete project
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <h3 className="project-card__title">
        {boardUrl ? (
          <Link to={boardUrl} className="project-card__link">{title}</Link>
        ) : (
          title
        )}
      </h3>
      {description && <p className="project-card__description">{description}</p>}

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