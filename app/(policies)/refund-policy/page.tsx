import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy — Glow & Go",
  description: "Our refund and returns policy.",
};

export default function Page() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Policies</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Refund Policy</h1>
        </div>
      </section>
      <p>We stand by every gloss we ship. If something isn't right, we'll make it right.</p>
      <h2>Damaged or wrong items</h2>
      <p>Please contact us on WhatsApp within 48 hours of delivery with a photo. We'll arrange a free replacement or refund.</p>
      <h2>Change of mind</h2>
      <p>Unopened items can be returned within 7 days for a refund minus delivery. Opened items cannot be returned for hygiene reasons.</p>
      <h2>Refund method</h2>
      <p>Refunds are processed via M-Pesa within 3 business days of receiving the returned item.</p>
    </>    
  );
}