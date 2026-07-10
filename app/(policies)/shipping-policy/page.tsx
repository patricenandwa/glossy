import { Metadata } from "next";


export const metadata: Metadata = {
  title: "Shipping Policy — Glow & Go",
  description: "Delivery times and shipping details.",
};
export default function ShippingPolicyPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Policies</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Shipping Policy</h1>
        </div>
      </section>
      <p>We deliver across Kenya from our Kilimani studio.</p>
      <h2>Nairobi</h2>
      <p>Same-day for orders placed before 2pm. Next-day for late orders. Flat delivery fee of KSh 300.</p>
      <h2>Outside Nairobi</h2>
      <p>Countrywide courier delivery within 1–3 business days. Fees calculated at checkout.</p>
      <h2>Order tracking</h2>
      <p>Track your order any time from our tracking page using your phone number and order ID.</p>
    </>
  );
};
