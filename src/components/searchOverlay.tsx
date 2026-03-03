import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, X, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../features/auth/products/product.api";
import { formatPrice } from "../lib/utils";

const POPULAR_SEARCHES = ["Hoodie", "Jacket", "T-Shirt", "Pants", "Sweatshirt"];

const QUICK_LINKS = [
  { label: "New Arrivals", href: "/catalog?sort=new" },
  { label: "All Products", href: "/catalog" },
  { label: "Men", href: "/catalog?gender=MALE" },
  { label: "Women", href: "/catalog?gender=FEMALE" },
];

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data } = useQuery({
    queryKey: ["products", { search: query || undefined, limit: 4 }],
    queryFn: () =>
      productsApi.getAll({ search: query || undefined, limit: query ? 8 : 4 }),
  });

  const products = data?.data ?? [];

  const handleClose = useCallback(() => {
    setQuery("");
    onClose();
  }, [onClose]);

  const handleViewAll = () => {
    if (!query.trim()) return;
    navigate(`/catalog?search=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
      const timer = setTimeout(() => inputRef.current?.focus(), 300);
      return () => clearTimeout(timer);
    } else {
      document.body.style.overflow = "";
      const timer = setTimeout(() => setIsMounted(false), 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) handleClose();
      if (e.key === "Enter" && isOpen && query.trim()) handleViewAll();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, query, handleClose]);

  if (!isMounted && !isOpen) return null;

  const suggestions = query
    ? POPULAR_SEARCHES.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase()),
      )
    : POPULAR_SEARCHES;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-foreground/30 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        className={`fixed top-0 left-0 right-0 z-[70] bg-background transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="border-b border-border">
          <div className="max-w-5xl mx-auto px-6 lg:px-10">
            <div className="flex items-center gap-4 h-20">
              <Search
                className="h-5 w-5 text-muted-foreground shrink-0"
                strokeWidth={1.5}
              />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent text-lg font-light text-foreground placeholder:text-muted-foreground/60 outline-none"
                aria-label="Search products"
              />
              {query.length > 0 && (
                <button
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground transition-colors mr-2"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              )}
              <button
                onClick={handleClose}
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-10 max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="grid grid-cols-12 gap-10">
            <div className="col-span-12 md:col-span-4">
              <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-5">
                {query.length > 0 ? "Suggestions" : "Popular Searches"}
              </p>
              <ul className="flex flex-col gap-3">
                {suggestions.map((term) => (
                  <li key={term}>
                    <button
                      onClick={() => setQuery(term)}
                      className="group flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Search
                        className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors"
                        strokeWidth={1.5}
                      />
                      {term}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground mb-5">
                  Quick Links
                </p>
                <ul className="flex flex-col gap-3">
                  {QUICK_LINKS.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        onClick={handleClose}
                        className="group flex items-center justify-between text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link.label}
                        <ArrowRight
                          className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
                          strokeWidth={1.5}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="col-span-12 md:col-span-8">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[10px] tracking-widest uppercase text-muted-foreground">
                  {query.length > 0
                    ? `${products.length} Result${products.length !== 1 ? "s" : ""}`
                    : "Trending Now"}
                </p>
                {query.length > 0 && products.length > 0 && (
                  <button
                    onClick={handleViewAll}
                    className="group inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-accent hover:opacity-75 transition-opacity"
                  >
                    View All
                    <ArrowRight
                      className="h-3 w-3 transition-transform group-hover:translate-x-1"
                      strokeWidth={1.5}
                    />
                  </button>
                )}
              </div>

              {products.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((product, i) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      onClick={handleClose}
                      className="group block"
                    >
                      <div
                        className="relative aspect-[4/5] overflow-hidden bg-card mb-3"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      >
                        <img
                          src={product.variants[0]?.imageUrl ?? ""}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                      <p className="text-sm text-foreground group-hover:text-accent transition-colors">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-muted-foreground capitalize">
                          {product.category.toLowerCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Search
                    className="h-10 w-10 text-muted-foreground/40 mb-4"
                    strokeWidth={1}
                  />
                  <p className="font-serif text-lg text-foreground/70 mb-1">
                    No results found
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Try a different term or browse our{" "}
                    <Link
                      to="/catalog"
                      onClick={handleClose}
                      className="text-accent underline underline-offset-2"
                    >
                      full catalog
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
