import { useEffect } from 'react';
import { CloseIcon } from './Icons.jsx';

// columns + onChangeStatus are optional: they add a "Status" dropdown (works on phones, where dragging does not)
export default function TaskDrawer({ task, onClose, columns, onChangeStatus }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleKeyDown(event) {
    if (event.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div className="drawer-overlay" onClick={onClose} onKeyDown={handleKeyDown}>
      <aside
        className="drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-drawer-title"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="drawer__header">
          <div>
            {task.note && <span className="drawer__badge">{task.note}</span>}
            <h2 id="task-drawer-title" className="drawer__title">{task.title}</h2>
          </div>
          <button
            type="button"
            className="drawer__close"
            aria-label="Close task details"
            onClick={onClose}
            autoFocus
          >
            <CloseIcon width={18} height={18} />
          </button>
        </header>

        {onChangeStatus && columns && (
          <section className="drawer__section">
            <label className="drawer__label" htmlFor="task-status">Status</label>
            <select
              id="task-status"
              className="drawer__select"
              value={task.status}
              onChange={(event) => onChangeStatus(task.id, event.target.value)}
            >
              {columns.map((column) => (
                <option key={column.id} value={column.id}>{column.title}</option>
              ))}
            </select>
          </section>
        )}

        <section className="drawer__section">
          <h3 className="drawer__label">Task description</h3>
          <p className="drawer__text">{task.description || 'No description yet.'}</p>
        </section>

        {task.resources?.length > 0 && (
          <section className="drawer__section">
            <h3 className="drawer__label">Reference links &amp; resources</h3>
            <ul className="drawer__links">
              {task.resources.map((resource) => (
                <li key={resource.url}>
                  <a href={resource.url} target="_blank" rel="noreferrer">
                    {resource.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </aside>
    </div>
  );
}