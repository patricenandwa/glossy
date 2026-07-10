import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "./cart";

export type OrderStatus =
  | "received"
  | "preparing"
  | "out_for_delivery"
  | "delivered";

export type Order = {
  id: string;
  createdAt: string;
  customer: {
    name: string;
    phone: string;
    location: string;
    landmark?: string;
    apartment?: string;
    notes?: string;
  };
  paymentMethod: "mpesa" | "cod";
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
};

type OrdersState = {
  orders: Order[];
  addOrder: (order: Order) => void;
  findByPhoneAndId: (phone: string, id: string) => Order | undefined;
};

export const useOrders = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) => set((s) => ({ orders: [order, ...s.orders] })),
      findByPhoneAndId: (phone, id) =>
        get().orders.find(
          (o) =>
            o.id.toLowerCase() === id.trim().toLowerCase() &&
            o.customer.phone.replace(/\s+/g, "") === phone.replace(/\s+/g, ""),
        ),
    }),
    { name: "glow-and-go-orders" },
  ),
);

export function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `GG-${stamp}${rand}`;
}
