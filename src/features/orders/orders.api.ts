import api from '../../api/axios';
import type { Order } from '../../types';

export const ordersApi = {
  createOrder: async (contactName: string, contactEmail?: string): Promise<Order> => {
    const res = await api.post<Order>('/orders', { contactName, contactEmail });
    return res.data;
  },

  getMyOrders: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>('/orders/my-orders');
    return res.data;
  },

  getOne: async (id: number): Promise<Order> => {
    const res = await api.get<Order>(`/orders/${id}`);
    return res.data;
  },

  getAll: async (): Promise<Order[]> => {
    const res = await api.get<Order[]>('/orders');
    return res.data;
  },

  updateStatus: async (id: number, status: string): Promise<Order> => {
    const res = await api.patch<Order>(`/orders/${id}/status`, { status });
    return res.data;
  },
};