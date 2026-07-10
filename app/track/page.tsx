import { type OrderStatus } from "@/stores/orders";
import { Metadata } from "next";
import TrackPageClientArea from "@/components/Track/TrackPageClientArea";

export const metadata: Metadata = {
  title: "Track your order — Glow & Go",
  description: "Track your Glow & Go delivery in Nairobi with your order number and phone.",
};

const STEPS: { key: OrderStatus; label: string; caption: string }[] = [
  { key: "received", label: "Order received", caption: "We got it — thank you." },
  { key: "preparing", label: "Preparing", caption: "Being hand-packed in Kilimani." },
  { key: "out_for_delivery", label: "Out for delivery", caption: "On the way to you." },
  { key: "delivered", label: "Delivered", caption: "Enjoy your glow." },
];

export default function TrackPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-24 sm:pb-16">
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
            Order tracking
          </p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">
            Where's your glow?
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
