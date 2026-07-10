import OrderConfirmedPageClient from "@/components/Order/OrderConfirmedPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — Glow & Go",
  description: "Your Glow & Go order is confirmed.",
  robots: "noindex",
};

export default function OrderConfirmedPage() {
  return <OrderConfirmedPageClient />;
}