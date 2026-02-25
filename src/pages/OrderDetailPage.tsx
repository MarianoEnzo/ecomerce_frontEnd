import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../features/orders/orders.api';
import { formatPrice } from '../lib/utils';
import { CheckCircle } from 'lucide-react';

const STATUS_LABEL: Record<string, string> = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-yellow-600',
  PAID: 'text-green-600',
  CANCELLED: 'text-red-500',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const justCreated = location.state?.justCreated ?? false;

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOne(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-16">
        <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">
          <div className="flex flex-col gap-4">
            <div className="h-6 w-1/3 animate-pulse bg-muted" />
            <div className="h-4 w-1/2 animate-pulse bg-muted" />
            <div className="mt-6 h-40 animate-pulse bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Order not found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-xs uppercase tracking-widest text-foreground underline"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-2xl px-6 py-12 lg:px-8">

        {/* Confirmación si viene del checkout */}
        {justCreated && (
          <div className="mb-8 flex items-center gap-3 border border-border bg-card p-4">
            <CheckCircle className="h-5 w-5 flex-shrink-0 text-green-600" strokeWidth={1.5} />
            <div>
              <p className="text-sm text-foreground">Order placed successfully!</p>
              <p className="text-xs text-muted-foreground">
                We've received your order. Keep this page bookmarked to track it.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8 flex flex-col gap-2">
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
            Order #{order.id}
          </span>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-2xl text-foreground">
              {order.contactName}
            </h1>
            <span className={`text-xs uppercase tracking-widest ${STATUS_COLOR[order.status]}`}>
              {STATUS_LABEL[order.status]}
            </span>
          </div>
          {order.contactEmail && (
            <p className="text-xs text-muted-foreground">{order.contactEmail}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        {/* Items */}
        <div className="mb-8">
          <h2 className="mb-4 text-[10px] uppercase tracking-widest text-muted-foreground">
            Items
          </h2>
          <ul className="flex flex-col divide-y divide-border">
            {order.items.map((item) => {
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
                    <p className="text-[10px] text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm text-foreground">
                    {formatPrice(Number(item.unitPrice) * item.quantity)}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Total</span>
          <span className="text-sm text-foreground">{formatPrice(order.totalAmount)}</span>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            to="/catalog"
            className="flex-1 bg-foreground py-3.5 text-center text-xs uppercase tracking-widest text-background transition-opacity hover:opacity-75"
          >
            Continue Shopping
          </Link>
          <Link
            to="/my-orders"
            className="flex-1 border border-border py-3.5 text-center text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-foreground hover:text-background"
          >
            My Orders
          </Link>
        </div>

      </div>
    </div>
  );
}