import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../lib/utils";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
  index: number;
  onQuickAdd?: (product: Product) => void;
  activeSize?: string;
}

export default function ProductCard({ product, activeSize }: ProductCardProps) {
  const colors = useMemo(() => {
    const seen = new Set<number>();
    return product.variants.reduce<
      { id: number; name: string; imageUrl: string | null }[]
    >((acc, v) => {
      if (!seen.has(v.colorId)) {
        seen.add(v.colorId);
        acc.push({ id: v.colorId, name: v.color.name, imageUrl: v.imageUrl });
      }
      return acc;
    }, []);
  }, [product]);

  const [activeColorIndex, setActiveColorIndex] = useState(() => {
    if (!product.variants?.length) return 0;

    if (activeSize) {
      const indexWithSize = colors.findIndex((color) =>
        product.variants.some(
          (v) => v.colorId === color.id && v.size === activeSize,
        ),
      );
      if (indexWithSize !== -1) return indexWithSize;
    }

    const uniqueColorIds = Array.from(
      new Set(product.variants.map((v) => v.colorId)),
    );
    return Math.floor(Math.random() * uniqueColorIds.length);
  });
  const [isHovered, setIsHovered] = useState(false);

  const activeImage =
    colors[activeColorIndex]?.imageUrl ?? product.variants[0]?.imageUrl;

  return (
    <div
      className={`group flex flex-col relative transition-all duration-300 ${isHovered ? "z-30" : "z-0"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setActiveColorIndex(0);
      }}
    >
      <Link
        to={`/products/${product.id}`}
        state={{ colorId: colors[activeColorIndex]?.id }}
        className={`relative aspect-[3/4] overflow-hidden block transition-shadow duration-300 ${
          isHovered ? "shadow-xl" : "shadow-none"
        }`}
        style={{ backgroundColor: "#F5F5F3" }}
      >
        <img
          src={activeImage ?? ""}
          alt={product.name}
          className={`h-full w-full object-contain transition-transform duration-500 ease-in-out mix-blend-multiply ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          style={{ opacity: 0 }}
          onLoad={(e) => (e.currentTarget.style.opacity = "1")}
        />
      </Link>

      <div className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <Link
            to={`/products/${product.id}`}
            className="text-sm text-foreground hover:opacity-60 transition-opacity leading-snug"
          >
            {product.name}
          </Link>
          <span className="text-sm text-foreground shrink-0">
            {formatPrice(product.price)}
          </span>
        </div>
        <span className="text-xs text-muted-foreground capitalize">
          {product.category.toLowerCase()}
        </span>

        {colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {colors.map((color, i) => (
              <Link
                key={color.id}
                to={`/products/${product.id}`}
                state={{ colorId: color.id }}
                className={`h-8 w-8 overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  i === activeColorIndex
                    ? "border-accent"
                    : "border-transparent hover:border-foreground/40"
                }`}
                title={color.name}
                onMouseEnter={() => setActiveColorIndex(i)}
              >
                {color.imageUrl ? (
                  <img
                    src={color.imageUrl}
                    alt={color.name}
                    className="h-full w-full object-cover mix-blend-multiply"
                    style={{ backgroundColor: "#F5F5F3" }}
                  />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
