import { Metadata } from "next";
import TrackPageClientArea from "@/components/Track/TrackPageClientArea";

export const metadata: Metadata = {
  title: "Track your order — Glow & Go",
  description: "Track your Glow & Go delivery in Nairobi with your order number and phone.",
};

const STEPS = [
  { key: "pending", label: "Order received", caption: "We got it and we’re validating the order." },
  { key: "confirmed", label: "Confirmed", caption: "Your order is accepted and ready for fulfilment." },
  { key: "processing", label: "Preparing", caption: "Being hand-packed in the studio." },
  { key: "shipped", label: "Out for delivery", caption: "On the way to you." },
  { key: "delivered", label: "Delivered", caption: "Enjoy your glow." },
] as const;

export default function TrackPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Order tracking
          </p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">
            Where&apos;s your glow?
          </h1>
          <p className="mt-4 max-w-[42ch] text-zinc-600">
            Enter your order number and the phone you used to check out.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <TrackPageClientArea steps={STEPS} />
      </section>
    </>
  );
}
