import CreateProjectButton from './CreateProjectButton.jsx';
import { FolderIcon } from './Icons.jsx';
import './EmptyState.css';

function EmptyState({ onCreate }) {
  return (
    <section className="empty-state">
      <span className="empty-state__icon">
        <FolderIcon width={22} height={22} />
      </span>
      <h2 className="empty-state__title">No projects yet</h2>
      <p className="empty-state__text">
        Create your first project to start tracking your progress.
      </p>
      <CreateProjectButton onClick={onCreate} />
    </section>
  );
}

export default EmptyState;