import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { cartApi } from '../features/cart/cart.api';
import { useCartStore } from '../store/cart.store';
import { formatPrice } from '../lib/utils';
import type { Product, ProductVariant } from '../types';

interface QuickAddModalProps {
  product: Product;
  onClose: () => void;
}

export default function QuickAddModal({ product, onClose }: QuickAddModalProps) {
  const { setCart, openCart } = useCartStore();
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    if (product.variants.length > 0) {
      setSelectedColor(product.variants[0].colorId);
    }
  }, [product]);

  const colors = useMemo(() => {
    const seen = new Set<number>();
    return product.variants.reduce<{ id: number; name: string; hexCode: string; imageUrl: string | null }[]>(
      (acc, v) => {
        if (!seen.has(v.colorId)) {
          seen.add(v.colorId);
          acc.push({ id: v.colorId, name: v.color.name, hexCode: v.color.hexCode, imageUrl: v.imageUrl });
        }
        return acc;
      },
      []
    );
  }, [product]);

  const availableSizes = useMemo(() => {
    return product.variants.filter(
      (v) => !selectedColor || v.colorId === selectedColor
    );
  }, [product, selectedColor]);

  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!selectedSize) return null;
    return product.variants.find(
      (v) => v.size === selectedSize && (!selectedColor || v.colorId === selectedColor)
    ) ?? null;
  }, [product, selectedSize, selectedColor]);

  const activeImage = useMemo(() => {
    if (selectedColor) {
      const v = product.variants.find((v) => v.colorId === selectedColor);
      if (v?.imageUrl) return v.imageUrl;
    }
    return product.variants.find((v) => v.imageUrl)?.imageUrl ?? null;
  }, [product, selectedColor]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError('Please select a size');
      return;
    }
    setError('');
    setAdding(true);
    try {
      await cartApi.addItem(selectedVariant.id, 1);
      const cart = await cartApi.getCart();
      setCart(cart);
      onClose();
      openCart();
    } catch {
      setError('Could not add to cart. Try again.');
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center p-0 sm:p-4">

      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />


      <div className="relative w-full max-w-lg bg-background sm:rounded-none">


        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        <div className="flex gap-0 sm:gap-6">

 
          <div className="hidden sm:block w-48 flex-shrink-0 aspect-[3/4] overflow-hidden bg-card">
            {activeImage ? (
              <img src={activeImage} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-card" />
            )}
          </div>

          {/* Contenido */}
          <div className="flex flex-1 flex-col gap-5 p-6">

            {/* Nombre y precio */}
            <div>
              <h2 className="font-serif text-lg text-foreground">{product.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{formatPrice(product.price)}</p>
            </div>

            {/* Color */}
            {colors.length > 1 && (
              <div className="flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Color: {colors.find(c => c.id === selectedColor)?.name}
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => { setSelectedColor(color.id); setSelectedSize(null); setError(''); }}
                      title={color.name}
                      className={`relative h-10 w-10 overflow-hidden border-2 transition-all ${
                        selectedColor === color.id ? 'border-foreground' : 'border-transparent hover:border-muted'
                      }`}
                    >
                      {color.imageUrl ? (
                        <img src={color.imageUrl} alt={color.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full" style={{ backgroundColor: color.hexCode }} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talle */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                Size{selectedSize ? `: ${selectedSize}` : ''}
              </span>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((variant) => {
                  const outOfStock = variant.stock === 0;
                  const selected = selectedSize === variant.size;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => { if (!outOfStock) { setSelectedSize(variant.size); setError(''); } }}
                      disabled={outOfStock}
                      className={`h-9 min-w-[40px] px-2 text-[10px] uppercase tracking-wider transition-colors ${
                        selected
                          ? 'bg-foreground text-background'
                          : outOfStock
                          ? 'border border-border text-muted-foreground/40 line-through cursor-not-allowed'
                          : 'border border-border text-foreground hover:bg-foreground hover:text-background'
                      }`}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {error && <p className="text-[11px] text-red-500">{error}</p>}

            {/* Botones */}
            <div className="flex flex-col gap-2 mt-auto">
              <button
                onClick={handleAddToCart}
                disabled={adding}
                className="w-full bg-foreground py-3.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75 disabled:opacity-50"
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
              <Link
                to={`/products/${product.id}`}
                onClick={onClose}
                className="w-full border border-border py-3.5 text-center text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                View Full Details
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}