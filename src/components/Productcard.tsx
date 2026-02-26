import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../lib/utils';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [hoveredColor, setHoveredColor] = useState<number | null>(null);

  const colors = useMemo(() => {
    const seen = new Set<number>();
    return product.variants.reduce<{ id: number; name: string; imageUrl: string | null }[]>(
      (acc, v) => {
        if (!seen.has(v.colorId)) {
          seen.add(v.colorId);
          acc.push({ id: v.colorId, name: v.color.name, imageUrl: v.imageUrl });
        }
        return acc;
      },
      []
    );
  }, [product]);

  const activeImage = hoveredColor
    ? colors.find(c => c.id === hoveredColor)?.imageUrl ?? product.variants[0]?.imageUrl
    : product.variants[0]?.imageUrl;

  return (
    <Link to={`/products/${product.id}`} className="group flex flex-col">
      <span className="mb-2 text-[10px] text-muted-foreground tracking-widest">
        {String(index).padStart(2, '0')}
      </span>

      <div className="relative aspect-[3/4] overflow-hidden bg-card">
        {activeImage ? (
          <img
            src={activeImage}
            alt={product.name}
            className="h-full w-full object-cover transition-opacity duration-500"
            style={{ opacity: 0 }}
            onLoad={(e) => (e.currentTarget.style.opacity = '1')}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-card">
            <span className="text-xs text-muted-foreground">No image</span>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <span className="text-sm text-foreground">{product.name}</span>
        <span className="text-xs text-muted-foreground capitalize">
          {product.category.toLowerCase()}
        </span>
        <span className="mt-1 text-sm text-foreground">
          {formatPrice(product.price)}
        </span>

        {colors.length > 1 && (
          <div className="mt-2 flex items-center gap-1.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {colors.map((color) => (
              <button
                key={color.id}
                onMouseEnter={(e) => { e.preventDefault(); setHoveredColor(color.id); }}
                onMouseLeave={(e) => { e.preventDefault(); setHoveredColor(null); }}
                onClick={(e) => e.preventDefault()}
                className={`h-10 w-10 overflow-hidden border-2 transition-all duration-200 ${
                  hoveredColor === color.id ? 'border-foreground' : 'border-transparent'
                }`}
                title={color.name}
              >
                {color.imageUrl ? (
                  <img src={color.imageUrl} alt={color.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full bg-muted" />
                )}
              </button>
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">
              {colors.length} colors
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}