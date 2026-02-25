import api from '../../api/axios';
import type { Cart } from '../../types';

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    const res = await api.get<Cart>('/cart');
    return res.data;
  },

  addItem: async (productVariantId: number, quantity: number): Promise<Cart> => {
    const res = await api.post('/cart/items', { productVariantId, quantity });
    return res.data;
  },

  updateItem: async (itemId: number, quantity: number): Promise<Cart> => {
    const res = await api.patch(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  removeItem: async (itemId: number): Promise<void> => {
    await api.delete(`/cart/items/${itemId}`);
  },

  clearCart: async (): Promise<void> => {
    await api.delete('/cart/clear');
  },
};