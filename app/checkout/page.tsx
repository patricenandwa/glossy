import CheckoutPageClient from "@/components/Checkout/CheckoutPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Glow & Go",
  description: "Fast, secure checkout for your Glow & Go order.",
};

export default function CheckoutPage() {
  return (
    <>
      <CheckoutPageClient />
    </>
  );
}