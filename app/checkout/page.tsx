import CheckoutPageClient from "@/components/Checkout/CheckoutPageClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Glow & Go",
  description: "Fast, secure checkout for your Glow & Go order.",
};

export default async function CheckoutPage(props: PageProps<"/checkout">) {
  const searchParams = await props.searchParams;
  const paymentState = Array.isArray(searchParams.payment)
    ? searchParams.payment[0]
    : searchParams.payment;
  const failedReference = Array.isArray(searchParams.reference)
    ? searchParams.reference[0]
    : searchParams.reference;

  return <CheckoutPageClient paymentState={paymentState} failedReference={failedReference} />;
}
