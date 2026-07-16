"use client";

import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { formatKsh } from "@/lib/format";
import type { PublicOrder } from "@/lib/orders";
import { useCart } from "@/stores/cart";

export default function OrderConfirmedPageClient({ order }: { order: PublicOrder | null }) {
  const clear = useCart((state) => state.clear);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (order) {
      clear();
    }
  }, [clear, order]);

  if (!order) {
    return (
      <section className="bg-soft-pink py-24">
        <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
          <h1 className="font-serif text-4xl text-charcoal">Order not found</h1>
          <p className="mt-3 text-zinc-500">
            We couldn&apos;t load that order. You can still track it below with your phone number.
          </p>
          <Link
            href="/track"
            className="mt-8 inline-flex h-12 items-center rounded-full bg-charcoal px-7 text-sm font-medium text-white"
          >
            Track your order
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-soft-pink pt-14 pb-16 sm:pt-24 sm:pb-24">
      <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <div className="rounded-[32px] bg-white p-8 text-center ring-1 ring-black/[0.04] sm:p-14">
          <div className="mx-auto grid size-16 place-items-center rounded-full bg-blush">
            <Check className="size-7 text-charcoal" strokeWidth={1.75} />
          </div>
          <h1 className="mt-6 font-serif text-4xl text-charcoal sm:text-5xl">
            Thank you, {order.customer.name.split(" ")[0]}.
          </h1>
          <p className="mt-3 text-zinc-500">
            Your order is confirmed and you can track it anytime with your phone number.
          </p>

          <div className="mt-8 inline-flex items-center gap-3 rounded-full bg-soft-pink px-5 py-3 ring-1 ring-black/[0.06]">
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Order</span>
            <span className="font-mono text-sm text-charcoal">{order.orderNumber}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(order.orderNumber);
                setCopied(true);
                toast.success("Order number copied");
                window.setTimeout(() => setCopied(false), 1500);
              }}
              className="grid size-7 place-items-center rounded-full hover:bg-blush"
              aria-label="Copy order number"
            >
              {copied ? <Check className="size-3.5 text-charcoal" /> : <Copy className="size-3.5 text-charcoal" />}
            </button>
          </div>

          <div className="mt-10 grid gap-6 text-left sm:grid-cols-2">
            <InfoCard title="Delivering to">
              <p className="font-medium text-charcoal">{order.customer.name}</p>
              <p className="text-zinc-500">{order.customer.phone}</p>
              <p className="mt-2 text-zinc-500">{order.delivery.locationName}</p>
              <p className="text-zinc-500">{order.delivery.addressLine}</p>
              {order.delivery.landmark && <p className="text-zinc-500">Near {order.delivery.landmark}</p>}
            </InfoCard>
            <InfoCard title="Payment">
              <p className="text-charcoal">
                {order.paymentMethod === "paystack" ? "Paystack" : "Pay on delivery"}
              </p>
              <p className="mt-1 text-zinc-500">
                Status: {order.paymentStatus === "paid" ? "Paid" : "Pending"}
              </p>
              <p className="mt-1 text-zinc-500">
                Total <span className="tabular-nums">{formatKsh(order.total)}</span>
              </p>
            </InfoCard>
          </div>

          <div className="mt-8 rounded-3xl bg-soft-pink p-6 text-left ring-1 ring-black/[0.04]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Order details
            </p>
            <ul className="divide-y divide-black/[0.06]">
              {order.items.map((item) => (
                <li key={`${item.productSlug}-${item.shade}`} className="flex justify-between gap-3 py-3 text-sm">
                  <span className="text-charcoal">
                    {item.productName} · {item.shade}
                    <span className="ml-2 text-zinc-500">× {item.quantity}</span>
                  </span>
                  <span className="tabular-nums">{formatKsh(item.price * item.quantity)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/track"
              className="inline-flex h-12 items-center justify-center rounded-full bg-charcoal px-7 text-sm font-medium text-white"
            >
              Track this order
            </Link>
            <Link
              href="/shop"
              className="inline-flex h-12 items-center justify-center rounded-full bg-white px-7 text-sm font-medium text-charcoal ring-1 ring-black/[0.06]"
            >
              Keep shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl bg-soft-pink p-6 ring-1 ring-black/[0.04]">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">{title}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}
