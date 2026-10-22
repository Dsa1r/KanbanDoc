import { CompassIcon, SearchIcon, ChevronDownIcon } from './Icons.jsx';
import './Header.css';

function Header() {
  return (
    <header className="app-header">
      <div className="app-header__brand">
        <span className="app-header__logo">
          <CompassIcon />
        </span>
        <span className="app-header__name">DevCompass</span>
      </div>

      <div className="app-header__actions">
        <button type="button" className="app-header__icon-btn" aria-label="Search">
          <SearchIcon />
        </button>
        <button type="button" className="app-header__user" aria-label="Account menu">
          <span className="app-header__avatar">AK</span>
          <ChevronDownIcon width={14} height={14} />
        </button>
      </div>
    </header>
  );
}

export default Header;