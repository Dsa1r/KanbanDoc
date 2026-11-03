import { useEffect, useRef, useState } from 'react';
import { CompassIcon, SearchIcon, ChevronDownIcon, SettingsIcon, LogoutIcon } from './Icons.jsx';
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

function Header({ userName, username, onSettings, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const accountRef = useRef(null);

  // Close the account menu when clicking outside it or pressing Escape
  useEffect(() => {
    if (!isMenuOpen) return undefined;

    function handleClick(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
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

  function handleSettings() {
    setIsMenuOpen(false);
    onSettings?.();
  }

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

        <div className="app-header__account" ref={accountRef}>
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
              {userName && (
                <div className="app-header__menu-head">
                  <p className="app-header__menu-name">{userName}</p>
                  {username && <p className="app-header__menu-username">@{username}</p>}
                </div>
              )}
              {onSettings && (
                <button
                  type="button"
                  role="menuitem"
                  className="app-header__menu-item"
                  onClick={handleSettings}
                >
                  <SettingsIcon width={16} height={16} />
                  Settings
                </button>
              )}
              <button
                type="button"
                role="menuitem"
                className="app-header__menu-item"
                onClick={onLogout}
              >
                <LogoutIcon width={16} height={16} />
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