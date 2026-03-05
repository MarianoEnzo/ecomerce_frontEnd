import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import { productsApi } from "../features/auth/products/product.api";
import { formatPrice } from "../lib/utils";

const FEATURED_SLUGS = [
  "unisex-hoodie-0vl0",
  "windbreaker-7hnt",
  "women-hoodie-nwz9",
  "polo-classic-rt4e",
];

export default function FeaturedCarousel() {
  const results = useQueries({
    queries: FEATURED_SLUGS.map((slug) => ({
      queryKey: ["product", slug],
      queryFn: () => productsApi.getBySlug(slug),
    })),
  });

  const products = results.map((r) => r.data).filter(Boolean);

  return (
    <section className="px-6 lg:px-16 xl:px-24 py-20 mt-20 lg:py-28 bg-background border-t border-border">
      <div className="flex items-end justify-between mb-14">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            Just dropped
          </p>
          <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground">
            New Arrivals
          </h2>
        </div>
        <Link
          to="/catalog?sort=new"
          className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-accent hover:opacity-75 transition-opacity"
        >
          View All
          <ArrowRight
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <Link
            key={product!.id}
            to={`/products/${product!.id}`}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[4/4] bg-card overflow-hidden mb-4">
              <img
                src={product!.variants[0]?.imageUrl ?? ""}
                alt={product!.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-300" />
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm text-foreground group-hover:text-accent transition-colors">
                  {product!.name}
                </h3>
                <p className="text-xs text-muted-foreground capitalize mt-0.5">
                  {product!.category.toLowerCase()}
                </p>
              </div>
              <p className="text-sm text-foreground">
                {formatPrice(product!.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
