import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/auth.store';
import { LayoutGrid, ShoppingBag, LogOut } from 'lucide-react';

const navItems = [
  { label: 'Products', href: '/admin/products', icon: LayoutGrid },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
];

export default function AdminLayout() {
  const { logout, user } = useAuthStore();
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-56 border-r border-border bg-background flex flex-col">
        <div className="p-6 border-b border-border">
          <Link to="/" className="font-serif text-xl text-foreground">
            URBN
          </Link>
          <p className="mt-1 text-xs text-muted-foreground uppercase tracking-widest">
            Admin
          </p>
        </div>

        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-widest transition-colors ${
                      active
                        ? 'bg-foreground text-background'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-border">
          <p className="mb-3 text-xs text-muted-foreground truncate">{user?.email}</p>
          <button
            onClick={logout}
            className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="ml-56 flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}