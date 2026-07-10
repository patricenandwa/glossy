import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product, Shade } from "@/data/products";
import { StaticImageData } from "next/image";

export type CartItem = {
  productSlug: string;
  productName: string;
  productImage: string | StaticImageData;
  price: number;
  shade: Shade;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product, shade: Shade, quantity?: number) => void;
  removeItem: (slug: string, shadeName: string) => void;
  updateQuantity: (slug: string, shadeName: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      addItem: (product, shade, quantity = 1) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.productSlug === product.slug && i.shade.name === shade.name,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + quantity } : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productSlug: product.slug,
                productName: product.name,
                productImage: product.image,
                price: product.price,
                shade,
                quantity,
              },
            ],
          };
        }),
      removeItem: (slug, shadeName) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productSlug === slug && i.shade.name === shadeName),
          ),
        })),
      updateQuantity: (slug, shadeName, quantity) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.productSlug === slug && i.shade.name === shadeName
                ? { ...i, quantity: Math.max(1, quantity) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      setOpen: (isOpen) => set({ isOpen }),
      itemCount: () => get().items.reduce((n, i) => n + i.quantity, 0),
      subtotal: () => get().items.reduce((s, i) => s + i.price * i.quantity, 0),
    }),
    { name: "glow-and-go-cart" },
  ),
);
