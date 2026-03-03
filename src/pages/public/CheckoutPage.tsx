import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCartStore } from "../../store/cart.store";
import { ordersApi } from "../../features/orders/orders.api";
import { formatPrice } from "../../lib/utils";
const schema = z.object({
  contactName: z.string().min(2, "Name is required"),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
});

type CheckoutForm = z.infer<typeof schema>;

export default function CheckoutPage() {
  const { cart, clearCart } = useCartStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(schema),
  });

  const items = cart?.items ?? [];
  const total = cart?.total ?? "0";

  const onSubmit = async (data: CheckoutForm) => {
    if (items.length === 0) return;
    setServerError("");
    setLoading(true);
    try {
      const order = await ordersApi.createOrder(
        data.contactName,
        data.contactEmail || undefined,
      );
      clearCart();
      navigate(`/orders/${order.id}`, { state: { justCreated: true } });
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      setServerError(
        typeof msg === "string" ? msg : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 text-center">
        <p className="text-sm text-muted-foreground">Your cart is empty.</p>
        <button
          onClick={() => navigate("/catalog")}
          className="mt-4 text-xs uppercase tracking-widest text-foreground underline underline-offset-2"
        >
          Go to Catalog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
        <h1 className="mb-10 font-serif text-2xl text-foreground">Checkout</h1>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Formulario */}
          <div>
            <h2 className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
              Contact Information
            </h2>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Full Name *
                </label>
                <input
                  {...register("contactName")}
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                />
                {errors.contactName && (
                  <span className="text-[10px] text-red-500">
                    {errors.contactName.message}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase tracking-widest text-muted-foreground">
                  Email (optional)
                </label>
                <input
                  {...register("contactEmail")}
                  type="email"
                  autoComplete="email"
                  placeholder="your@email.com"
                  className="border-b border-border bg-transparent pb-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none transition-colors"
                />
                {errors.contactEmail && (
                  <span className="text-[10px] text-red-500">
                    {errors.contactEmail.message}
                  </span>
                )}
              </div>

              {serverError && (
                <p className="text-[11px] text-red-500">{serverError}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full bg-foreground py-4 text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75 disabled:opacity-50"
              >
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div>
            <h2 className="mb-6 text-xs uppercase tracking-widest text-muted-foreground">
              Order Summary
            </h2>

            <ul className="flex flex-col divide-y divide-border">
              {items.map((item) => {
                const variant = item.productVariant;
                const product = variant.product;
                return (
                  <li key={item.id} className="flex gap-4 py-4">
                    <div className="h-20 w-16 flex-shrink-0 overflow-hidden bg-card">
                      {variant.imageUrl ? (
                        <img
                          src={variant.imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="h-full w-full bg-card" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0.5">
                      <p className="text-sm text-foreground">{product.name}</p>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {variant.color.name} · {variant.size}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm text-foreground">
                      {formatPrice(Number(item.unitPrice) * item.quantity)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Total
              </span>
              <span className="text-sm font-medium text-foreground">
                {formatPrice(total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
