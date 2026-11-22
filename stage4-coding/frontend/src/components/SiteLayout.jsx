import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from './SiteHeader.jsx';
import Footer from './Footer.jsx';

export default function SiteLayout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="site-shell">
      <SiteHeader />
      <div className="site-main">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}