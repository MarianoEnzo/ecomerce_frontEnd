import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../features/auth/products/product.api";
import QuickAddModal from "./QuickAddModal";
import { formatPrice } from "../lib/utils";
import type { Product } from "../types";

const CARD_WIDTH = 280;
const GAP = 20;
const INTERVAL = 4000;

export default function FeaturedCarousel() {
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);

  const { data } = useQuery({
    queryKey: ["products", { limit: 10, page: 1 }],
    queryFn: () => productsApi.getAll({ limit: 10, page: 1 }),
  });

  const products = data?.data ?? [];

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (direction === "right" && el.scrollLeft >= maxScroll - 1) {
      el.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      el.scrollBy({
        left: direction === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => scroll("right"), INTERVAL);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <section className="bg-foreground px-6 lg:px-8 min-h-screen flex items-center">
      <div className="mx-auto max-w-7xl w-full py-16">
        <div className="mb-10 flex items-end justify-between lg:mb-14">
          <h2 className="text-xs uppercase tracking-widest text-background/40">
            Featured
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center border border-background/20 text-background transition-colors hover:bg-background hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center border border-background/20 text-background transition-colors hover:bg-background hover:text-foreground"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-shrink-0 flex-col"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-foreground/80">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={product.variants[0]?.imageUrl ?? ""}
                    alt={product.name}
                    className="h-full w-full object-contain transition-all duration-500 mix-blend-luminosity hover:mix-blend-normal"
                    style={{ opacity: 0 }}
                    onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                </Link>
                <button
                  onClick={() => setQuickAdd(product)}
                  className="absolute bottom-0 left-0 right-0 translate-y-full bg-background py-3 text-center text-xs uppercase tracking-widest text-foreground transition-transform duration-300 group-hover:translate-y-0"
                >
                  Quick Add
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-0.5">
                <span className="text-[10px] uppercase tracking-widest text-background/30">
                  New
                </span>
                <Link
                  to={`/products/${product.id}`}
                  className="text-sm text-background hover:opacity-60 transition-opacity"
                >
                  {product.name}
                </Link>
                <span className="text-xs text-background/40 capitalize">
                  {product.category.toLowerCase()}
                </span>
                <span className="mt-1 text-sm text-background">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {quickAdd && (
        <QuickAddModal product={quickAdd} onClose={() => setQuickAdd(null)} />
      )}
    </section>
  );
}
