import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Glow & Go",
  description: "How we handle your data.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Legal</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Privacy Policy</h1>
        </div>
      </section>
      <p>Your privacy matters to us. This policy explains what we collect and why.</p>
      <h2>What we collect</h2>
      <p>Name, phone number, delivery location and order details — used solely to prepare and deliver your order.</p>
      <h2>Marketing</h2>
      <p>If you join our newsletter, we may email you about new shade drops. You can unsubscribe any time.</p>
      <h2>Data sharing</h2>
      <p>We never sell your data. We only share information with our delivery riders as needed to fulfil orders.</p>
      <h2>Contact</h2>
      <p>Questions? Email hello@glowandgo.co.ke.</p>
    </>
  );
}
