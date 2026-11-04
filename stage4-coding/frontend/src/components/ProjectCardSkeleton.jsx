import './ProjectCardSkeleton.css';

function ProjectCardSkeleton() {
  return (
    <div className="project-skeleton" aria-hidden="true">
      <div className="project-skeleton__top">
        <span className="project-skeleton__shape project-skeleton__shape--icon" />
        <span className="project-skeleton__shape project-skeleton__shape--dots" />
      </div>

      <span className="project-skeleton__shape project-skeleton__shape--title" />
      <span className="project-skeleton__shape project-skeleton__shape--text" />

      <div className="project-skeleton__stats">
        <span className="project-skeleton__shape project-skeleton__shape--small" />
        <span className="project-skeleton__shape project-skeleton__shape--tiny" />
      </div>
      <span className="project-skeleton__shape project-skeleton__shape--bar" />

      <span className="project-skeleton__divider" />
      <span className="project-skeleton__shape project-skeleton__shape--footer" />
    </div>
  );
}

export default ProjectCardSkeleton;