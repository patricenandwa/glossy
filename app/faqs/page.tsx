import { Metadata } from "next";


export const metadata: Metadata = {
  title: "FAQs — Glow & Go",
  description: "Delivery, payments, ingredients and refund questions answered.",
};

const FAQS = [
  { q: "How long does delivery take?", a: "Same-day for orders placed before 2pm in Nairobi. Next-day for later orders and select outskirts." },
  { q: "How do I pay?", a: "We accept M-Pesa and cash on delivery for Nairobi. You'll receive the till number by SMS after checkout." },
  { q: "Are your glosses cruelty-free?", a: "Yes — every Glow & Go product is vegan and never tested on animals." },
  { q: "Are ingredients safe for sensitive lips?", a: "Our formulas are fragrance-light and skin-loving. Full ingredient lists are on every product page." },
  { q: "Can I return a product?", a: "Unopened items can be returned within 7 days. See our refund policy for details." },
  { q: "Are your products authentic?", a: "Every gloss is hand-packed in our Kilimani studio. There are no resellers." },
  { q: "Do you ship outside Nairobi?", a: "Yes — courier delivery countrywide within 1–3 business days." },
];

export default function FaqPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">FAQs</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Good questions, honest answers.</h1>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-black/[0.06] px-5 sm:px-8">
          {FAQS.map((f) => (
            <details key={f.q} className="group py-6">
              <summary className="flex cursor-pointer items-center justify-between font-serif text-xl text-charcoal">
                {f.q}
                <span className="text-2xl font-light text-zinc-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-4 text-zinc-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
