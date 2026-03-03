// ─── Enums ────────────────────────────────────────────────────────────────────

export type Role = "ADMIN" | "SELLER" | "CUSTOMER";
export type Gender = "MALE" | "FEMALE" | "UNISEX";
export type Category = "TSHIRT" | "SWEATSHIRT" | "JACKET" | "PANTS" | "SHOES";
export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export type CartStatus = "ACTIVE" | "CHECKED_OUT";
export type OrderStatus = "PENDING" | "PAID" | "CANCELLED";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id: number;
  email: string;
  role: Role;
  createdAt: string;
}

export interface AuthResponse {
  access_token: string;
}

// ─── Products ─────────────────────────────────────────────────────────────────

export interface Color {
  id: number;
  name: string;
  hexCode: string;
}

export interface ProductVariant {
  id: number;
  productId: number;
  size: Size;
  stock: number;
  colorId: number;
  color: Color;
  imageUrl: string | null;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string; // Prisma Decimal viene como string en JSON
  category: Category;
  gender: Gender;
  isActive: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  variants: ProductVariant[];
}

export interface PaginatedProducts {
  data: Product[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
  };
}

// ─── Filters ──────────────────────────────────────────────────────────────────

export interface ProductFilters {
  category?: Category;
  gender?: Gender;
  size?: Size;
  colorId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  search?: string;
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: number;
  cartId: string;
  productVariantId: number;
  quantity: number;
  unitPrice: string;
  productVariant: ProductVariant & {
    product: Product;
  };
}

export interface Cart {
  id: string;
  userId: number | null;
  status: CartStatus;
  items: CartItem[];
  total: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export interface OrderItem {
  id: number;
  orderId: number;
  productVariantId: number;
  quantity: number;
  unitPrice: string;
  productVariant: ProductVariant & {
    product: Product;
  };
}

export interface Order {
  id: number;
  cartId: string;
  userId: number | null;
  status: OrderStatus;
  totalAmount: string;
  contactName: string;
  contactEmail: string | null;
  createdAt: string;
  items: OrderItem[];
}

// ─── Forms ────────────────────────────────────────────────────────────────────

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  email: string;
  password: string;
}

export interface CheckoutForm {
  contactName: string;
  contactEmail?: string;
}

export interface CreateProductForm {
  name: string;
  description: string;
  price: number;
  category: Category;
  gender: Gender;
  isActive: boolean;
  variants: {
    size: Size;
    stock: number;
    colorId: number;
    imageUrl?: string;
  }[];
}
