import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';

export default function SiteLayout() {
  return (
    <div className="site-shell">
      <div className="site-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}