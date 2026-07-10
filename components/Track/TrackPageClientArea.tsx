"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useOrders, type Order, type OrderStatus } from "@/stores/orders";
import { formatKsh } from "@/lib/format";

export default function TrackPageClientArea({ steps }: { steps: { key: OrderStatus; label: string; caption: string }[] }) {
  const find = useOrders((s: any) => s.findByPhoneAndId);
  const [phone, setPhone] = useState("");
  const [id, setId] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const found = find(phone, id);
    if (!found) {
      setOrder(null);
      setError("We couldn't find that order. Double-check the number and phone.");
      return;
    }
    setOrder(found);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8">
        <form
        onSubmit={submit}
        className="rounded-3xl bg-soft-pink p-6 ring-1 ring-black/[0.04] sm:p-8"
        >
        <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Order number
            </span>
            <input
                value={id}
                onChange={(e) => setId(e.target.value)}
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0712 345 678"
                inputMode="tel"
                className="block w-full rounded-2xl bg-white px-4 py-3.5 text-sm ring-1 ring-black/[0.08] outline-none focus:ring-charcoal"
            />
            </label>
        </div>
        <button
            type="submit"
            className="mt-6 w-full rounded-full bg-charcoal py-4 text-sm font-medium text-white transition hover:opacity-90 sm:w-auto sm:px-10"
        >
            Track order
        </button>
        {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
        </form>

        {order && (
        <div className="mt-10 rounded-3xl bg-white p-6 ring-1 ring-black/[0.04] sm:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Order
                </p>
                <p className="mt-1 font-mono text-lg text-charcoal">{order.id}</p>
            </div>
            <p className="text-sm text-zinc-500 tabular-nums">
                {formatKsh(order.total)}
            </p>
            </div>

            <ol className="mt-8 space-y-6">
            {steps.map((step, i) => {
                const activeIdx = steps.findIndex((s) => s.key === order.status);
                const done = i <= activeIdx;
                return (
                <li key={step.key} className="flex gap-4">
                    <div
                    className={`grid size-8 shrink-0 place-items-center rounded-full ${
                        done
                        ? "bg-charcoal text-white"
                        : "bg-blush text-zinc-400 ring-1 ring-black/[0.04]"
                    }`}
                    >
                    {done ? (
                        <Check className="size-4" strokeWidth={2} />
                    ) : (
                        <span className="text-xs">{i + 1}</span>
                    )}
                    </div>
                    <div>
                    <p
                        className={`font-medium ${
                        done ? "text-charcoal" : "text-zinc-400"
                        }`}
                    >
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
