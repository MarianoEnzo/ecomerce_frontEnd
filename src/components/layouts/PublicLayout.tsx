import { Outlet } from 'react-router-dom';
import Navbar from '../NavBar';
import SiteFooter from '../SiteFooter';
import CartDrawer from '../CartDrawer';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <CartDrawer />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}