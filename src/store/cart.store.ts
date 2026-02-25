import { create } from 'zustand';
import type { Cart } from '../types';

interface CartState {
  cart: Cart | null;
  isOpen: boolean; // controla el drawer/sidebar del carrito
  setCart: (cart: Cart) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  itemCount: () => number;
}

export const useCartStore = create<CartState>()((set, get) => ({
  cart: null,
  isOpen: false,

  setCart: (cart) => set({ cart }),

  clearCart: () => set({ cart: null }),

  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

  itemCount: () => {
    const cart = get().cart;
    if (!cart) return 0;
    return cart.items.reduce((acc, item) => acc + item.quantity, 0);
  },
}));