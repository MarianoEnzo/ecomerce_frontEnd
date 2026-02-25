import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '../features/orders/orders.api';
import { formatPrice } from '../lib/utils';
import type { Order } from '../types';

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

export default function MyOrdersPage() {
  const navigate = useNavigate();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: ordersApi.getMyOrders,
  });

  return (
    <div className="min-h-screen bg-background pt-16">
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">

        <h1 className="mb-10 font-serif text-2xl text-foreground">My Orders</h1>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-24 animate-pulse bg-muted" />
            ))}
          </div>
        )}

        {/* Error */}
        {isError && (
          <p className="text-sm text-muted-foreground">Failed to load orders.</p>
        )}

        {/* Empty */}
        {!isLoading && !isError && orders?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-sm text-muted-foreground">You have no orders yet.</p>
            <button
              onClick={() => navigate('/catalog')}
              className="mt-4 text-xs uppercase tracking-widest text-foreground underline underline-offset-2"
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders list */}
        {!isLoading && !isError && orders && orders.length > 0 && (
          <ul className="flex flex-col divide-y divide-border">
            {orders.map((order: Order) => (
              <li
                key={order.id}
                onClick={() => navigate(`/orders/${order.id}`)}
                className="flex cursor-pointer items-center justify-between py-5 transition-colors hover:bg-card px-2 -mx-2"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Order #{order.id}
                  </span>
                  <p className="text-sm text-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-xs uppercase tracking-widest ${STATUS_COLOR[order.status]}`}>
                    {STATUS_LABEL[order.status]}
                  </span>
                  <span className="text-sm text-foreground">
                    {formatPrice(order.totalAmount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}