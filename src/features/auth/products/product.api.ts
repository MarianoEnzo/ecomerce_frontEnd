import api from "../../../api/axios";
import type {
  Product,
  PaginatedProducts,
  ProductFilters,
} from "../../../types";

export const productsApi = {
  
  getAll: async (filters: ProductFilters = {}): Promise<PaginatedProducts> => {
    const res = await api.get<PaginatedProducts>("/products", {
      params: filters,
    });
    return res.data;
  },

  getOne: async (id: number): Promise<Product> => {
    const res = await api.get<Product>(`/products/${id}`);
    return res.data;
  },
  getBySlug: (slug: string) =>
    api.get(`/products/slug/${slug}`).then((r) => r.data),
};
