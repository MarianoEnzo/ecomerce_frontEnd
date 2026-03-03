import { useEffect } from "react";
import { Link } from "react-router-dom";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "../store/cart.store";
import { cartApi } from "../features/cart/cart.api";
import { formatPrice } from "../lib/utils";

export default function CartDrawer() {
  const { cart, isOpen, closeCart, setCart } = useCartStore();

  useEffect(() => {
    cartApi
      .getCart()
      .then(setCart)
      .catch(() => {});
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-background transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <Link
            to="/cart"
            onClick={closeCart}
            className="text-xs uppercase tracking-widest text-foreground hover:opacity-60 transition-opacity"
          >
            Cart {items.length > 0 && `(${items.length})`}
          </Link>
          <button
            onClick={closeCart}
            className="text-foreground transition-colors hover:text-muted-foreground"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div
          className={`flex-1 px-6 py-4 ${isOpen ? "overflow-y-auto" : "overflow-hidden"}`}
        >
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <p className="text-sm text-muted-foreground">
                Your cart is empty
              </p>
              <button
                onClick={closeCart}
                className="text-xs uppercase tracking-widest text-foreground underline underline-offset-2"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => {
                const variant = item.productVariant;
                const product = variant.product;
                return (
                  <li key={item.id} className="flex gap-4">
                    {/* Imagen */}
                    <div className="h-24 w-20 flex-shrink-0 overflow-hidden bg-card">
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
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col gap-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-foreground">
                            {product.name}
                          </p>
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                            {variant.color.name} · {variant.size}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                        </button>
                      </div>

                      <p className="text-sm text-foreground">
                        {formatPrice(item.unitPrice)}
                      </p>

                      {/* Cantidad */}
                      <div className="mt-auto flex items-center border border-border w-fit">
                        <button
                          onClick={() => {
                            if (item.quantity === 1) {
                              handleRemoveItem(item.id);
                            } else {
                              handleUpdateItem(item.id, item.quantity - 1);
                            }
                          }}
                          className="flex h-7 w-7 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background"
                        >
                          <Minus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                        <span className="flex h-7 w-8 items-center justify-center text-xs text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateItem(item.id, item.quantity + 1)
                          }
                          className="flex h-7 w-7 items-center justify-center text-foreground transition-colors hover:bg-foreground hover:text-background"
                        >
                          <Plus className="h-3 w-3" strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Footer — solo si hay items */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="text-sm text-foreground">
                {formatPrice(total)}
              </span>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="w-full bg-foreground py-3.5 text-center text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75"
            >
              Checkout
            </Link>

            <button
              onClick={handleClearCart}
              className="text-center text-[10px] uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
