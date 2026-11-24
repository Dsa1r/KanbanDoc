import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { CompassIcon, ChevronDownIcon, SettingsIcon, LogoutIcon } from './Icons.jsx';
import './SiteHeader.css';

const NAV_LINKS = [
  { to: '/dashboard', label: 'Projects', alsoActiveOn: '/projects/' },
  { to: '/roadmap', label: 'Roadmap' },
];

function getInitials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

export default function SiteHeader() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const accountRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function handleDown(event) {
      if (accountRef.current && !accountRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    function handleKey(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener('mousedown', handleDown);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleDown);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  function handleSettings() {
    setMenuOpen(false);
    navigate('/settings');
  }

  async function handleLogout() {
    setMenuOpen(false);
    await logout();
    navigate('/auth');
  }

  return (
    <header className="site-header">
      <Link to={user ? '/dashboard' : '/'} className="site-header__brand" aria-label="DevCompass home">
        <span className="site-header__logo">
          <CompassIcon />
        </span>
        <span className="site-header__name">DevCompass</span>
      </Link>

      <nav className="site-header__nav" aria-label="Main">
        {NAV_LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => {
              const active = isActive || (link.alsoActiveOn && pathname.startsWith(link.alsoActiveOn));
              return `site-header__nav-link ${active ? 'site-header__nav-link--active' : ''}`;
            }}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <div className="site-header__actions">
        {/* While the session is being checked, show nothing instead of flashing "Log in" */}
        {!loading && !user && (
          <>
            <Link to="/auth?mode=login" className="site-header__btn site-header__btn--ghost">
              Log in
            </Link>
            <Link to="/auth?mode=signup" className="site-header__btn site-header__btn--primary">
              Sign up
            </Link>
          </>
        )}

        {!loading && user && (
          <div className="site-header__account" ref={accountRef}>
            <button
              ref={toggleRef}
              type="button"
              className="site-header__user"
              aria-label="Account menu"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="site-header__avatar">{getInitials(user.name)}</span>
              <ChevronDownIcon width={14} height={14} />
            </button>

            {menuOpen && (
              <div className="site-header__menu" role="menu">
                <div className="site-header__menu-head">
                  <p className="site-header__menu-name">{user.name}</p>
                  {user.username && <p className="site-header__menu-username">@{user.username}</p>}
                </div>
                <button type="button" role="menuitem" className="site-header__menu-item" onClick={handleSettings}>
                  <SettingsIcon width={16} height={16} />
                  Settings
                </button>
                <button type="button" role="menuitem" className="site-header__menu-item" onClick={handleLogout}>
                  <LogoutIcon width={16} height={16} />
                  Log out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}