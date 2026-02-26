import ScrollToTop from '../../components/ScrollToTop';
import Navbar from '../NavBar';
import CartDrawer from '../CartDrawer';
import SiteFooter from '../SiteFooter';
import { Outlet } from 'react-router-dom';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ScrollToTop />   {/* ← acá */}
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}