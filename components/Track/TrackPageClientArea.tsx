"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { formatKsh } from "@/lib/format";
import type { PublicOrder } from "@/lib/orders";

type TrackStep = {
  key: PublicOrder["status"];
  label: string;
  caption: string;
};

export default function TrackPageClientArea({ steps }: { steps: readonly TrackStep[] }) {
  const [phone, setPhone] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/v1/orders/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderNumber, phone }),
      });

      const payload = (await response.json()) as { order?: PublicOrder; error?: string };

      if (!response.ok || !payload.order) {
        setOrder(null);
        setError(payload.error || "We couldn't find that order.");
        return;
      }

      setOrder(payload.order);
    } catch (lookupError) {
      console.error("Order tracking failed:", lookupError);
      setError("Unable to check this order right now.");
      setOrder(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
      <form onSubmit={submit} className="rounded-3xl bg-soft-pink p-6 ring-1 ring-black/[0.04] sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Order number
            </span>
            <input
              value={orderNumber}
              onChange={(event) => setOrderNumber(event.target.value.toUpperCase())}
              placeholder="GG-XXXXXXX"
              className="block w-full rounded-2xl bg-white px-4 py-3.5 text-sm ring-1 ring-black/[0.08] outline-none focus:ring-charcoal"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Phone number
            </span>
            <input
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="0712 345 678"
              inputMode="tel"
              className="block w-full rounded-2xl bg-white px-4 py-3.5 text-sm ring-1 ring-black/[0.08] outline-none focus:ring-charcoal"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-charcoal py-4 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {submitting ? "Checking..." : "Track order"}
        </button>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      </form>

      {order && (
        <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-black/[0.04] sm:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Order</p>
              <p className="mt-1 font-mono text-lg text-charcoal">{order.orderNumber}</p>
            </div>
            <p className="text-sm text-zinc-500 tabular-nums">{formatKsh(order.total)}</p>
          </div>

          <div className="mt-6 grid gap-4 rounded-3xl bg-soft-pink p-5 text-sm text-zinc-600 ring-1 ring-black/[0.04] sm:grid-cols-3">
            <div>
              <p className="font-medium text-charcoal">Payment</p>
              <p>{order.paymentStatus === "paid" ? "Paid" : "Awaiting payment"}</p>
            </div>
            <div>
              <p className="font-medium text-charcoal">Delivery</p>
              <p>{order.delivery.locationName}</p>
            </div>
            <div>
              <p className="font-medium text-charcoal">Tracking code</p>
              <p>{order.delivery.trackingCode || "Being assigned"}</p>
            </div>
          </div>

          <ol className="mt-8 space-y-6">
            {steps.map((step, index) => {
              const activeIndex = steps.findIndex((candidate) => candidate.key === order.status);
              const done = index <= activeIndex;
              return (
                <li key={step.key} className="flex gap-4">
                  <div
                    className={`grid size-8 shrink-0 place-items-center rounded-full ${
                      done
                        ? "bg-charcoal text-white"
                        : "bg-blush text-zinc-400 ring-1 ring-black/[0.04]"
                    }`}
                  >
                    {done ? <Check className="size-4" strokeWidth={2} /> : <span className="text-xs">{index + 1}</span>}
                  </div>
                  <div>
                    <p className={done ? "font-medium text-charcoal" : "font-medium text-zinc-400"}>
                      {step.label}
                    </p>
                    <p className="text-sm text-zinc-500">{step.caption}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
