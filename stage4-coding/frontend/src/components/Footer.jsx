import { Link } from 'react-router-dom';
import './Footer.css';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Projects' },
  { to: '/#how-it-works', label: 'About' },
  { to: '/roadmap', label: 'Roadmap' },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__left">
          <p className="site-footer__built">Built by DevCompass team.</p>
          <p className="site-footer__copy">© 2026 DevCompass. All rights reserved.</p>
        </div>

        <nav className="site-footer__nav" aria-label="Footer">
          {LINKS.map(({ to, label }) => (
            <Link key={label} to={to} className="site-footer__link">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}