import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersApi } from '../../features/orders/orders.api';
import { formatPrice } from '../../lib/utils';
import type { Order, OrderStatus } from '../../types';

const STATUS_OPTIONS: { label: string; value: OrderStatus }[] = [
  { label: 'Pending', value: 'PENDING' },
  { label: 'Paid', value: 'PAID' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

const STATUS_COLOR: Record<string, string> = {
  PENDING: 'text-yellow-600',
  PAID: 'text-green-600',
  CANCELLED: 'text-red-500',
};

export default function AdminOrdersPage() {
  const queryClient = useQueryClient();

  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: ordersApi.getAll,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-2xl text-foreground">Orders</h1>
        {orders && (
          <p className="mt-1 text-xs text-muted-foreground">{orders.length} total orders</p>
        )}
      </div>

      {isLoading && (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse bg-muted" />
          ))}
        </div>
      )}

      {isError && (
        <p className="text-sm text-muted-foreground">Failed to load orders.</p>
      )}

      {!isLoading && !isError && orders && orders.length === 0 && (
        <p className="text-sm text-muted-foreground">No orders yet.</p>
      )}

      {!isLoading && !isError && orders && orders.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {['#', 'Contact', 'Items', 'Total', 'Date', 'Status'].map((h) => (
                  <th
                    key={h}
                    className="pb-3 pr-6 text-[10px] uppercase tracking-widest text-muted-foreground font-normal"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order: Order) => (
                <tr key={order.id} className="border-b border-border transition-colors hover:bg-card">
                  <td className="py-4 pr-6 text-xs text-muted-foreground">#{order.id}</td>
                  <td className="py-4 pr-6">
                    <p className="text-sm text-foreground">{order.contactName}</p>
                    {order.contactEmail && (
                      <p className="text-xs text-muted-foreground">{order.contactEmail}</p>
                    )}
                  </td>
                  <td className="py-4 pr-6 text-xs text-muted-foreground">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </td>
                  <td className="py-4 pr-6 text-sm text-foreground">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="py-4 pr-6 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="py-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        statusMutation.mutate({ id: order.id, status: e.target.value })
                      }
                      className={`border-b border-border bg-transparent pb-1 text-[10px] uppercase tracking-widest focus:outline-none cursor-pointer ${STATUS_COLOR[order.status]}`}
                    >
                      {STATUS_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value} className="text-foreground normal-case">
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}