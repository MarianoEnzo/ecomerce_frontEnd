import api from '../../../api/axios';
import type { Product, PaginatedProducts, ProductFilters } from '../../../types';

export const adminApi = {
  getProducts: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const res = await api.get<PaginatedProducts>('/admin/products', { params: filters });
    return res.data;
  },

  createProduct: async (data: any): Promise<Product> => {
    const res = await api.post<Product>('/admin/products', data);
    return res.data;
  },

  updateProduct: async (id: number, data: any): Promise<Product> => {
    const res = await api.patch<Product>(`/admin/products/${id}`, data);
    return res.data;
  },

  deleteProduct: async (id: number): Promise<void> => {
    await api.delete(`/admin/products/${id}`);
  },
};