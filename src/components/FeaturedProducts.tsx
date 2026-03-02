import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "../features/auth/products/product.api";
import QuickAddModal from "./QuickAddModal";
import { formatPrice } from "../lib/utils";
import type { Product } from "../types";

const LIFESTYLE_IMAGES = [
  "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
  "https://images.unsplash.com/photo-1516257984-b1b4d707412e?w=600&q=80",
  "https://images.unsplash.com/photo-1485218126466-34e6392ec754?w=600&q=80",
  "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80",
];

export default function FeaturedProducts() {
  const [quickAdd, setQuickAdd] = useState<Product | null>(null);

  const { data } = useQuery({
    queryKey: ["products", { limit: 4, page: 2 }],
    queryFn: () => productsApi.getAll({ limit: 4, page: 2 }),
  });

  const products = data?.data ?? [];

  return (
    <section className="bg-card px-6 lg:px-8 min-h-screen flex items-center">
      <div className="mx-auto max-w-7xl w-full py-16">
        <h2 className="mb-10 text-xs uppercase tracking-widest text-muted-foreground lg:mb-14">
          New Arrivals
        </h2>

        <div className="grid grid-cols-2 gap-x-3 gap-y-8 lg:grid-cols-4 lg:gap-x-5 lg:gap-y-10">
          {products.map((product, index) => (
            <div key={product.id} className="group flex flex-col">
              <span className="mb-2 text-[10px] text-muted-foreground tracking-widest">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative aspect-[3/4] overflow-hidden">
                <Link to={`/products/${product.id}`}>
                  <img
                    src={
                      LIFESTYLE_IMAGES[index] ??
                      product.variants[0]?.imageUrl ??
                      ""
                    }
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ opacity: 0 }}
                    onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                  />
                </Link>
                <button
                  onClick={() => setQuickAdd(product)}
                  className="absolute bottom-0 left-0 right-0 translate-y-full bg-foreground py-3 text-center text-xs uppercase tracking-widest text-background transition-transform duration-300 group-hover:translate-y-0"
                >
                  Quick Add
                </button>
              </div>

              <div className="mt-3 flex flex-col gap-1">
                <Link
                  to={`/products/${product.id}`}
                  className="text-sm text-foreground hover:opacity-60 transition-opacity"
                >
                  {product.name}
                </Link>
                <span className="text-xs text-muted-foreground capitalize">
                  {product.category.toLowerCase()}
                </span>
                <span className="mt-1 text-sm text-foreground">
                  {formatPrice(product.price)}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground border-b border-foreground pb-0.5 transition-opacity hover:opacity-60"
          >
            View All
          </Link>
        </div>
      </div>

      {quickAdd && (
        <QuickAddModal product={quickAdd} onClose={() => setQuickAdd(null)} />
      )}
    </section>
  );
}
