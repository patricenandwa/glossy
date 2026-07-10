import CartPageClient from "@/components/Cart/CartPageClient";
import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Your Bag — Glow & Go",
  description: "Review your Glow & Go lip gloss bag before checkout.",
}

export default function CartPage() {
  return <CartPageClient />;
}
