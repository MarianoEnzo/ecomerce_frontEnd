import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  User,
  ShoppingBag,
  ChevronDown,
  Menu,
  X,
  Package,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";
import SearchOverlay from "./searchOverlay";

const categories = [
  {
    label: "T-Shirts",
    href: "/catalog?category=TSHIRT",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
  },
  {
    label: "Sweatshirts",
    href: "/catalog?category=SWEATSHIRT",
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
  },
  {
    label: "Jackets",
    href: "/catalog?category=JACKET",
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
  },
  {
    label: "Pants",
    href: "/catalog?category=PANTS",
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop",
  },
];

const genders = [
  { label: "Men", href: "/catalog?gender=MALE" },
  { label: "Women", href: "/catalog?gender=FEMALE" },
  { label: "Unisex", href: "/catalog?gender=UNISEX" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated, user, logout } = useAuthStore();
  const { toggleCart, itemCount } = useCartStore();
  const navigate = useNavigate();
  const count = itemCount();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredCategory(null);
    }, 200);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
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
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
        <nav className="flex items-center justify-between px-6 lg:px-10 h-16">
          <Link
            to="/"
            className="font-serif text-xl tracking-tight text-foreground"
          >
            URBN
          </Link>

          <div className="hidden md:flex items-center gap-10">
            <Link
              to="/catalog?sort=new"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              New Arrivals
            </Link>

            <div
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={`flex items-center gap-1 text-xs tracking-widest uppercase transition-colors ${
                  isOpen
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                Catalog
                <ChevronDown
                  className={`h-3 w-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            <Link
              to="/about"
              className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <button
              onClick={() => {
                setIsOpen(false);
                setSearchOpen(true);
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                aria-label="Account"
                onClick={() =>
                  isAuthenticated
                    ? setUserMenuOpen(!userMenuOpen)
                    : navigate("/login")
                }
                className="text-muted-foreground hover:text-foreground transition-colors"
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
              className="relative text-muted-foreground hover:text-foreground transition-colors"
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
        </nav>

        <div className="h-px bg-border" />

        {mobileOpen && (
          <div className="border-b border-border bg-background px-6 pb-6 md:hidden">
            <ul className="flex flex-col gap-4 pt-4">
              <li>
                <Link
                  to="/catalog?sort=new"
                  className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">
                  Catalog
                </p>
                <div className="flex gap-8 pl-3 border-l border-border">
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-foreground mb-1">
                      By Gender
                    </p>
                    {genders.map((g) => (
                      <Link
                        key={g.label}
                        to={g.href}
                        className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {g.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-[10px] font-medium uppercase tracking-widest text-foreground mb-1">
                      By Category
                    </p>
                    {categories.map((c) => (
                      <Link
                        key={c.label}
                        to={c.href}
                        className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
                        onClick={() => setMobileOpen(false)}
                      >
                        {c.label}
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

      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed top-16 left-0 right-0 z-40 bg-background border-b border-border overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen
            ? "max-h-[500px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="px-6 lg:px-10 py-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-12 gap-10">
              <div className="col-span-3 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
                    By Gender
                  </p>
                  <ul className="flex flex-col gap-3">
                    {genders.map((g) => (
                      <li key={g.label}>
                        <Link
                          to={g.href}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                          onClick={() => setIsOpen(false)}
                        >
                          {g.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/catalog"
                  className="group inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent hover:opacity-75 transition-opacity"
                  onClick={() => setIsOpen(false)}
                >
                  View All
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </div>

              <div className="col-span-9">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-5">
                  By Category
                </p>
                <div className="grid grid-cols-4 gap-4">
                  {categories.map((cat, i) => (
                    <Link
                      key={cat.label}
                      to={cat.href}
                      className="group relative block"
                      onMouseEnter={() => setHoveredCategory(i)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-card">
                        <img
                          src={cat.image}
                          alt={cat.label}
                          className={`w-full h-full object-cover transition-all duration-700 ease-out ${
                            hoveredCategory === i
                              ? "scale-105 brightness-[0.7]"
                              : "scale-100 brightness-[0.85]"
                          }`}
                        />
                        <div className="absolute inset-0 flex items-end p-4">
                          <span
                            className={`font-serif text-lg text-white transition-all duration-300 ${
                              hoveredCategory === i
                                ? "translate-y-0 opacity-100"
                                : "translate-y-1 opacity-90"
                            }`}
                          >
                            {cat.label}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
