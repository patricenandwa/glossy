import OrderConfirmedPageClient from "@/components/Order/OrderConfirmedPageClient";
import { fetchPublicOrderByOrderNumber } from "@/lib/orders";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed — Glow & Go",
  description: "Your Glow & Go order is confirmed.",
  robots: "noindex",
};

export default async function OrderConfirmedPage(props: PageProps<"/order-confirmed/[id]">) {
  const { id } = await props.params;
  const order = await fetchPublicOrderByOrderNumber(id);
  return <OrderConfirmedPageClient order={order} />;
}
