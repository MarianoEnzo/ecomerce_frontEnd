import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../features/auth/products/product.api";
import QuickAddModal from "./QuickAddModal";
import { formatPrice } from "../lib/utils";
import type { Product } from "../types";

const CARD_WIDTH = 320;
const GAP = 24;

export default function FeaturedCarousel() {
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

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

  return (
    <section className="bg-card px-6 lg:px-8 py-20">
      <div className="mx-auto max-w-7xl w-full">
        <div className="mb-10 flex items-end justify-between">
          <h2 className="text-xs uppercase tracking-widest text-muted-foreground">
            Featured
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="flex h-9 w-9 items-center justify-center border border-border text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="group flex flex-shrink-0 flex-col"
              style={{ width: CARD_WIDTH + "px" }}
            >
              <div
                className="relative aspect-[3/4] overflow-hidden transition-shadow duration-300 group-hover:shadow-xl"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <Link to={"products/" + product.id}>
                  <img
                    src={product.variants[0]?.imageUrl ?? ""}
                    alt={product.name}
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105 mix-blend-multiply"
                    style={{ opacity: 0 }}
                    onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                </Link>
                <button
                  onClick={() => setQuickAdd(product)}
                  className="absolute bottom-0 left-0 right-0 translate-y-full bg-accent py-3 text-center text-xs uppercase tracking-widest text-white transition-transform duration-300 group-hover:translate-y-0"
                >
                  Quick Add
                </button>
              </div>
              <div className="mt-4 flex flex-col gap-0.5">
                <div className="flex items-start justify-between">
                  <Link
                    to={"products/" + product.id}
                    className="text-sm text-foreground hover:opacity-60 transition-opacity"
                  >
                    {product.name}
                  </Link>
                  <span className="text-sm text-foreground">
                    {formatPrice(product.price)}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground capitalize">
                  {product.category.toLowerCase()}
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
