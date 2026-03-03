import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ArrowRight } from "lucide-react";
import { useCartStore } from "../../store/cart.store";
import { cartApi } from "../../features/cart/cart.api";
import { formatPrice } from "../../lib/utils";

export default function CartPage() {
  const { cart, setCart } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    cartApi
      .getCart()
      .then(setCart)
      .catch(() => {});
  }, []);

  const handleUpdateItem = async (itemId: number, quantity: number) => {
    try {
      await cartApi.updateItem(itemId, quantity);
      const updated = await cartApi.getCart();
      setCart(updated);
    } catch {}
  };

  const handleRemoveItem = async (itemId: number) => {
    try {
      await cartApi.removeItem(itemId);
      const updated = await cartApi.getCart();
      setCart(updated);
    } catch {}
  };

  const handleClearCart = async () => {
    try {
      await cartApi.clearCart();
      const updated = await cartApi.getCart();
      setCart(updated);
    } catch {}
  };

  const items = cart?.items ?? [];
  const total = cart?.total ?? "0";

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center pt-16">
        <span className="font-serif text-[100px] leading-none text-foreground/10">
          0
        </span>
        <p className="mt-4 text-sm text-muted-foreground">
          Your cart is empty.
        </p>
        <Link
          to="/catalog"
          className="mt-8 inline-flex items-center gap-2 bg-foreground px-8 py-3.5 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75"
        >
          Go to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <h1 className="font-serif text-2xl text-foreground">
            Your Cart{" "}
            <span className="text-muted-foreground">({items.length})</span>
          </h1>
          <button
            onClick={handleClearCart}
            className="text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear all
          </button>
        </div>

        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16">
          {/* Items — ocupa 2 columnas */}
          <div className="lg:col-span-2">
            <ul className="flex flex-col divide-y divide-border">
              {items.map((item) => {
                const variant = item.productVariant;
                const product = variant.product;
                return (
                  <li key={item.id} className="flex gap-5 py-6">
                    {/* Imagen clickeable */}
                    <Link
                      to={`/products/${product.id}`}
                      className="h-28 w-22 flex-shrink-0 overflow-hidden bg-card"
                    >
                      {variant.imageUrl ? (
                        <img
                          src={variant.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover transition-opacity duration-500"
                          style={{ opacity: 0 }}
                          onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                        />
                      ) : (
                        <div className="h-full w-full bg-card" />
                      )}
                    </Link>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <Link
                            to={`/products/${product.id}`}
                            className="text-sm text-foreground hover:opacity-60 transition-opacity"
                          >
                            {product.name}
                          </Link>
                          <p className="mt-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {variant.color.name} · {variant.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>

                      <p className="text-sm text-foreground">
                        {formatPrice(item.unitPrice)}
                      </p>

                      {/* Cantidad + subtotal */}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-border">
                          <button
                            onClick={() => {
                              if (item.quantity === 1) {
                                handleRemoveItem(item.id);
                              } else {
                                handleUpdateItem(item.id, item.quantity - 1);
                              }
                            }}
                            className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background"
                          >
                            <Minus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                          <span className="flex h-8 w-10 items-center justify-center text-xs text-foreground">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              handleUpdateItem(item.id, item.quantity + 1)
                            }
                            className="flex h-8 w-8 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background"
                          >
                            <Plus className="h-3 w-3" strokeWidth={1.5} />
                          </button>
                        </div>
                        <span className="text-sm text-foreground">
                          {formatPrice(Number(item.unitPrice) * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Seguir comprando */}
            <Link
              to="/catalog"
              className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary — columna derecha */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 flex flex-col gap-5 border border-border p-6">
              <h2 className="text-xs uppercase tracking-widest text-foreground">
                Order Summary
              </h2>

              {/* Líneas de subtotal */}
              <div className="flex flex-col gap-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-xs text-muted-foreground">
                      {item.productVariant.product.name}{" "}
                      <span className="text-[10px]">×{item.quantity}</span>
                    </span>
                    <span className="text-xs text-foreground">
                      {formatPrice(Number(item.unitPrice) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  Total
                </span>
                <span className="text-sm text-foreground">
                  {formatPrice(total)}
                </span>
              </div>

              <button
                onClick={() => navigate("/checkout")}
                className="flex w-full items-center justify-center gap-2 bg-foreground py-4 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75"
              >
                Checkout
                <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
