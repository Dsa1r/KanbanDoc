import { CloseIcon, SearchIcon } from './Icons.jsx';
import { DAYS_OPTIONS, STATUS_OPTIONS } from '../utils/projectFilters.js';
import './ProjectFilters.css';

function OptionGroup({ legend, name, options, value, onChange, counts, disabled }) {
  return (
    <fieldset className="project-filters__group" disabled={disabled}>
      <legend className="project-filters__label">{legend}</legend>

      {options.map((option) => (
        <label
          key={option.value}
          className={`project-filters__option ${
            value === option.value ? 'project-filters__option--active' : ''
          }`}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <span className={`project-filters__dot project-filters__dot--${option.value}`} />
          <span className="project-filters__option-text">{option.label}</span>
          {counts && <span className="project-filters__count">{counts[option.value]}</span>}
        </label>
      ))}
    </fieldset>
  );
}

function ProjectFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
  days,
  onDaysChange,
  counts,
  hasActiveFilters,
  onClear,
  disabled = false,
}) {
  return (
    <aside className="project-filters" aria-label="Filter projects">
      <div className="project-filters__inner">
        <div className="project-filters__section">
          <label className="project-filters__label" htmlFor="project-search">
            Search
          </label>
          <div className="project-filters__search">
            <SearchIcon width={16} height={16} />
            <input
              id="project-search"
              type="search"
              placeholder="Search by project name"
              value={query}
              disabled={disabled}
              onChange={(event) => onQueryChange(event.target.value)}
            />
            {query && (
              <button
                type="button"
                className="project-filters__clear-search"
                aria-label="Clear search"
                onClick={() => onQueryChange('')}
              >
                <CloseIcon width={14} height={14} />
              </button>
            )}
          </div>
        </div>

        <OptionGroup
          legend="Status"
          name="project-status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={onStatusChange}
          counts={counts}
          disabled={disabled}
        />

        <OptionGroup
          legend="Last updated"
          name="project-days"
          options={DAYS_OPTIONS}
          value={days}
          onChange={onDaysChange}
          disabled={disabled}
        />

        {hasActiveFilters && (
          <button type="button" className="project-filters__reset" onClick={onClear}>
            Clear filters
          </button>
        )}
      </div>
    </aside>
  );
}

export default ProjectFilters;