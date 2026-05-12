'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type CartItem = {
  productId: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>, qty?: number) => { quantity: number; isNew: boolean; totalQuantity: number };
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, qty = 1) => {
        let result = { quantity: 0, isNew: false, totalQuantity: 0 };

        set((state) => {
          const existing = state.items.find((entry) => entry.productId === item.productId);

          if (existing) {
            const quantity = Math.min(existing.quantity + qty, existing.stock);
            result = {
              quantity: quantity - existing.quantity,
              isNew: false,
              totalQuantity: quantity,
            };

            return {
              items: state.items.map((entry) =>
                entry.productId === item.productId
                  ? {
                      ...entry,
                      quantity,
                    }
                  : entry,
              ),
            };
          }

          const quantity = Math.min(qty, item.stock);
          result = {
            quantity,
            isNew: true,
            totalQuantity: quantity,
          };

          return {
            items: [...state.items, { ...item, quantity }],
          };
        });

        return result;
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((entry) => entry.productId !== productId),
        })),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((entry) => (entry.productId === productId ? { ...entry, quantity: Math.max(1, Math.min(quantity, entry.stock)) } : entry)),
        })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    {
      name: 'toko-hafizh-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
