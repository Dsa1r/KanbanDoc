import { CompassIcon } from './Icons.jsx';

export default function BoardHeader({
  projectName,
  description,
  progress,
  stages,
  activeStages,
  onToggleStage,
}) {
  return (
    <header className="board-header">
      <div className="board-header__brand">
        <span className="board-header__logo">
          <CompassIcon width={16} height={16} />
        </span>
        <span className="board-header__brand-name">DevCompass</span>
      </div>

      <h1 className="board-header__title">{projectName}</h1>
      {description && <p className="board-header__description">{description}</p>}

      <div className="board-header__bottom">
        <div className="board-header__progress">
          <div className="board-header__progress-label">
            <span>Overall progress</span>
            <span>{progress}%</span>
          </div>
          <div
            className="board-header__track"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall progress"
          >
            <div className="board-header__fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="board-header__filters" role="group" aria-label="Quick filters">
          <span className="board-header__filters-label">Quick filters</span>
          {stages.map((stage) => {
            const isActive = activeStages.includes(stage.id);

            return (
              <button
                key={stage.id}
                type="button"
                className={`filter-chip ${isActive ? 'filter-chip--active' : ''}`}
                aria-pressed={isActive}
                onClick={() => onToggleStage(stage.id)}
              >
                {stage.label} Stage
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}