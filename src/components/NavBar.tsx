import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Package,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";

const GENDER_LINKS = [
  { label: "Men", href: "/catalog?gender=MALE" },
  { label: "Women", href: "/catalog?gender=FEMALE" },
  { label: "Unisex", href: "/catalog?gender=UNISEX" },
];

const CATEGORY_LINKS = [
  { label: "All", href: "/catalog" },
  { label: "T-Shirts", href: "/catalog?category=TSHIRT" },
  { label: "Sweatshirts", href: "/catalog?category=SWEATSHIRT" },
  { label: "Jackets", href: "/catalog?category=JACKET" },
  { label: "Pants", href: "/catalog?category=PANTS" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggleCart, itemCount } = useCartStore();
  const navigate = useNavigate();
  const count = itemCount();
  const menuRef = useRef<HTMLDivElement>(null);
  const catalogRef = useRef<HTMLLIElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.getBoundingClientRect().height);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (
        catalogRef.current &&
        !catalogRef.current.contains(e.target as Node)
      ) {
        setCatalogOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      ref={headerRef}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md"
    >
      <div className="relative flex items-center justify-between px-6 py-4 lg:px-8">
        <Link
          to="/"
          className="font-serif text-2xl tracking-tight text-foreground z-10"
        >
          URBN
        </Link>

        <ul className="absolute left-1/2 -translate-x-1/2 hidden items-baseline gap-10 md:flex whitespace-nowrap">
          <li>
            <Link
              to="/catalog?sort=new"
              className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              New Arrivals
            </Link>
          </li>

          <li
            ref={catalogRef}
            className="relative"
            onMouseEnter={() => setCatalogOpen(true)}
            onMouseLeave={() => setCatalogOpen(false)}
          >
            <Link
              to="/catalog"
              className="flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              Catalog
              <ChevronDown
                className={`h-3 w-3 transition-transform duration-200 ${catalogOpen ? "rotate-180" : ""}`}
                strokeWidth={1.5}
              />
            </Link>

            {catalogOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                <div className="flex bg-background border border-border shadow-sm">
                  <div className="px-6 py-5 border-r border-border">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-foreground mb-4">
                      By Gender
                    </p>
                    <div className="flex gap-8">
                      {GENDER_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          onClick={() => setCatalogOpen(false)}
                          className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="px-6 py-5">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-foreground mb-4">
                      By Category
                    </p>
                    <div className="flex gap-8">
                      {CATEGORY_LINKS.map((link) => (
                        <Link
                          key={link.label}
                          to={link.href}
                          onClick={() => setCatalogOpen(false)}
                          className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </li>

          <li>
            <Link
              to="/about"
              className="text-xs uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              About
            </Link>
          </li>
        </ul>
        <div className="flex items-center gap-5 z-10">
          <button
            aria-label="Search"
            className="text-foreground transition-colors hover:text-muted-foreground"
          >
            <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
          </button>

          <div ref={menuRef} className="relative hidden sm:block">
            <button
              aria-label="Account"
              onClick={() =>
                isAuthenticated
                  ? setUserMenuOpen(!userMenuOpen)
                  : navigate("/login")
              }
              className="text-foreground transition-colors hover:text-muted-foreground"
            >
              <User className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            {isAuthenticated && userMenuOpen && (
              <div className="absolute right-0 top-8 w-48 bg-background border border-border shadow-sm">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Signed in as
                  </p>
                  <p className="mt-0.5 text-xs text-foreground truncate">
                    {user?.email}
                  </p>
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
                  {(user?.role === "ADMIN" || user?.role === "SELLER") && (
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

          <button
            aria-label="Toggle menu"
            className="text-foreground md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.5} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <ul className="flex flex-col gap-4 pt-4">
            ¡
            <li>
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                Catalog
              </p>
              <div className="flex gap-8 pl-3 border-l border-border">
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-foreground mb-1">
                    By Gender
                  </p>
                  {GENDER_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-[10px] font-medium uppercase tracking-widest text-foreground mb-1">
                    By Category
                  </p>
                  {CATEGORY_LINKS.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
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
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
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
