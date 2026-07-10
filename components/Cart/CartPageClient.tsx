"use client";

import { X } from "lucide-react";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { useCart } from "@/stores/cart";
import { formatKsh } from "@/lib/format";
import Link from "next/link";

export default function CartPageClient() {
  const items = useCart((s: any) => s.items);
  const removeItem = useCart((s: any) => s.removeItem);
  const updateQty = useCart((s: any) => s.updateQuantity);
  const subtotal = useCart((s: any) => s.subtotal());

  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">
            Your bag
          </h1>
          <p className="mt-3 text-zinc-600">
            {items.length === 0
              ? "It's a little quiet in here."
              : `${items.length} ${items.length === 1 ? "item" : "items"} ready to glow.`}
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-4xl px-5 sm:px-8">
          {items.length === 0 ? (
            <div className="rounded-3xl bg-soft-pink p-14 text-center ring-1 ring-black/[0.04]">
              <p className="font-serif text-2xl text-charcoal">Nothing here yet.</p>
              <p className="mt-2 text-sm text-zinc-500">
                Discover our signature glosses.
              </p>
              <Link
                href="/shop"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-charcoal px-7 text-sm font-medium text-white"
              >
                Shop the collection
              </Link>
            </div>
          ) : (
            <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
              <ul className="divide-y divide-black/[0.06]">
                {items.map((item: any) => (
                  <li
                    key={`${item.productSlug}-${item.shade.name}`}
                    className="flex gap-4 py-6"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="h-24 w-24 shrink-0 rounded-2xl object-cover ring-1 ring-black/[0.04]"
                    />
                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate font-serif text-lg text-charcoal">
                            {item.productName}
                          </p>
                          <p className="mt-0.5 text-xs text-zinc-500">
                            Shade — {item.shade.name}
                          </p>
                        </div>
                        <button
                          onClick={() =>
                            removeItem(item.productSlug, item.shade.name)
                          }
                          className="grid size-8 place-items-center rounded-full text-zinc-400 hover:bg-blush hover:text-charcoal"
                          aria-label="Remove"
                        >
                          <X className="size-4" strokeWidth={1.5} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-3">
                        <QuantityStepper
                          value={item.quantity}
                          onChange={(n) =>
                            updateQty(item.productSlug, item.shade.name, n)
                          }
                        />
                        <span className="text-sm font-medium tabular-nums">
                          {formatKsh(item.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <aside className="h-fit rounded-3xl bg-soft-pink p-7 ring-1 ring-black/[0.04]">
                <h2 className="font-serif text-xl text-charcoal">Order summary</h2>
                <dl className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between text-zinc-600">
                    <dt>Subtotal</dt>
                    <dd className="tabular-nums">{formatKsh(subtotal)}</dd>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <dt>Delivery</dt>
                    <dd>Calculated at checkout</dd>
                  </div>
                </dl>
                <div className="my-6 border-t border-black/[0.06]" />
                <div className="flex justify-between font-medium text-charcoal">
                  <span>Estimated total</span>
                  <span className="tabular-nums">{formatKsh(subtotal)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="mt-8 block w-full rounded-full bg-charcoal py-4 text-center text-sm font-medium text-white transition hover:opacity-90"
                >
                  Checkout securely
                </Link>
                <Link
                  href="/shop"
                  className="mt-3 block text-center text-sm text-zinc-500 underline underline-offset-4 hover:text-charcoal"
                >
                  Continue shopping
                </Link>
                <p className="mt-6 text-center text-[11px] text-zinc-500">
                  Same-day rider dispatch in Nairobi for orders before 2pm.
                </p>
              </aside>
            </div>
          )}
        </div>
      </section>
    </>
  );
}