import { Link } from 'react-router-dom';
import { CompassIcon } from './Icons.jsx';
import './BoardHeaderOptions.css';

export default function BoardHeader({
  projectName,
  description,
  progress,
  stages,
  activeStages,
  onToggleStage,
  backTo,
  showTaskOptions = false, // true only for Empty projects
  onAiGenerate,
  onAddManual,
}) {
  return (
    <header className="board-header">
      <div className="board-header__brand">
        <span className="board-header__logo">
          <CompassIcon width={16} height={16} />
        </span>
        <span className="board-header__brand-name">DevCompass</span>
      </div>

      {backTo && <Link to={backTo} className="board-header__back">← Projects</Link>}

      <h1 className="board-header__title">{projectName}</h1>
      {description && <p className="board-header__description">{description}</p>}

      {showTaskOptions && (
        <div className="board-header__options" role="group" aria-label="Add tasks">
          <button type="button" className="header-option" onClick={onAiGenerate}>
            <span className="header-option__icon" aria-hidden="true">✦</span>
            <span className="header-option__text">
              <strong>Generate with AI</strong>
              <small>Answer a few questions</small>
            </span>
          </button>

          <button type="button" className="header-option" onClick={onAddManual}>
            <span className="header-option__icon" aria-hidden="true">+</span>
            <span className="header-option__text">
              <strong>Add tasks manually</strong>
              <small>One by one</small>
            </span>
          </button>
        </div>
      )}

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