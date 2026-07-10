import { Metadata } from "next/dist/lib/metadata/types/metadata-interface";


export const metadata: Metadata = {
  title: "Terms & Conditions — Glow & Go",
  description: "Terms of use for the Glow & Go website.",
};
export default function TermsPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Legal</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Terms & Conditions</h1>
        </div>
      </section>
      <p>By placing an order with Glow & Go, you accept the following terms.</p>
      <h2>Orders</h2>
      <p>All orders are subject to product availability. We reserve the right to cancel and refund any order.</p>
      <h2>Pricing</h2>
      <p>Prices are in Kenyan Shillings and include VAT. Delivery is charged separately at checkout.</p>
      <h2>Intellectual property</h2>
      <p>All content on this website is owned by Glow & Go and may not be reproduced without permission.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of the Republic of Kenya.</p>
    </>
  );
};
