import { useState, useMemo, useEffect, useLayoutEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Minus, Plus } from "lucide-react";
import { productsApi } from "../../features/auth/products/product.api";
import { cartApi } from "../../features/cart/cart.api";
import { useCartStore } from "../../store/cart.store";
import { formatPrice } from "../../lib/utils";
import type { ProductVariant } from "../../types";

export default function ProductDetailPage() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setCart, openCart } = useCartStore();

  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productsApi.getOne(Number(id)),
    enabled: !!id,
  });

  useEffect(() => {
    if (product && product.variants.length > 0) {
      setSelectedColor(product.variants[0].colorId);
    }
  }, [product]);

  // Colores únicos disponibles
  const colors = useMemo(() => {
    if (!product) return [];
    const seen = new Set<number>();
    return product.variants.reduce<
      { id: number; name: string; hexCode: string; imageUrl: string | null }[]
    >((acc, v) => {
      if (!seen.has(v.colorId)) {
        seen.add(v.colorId);
        acc.push({
          id: v.colorId,
          name: v.color.name,
          hexCode: v.color.hexCode,
          imageUrl: v.imageUrl,
        });
      }
      return acc;
    }, []);
  }, [product]);

  // Talles disponibles para el color seleccionado
  const availableSizes = useMemo(() => {
    if (!product) return [];
    return product.variants.filter(
      (v) => !selectedColor || v.colorId === selectedColor,
    );
  }, [product, selectedColor]);

  // Variante seleccionada actualmente
  const selectedVariant = useMemo<ProductVariant | null>(() => {
    if (!product || !selectedSize) return null;
    return (
      product.variants.find(
        (v) =>
          v.size === selectedSize &&
          (!selectedColor || v.colorId === selectedColor),
      ) ?? null
    );
  }, [product, selectedSize, selectedColor]);

  // Imagen activa — la del color seleccionado o la primera disponible
  const activeImage = useMemo(() => {
    if (selectedColor) {
      const colorVariant = product?.variants.find(
        (v) => v.colorId === selectedColor,
      );
      if (colorVariant?.imageUrl) return colorVariant.imageUrl;
    }
    const firstWithImage = product?.variants.find((v) => v.imageUrl);
    return firstWithImage?.imageUrl ?? null;
  }, [product, selectedColor]);

  const handleAddToCart = async () => {
    if (!selectedVariant) {
      setError("Please select a size");
      return;
    }
    if (selectedVariant.stock < quantity) {
      setError(`Only ${selectedVariant.stock} units available`);
      return;
    }
    setError("");
    setAdding(true);
    try {
      await cartApi.addItem(selectedVariant.id, quantity);
      const cart = await cartApi.getCart();
      setCart(cart);
      openCart();
    } catch {
      setError("Could not add to cart. Try again.");
    } finally {
      setAdding(false);
    }
  };

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="aspect-[3/4] animate-pulse bg-muted" />
            <div className="flex flex-col gap-4 pt-4">
              <div className="h-4 w-1/3 animate-pulse bg-muted" />
              <div className="h-8 w-2/3 animate-pulse bg-muted" />
              <div className="h-4 w-1/4 animate-pulse bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Error ─────────────────────────────────────────────────────────────────
  if (isError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Product not found.</p>
        <button
          onClick={() => navigate("/catalog")}
          className="mt-4 text-xs uppercase tracking-widest text-foreground underline"
        >
          Back to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground">
          <button
            onClick={() => navigate("/")}
            className="hover:text-foreground transition-colors"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/catalog")}
            className="hover:text-foreground transition-colors"
          >
            Catalog
          </button>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Imagen */}
          <div className="aspect-[3/4] overflow-hidden bg-card">
            {activeImage ? (
              <img
                src={activeImage}
                alt={product.name}
                className="h-full w-full object-cover transition-opacity duration-700"
                style={{ opacity: 0 }}
                onLoad={(e) => (e.currentTarget.style.opacity = "1")}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-card">
                <span className="text-xs text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Info + Selector */}
          <div className="flex flex-col gap-8 lg:pt-4">
            {/* Nombre y precio */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                {product.category.toLowerCase()} ·{" "}
                {product.gender.toLowerCase()}
              </span>
              <h1 className="font-serif text-3xl text-foreground lg:text-4xl">
                {product.name}
              </h1>
              <p className="mt-1 text-xl text-foreground">
                {formatPrice(product.price)}
              </p>
            </div>

            {/* Descripción */}
            {product.description && (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>
            )}

            {/* Color */}
            {colors.length > 0 && (
              <div className="flex flex-col gap-3">
                <span className="text-xs uppercase tracking-widest text-foreground">
                  Color
                  {selectedColor
                    ? `: ${colors.find((c) => c.id === selectedColor)?.name}`
                    : ""}
                </span>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => {
                        setSelectedColor(color.id);
                        setSelectedSize(null);
                        setError("");
                      }}
                      title={color.name}
                      className={`relative h-14 w-14 overflow-hidden border-2 transition-all ${
                        selectedColor === color.id
                          ? "border-foreground"
                          : "border-transparent hover:border-muted"
                      }`}
                    >
                      {color.imageUrl ? (
                        <img
                          src={color.imageUrl}
                          alt={color.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div
                          className="h-full w-full"
                          style={{ backgroundColor: color.hexCode }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Talle */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-foreground">
                Size{selectedSize ? `: ${selectedSize}` : ""}
              </span>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map((variant) => {
                  const outOfStock = variant.stock === 0;
                  const selected = selectedSize === variant.size;
                  return (
                    <button
                      key={variant.id}
                      onClick={() => {
                        if (!outOfStock) {
                          setSelectedSize(variant.size);
                          setError("");
                        }
                      }}
                      disabled={outOfStock}
                      className={`h-10 min-w-[48px] px-3 text-xs uppercase tracking-wider transition-colors ${
                        selected
                          ? "bg-foreground text-background"
                          : outOfStock
                            ? "border border-border text-muted-foreground/40 line-through cursor-not-allowed"
                            : "border border-border text-foreground hover:bg-foreground hover:text-background"
                      }`}
                    >
                      {variant.size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Cantidad */}
            <div className="flex flex-col gap-3">
              <span className="text-xs uppercase tracking-widest text-foreground">
                Quantity
              </span>
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-border">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    <Minus className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                  <span className="flex h-10 w-12 items-center justify-center text-sm text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity((q) =>
                        Math.min(selectedVariant?.stock ?? 99, q + 1),
                      )
                    }
                    className="flex h-10 w-10 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background"
                  >
                    <Plus className="h-3 w-3" strokeWidth={1.5} />
                  </button>
                </div>

                {selectedVariant && (
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    {selectedVariant.stock} available
                  </span>
                )}
              </div>
            </div>

            {/* Error */}
            {error && <p className="text-[11px] text-red-500">{error}</p>}

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className="w-full bg-foreground py-4 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75 disabled:opacity-50"
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
