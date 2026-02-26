import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X, Package, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useCartStore } from '../store/cart.store';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Men', href: '/catalog?gender=MALE' },
  { label: 'Women', href: '/catalog?gender=FEMALE' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggleCart, itemCount } = useCartStore();
  const navigate = useNavigate();
  const count = itemCount();
  const menuRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">

        {/* Logo */}
        <Link to="/" className="font-serif text-2xl tracking-tight text-foreground">
          URBN
        </Link>

        {/* Center Nav Links — Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                to={link.href}
                className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Icons */}
        <div className="flex items-center gap-5">
          <button
            aria-label="Search"
            className="text-foreground transition-colors hover:text-muted-foreground"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>

          {/* User icon con dropdown */}
          <div ref={menuRef} className="relative hidden sm:block">
            <button
              aria-label="Account"
              onClick={() => isAuthenticated ? setUserMenuOpen(!userMenuOpen) : navigate('/login')}
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            {/* Dropdown */}
            {isAuthenticated && userMenuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-background border border-border shadow-sm">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Signed in as</p>
                  <p className="mt-0.5 text-xs text-foreground truncate">{user?.email}</p>
                </div>
                <ul className="py-1">
                  <li>
                    <Link
                      to="/my-orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-card"
                    >
                      <Package className="h-3.5 w-3.5" strokeWidth={1.5} />
                      My Orders
                    </Link>
                  </li>
                  {(user?.role === 'ADMIN' || user?.role === 'SELLER') && (
                    <li>
                      <Link
                        to="/admin/products"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-card"
                      >
                        Admin Panel
                      </Link>
                    </li>
                  )}
                  <li className="border-t border-border mt-1">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:bg-card"
                    >
                      <LogOut className="h-3.5 w-3.5" strokeWidth={1.5} />
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Cart */}
          <button
            aria-label="Cart"
            onClick={toggleCart}
            className="relative text-foreground transition-colors hover:text-muted-foreground"
          >
            <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center bg-foreground text-[10px] font-medium text-background">
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle menu"
            className="text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X className="h-5 w-5" strokeWidth={1.5} />
              : <Menu className="h-5 w-5" strokeWidth={1.5} />
            }
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.href}
                  className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="border-t border-border pt-2">
              {isAuthenticated ? (
                <div className="flex flex-col gap-3">
                  <Link
                    to="/my-orders"
                    onClick={() => setMobileOpen(false)}
                    className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    My Orders
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-left text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
































































































































