import { useState } from 'react';
import { CompassIcon, SearchIcon, ChevronDownIcon } from './Icons.jsx';
import './Header.css';

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function Header({ userName, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        <div className="app-header__account">
          <button
            type="button"
            className="app-header__user"
            aria-label="Account menu"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="app-header__avatar">{getInitials(userName)}</span>
            <ChevronDownIcon width={14} height={14} />
          </button>

          {isMenuOpen && (
            <div className="app-header__menu" role="menu">
              {userName && <p className="app-header__menu-name">{userName}</p>}
              <button
                type="button"
                role="menuitem"
                className="app-header__menu-item"
                onClick={onLogout}
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;