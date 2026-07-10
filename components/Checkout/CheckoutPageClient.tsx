"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useCart } from "@/stores/cart";
import { useOrders, generateOrderId } from "@/stores/orders";
import { formatKsh } from "@/lib/format";
import { useRouter } from "next/navigation";
import Link from "next/link";

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  phone: z
    .string()
    .trim()
    .min(9, "Enter a valid phone number")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Enter a valid phone number"),
  location: z.string().trim().min(2, "Where should we deliver?").max(120),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  apartment: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["mpesa", "cod"]),
});

const DELIVERY_FEE = 300;

export default function CheckoutPageClient() {
  const items = useCart((s: any) => s.items);
  const subtotal = useCart((s: any) => s.subtotal());
  const clear = useCart((s: any) => s.clear);
  const addOrder = useOrders((s: any) => s.addOrder);
  const router = useRouter();

  const [values, setValues] = useState({
    name: "",
    phone: "",
    location: "",
    landmark: "",
    apartment: "",
    notes: "",
    paymentMethod: "mpesa" as "mpesa" | "cod",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const total = subtotal + (items.length > 0 ? DELIVERY_FEE : 0);

  function set<K extends keyof typeof values>(k: K, v: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [k]: v }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const map: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        map[issue.path[0] as string] = issue.message;
      }
      setErrors(map);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const id = generateOrderId();
    addOrder({
      id,
      createdAt: new Date().toISOString(),
      customer: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        location: parsed.data.location,
        landmark: parsed.data.landmark || undefined,
        apartment: parsed.data.apartment || undefined,
        notes: parsed.data.notes || undefined,
      },
      paymentMethod: parsed.data.paymentMethod,
      items: [...items],
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      status: "received",
    });

    clear();
    toast.success("Order placed — see confirmation");
    router.push(`/order-confirmed/${id}`);
  }

  if (items.length === 0) {
    return (
      <>
        <section className="bg-soft-pink py-24">
          <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
            <h1 className="font-serif text-4xl text-charcoal">Your bag is empty</h1>
            <p className="mt-3 text-zinc-500">Add a gloss before checking out.</p>
            <Link
              href="/shop"
              className="mt-8 inline-flex h-12 items-center rounded-full bg-charcoal px-7 text-sm font-medium text-white"
            >
              Shop now
            </Link>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">
            Checkout
          </h1>
          <p className="mt-3 text-zinc-600">
            Just a few details — we'll bring the glow to you.
          </p>
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <form
            onSubmit={handleSubmit}
            className="grid gap-10 lg:grid-cols-[1fr_380px]"
          >
            <div className="space-y-8">
              <Fieldset title="Contact">
                <Field
                  label="Full name"
                  error={errors.name}
                  input={
                    <input
                      value={values.name}
                      onChange={(e) => set("name", e.target.value)}
                      placeholder="e.g. Amina Kariuki"
                      className={inputClass}
                    />
                  }
                />
                <Field
                  label="Phone number"
                  error={errors.phone}
                  input={
                    <input
                      value={values.phone}
                      onChange={(e) => set("phone", e.target.value)}
                      placeholder="e.g. 0712 345 678"
                      inputMode="tel"
                      className={inputClass}
                    />
                  }
                />
              </Fieldset>

              <Fieldset title="Delivery">
                <Field
                  label="Delivery location"
                  error={errors.location}
                  input={
                    <input
                      value={values.location}
                      onChange={(e) => set("location", e.target.value)}
                      placeholder="e.g. Kilimani, Yaya Centre"
                      className={inputClass}
                    />
                  }
                />
                <Field
                  label="Landmark"
                  optional
                  input={
                    <input
                      value={values.landmark}
                      onChange={(e) => set("landmark", e.target.value)}
                      placeholder="Nearest landmark"
                      className={inputClass}
                    />
                  }
                />
                <Field
                  label="Apartment / building"
                  optional
                  input={
                    <input
                      value={values.apartment}
                      onChange={(e) => set("apartment", e.target.value)}
                      placeholder="Apt 3B, Rose Court"
                      className={inputClass}
                    />
                  }
                />
                <Field
                  label="Delivery notes"
                  optional
                  input={
                    <textarea
                      value={values.notes}
                      onChange={(e) => set("notes", e.target.value)}
                      rows={3}
                      placeholder="Anything the rider should know"
                      className={`${inputClass} resize-none`}
                    />
                  }
                />
              </Fieldset>

              <Fieldset title="Payment">
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentOption
                    active={values.paymentMethod === "mpesa"}
                    onClick={() => set("paymentMethod", "mpesa")}
                    title="M-Pesa"
                    caption="Pay via Safaricom M-Pesa"
                  />
                  <PaymentOption
                    active={values.paymentMethod === "cod"}
                    onClick={() => set("paymentMethod", "cod")}
                    title="Cash on delivery"
                    caption="Nairobi only"
                  />
                </div>
                {values.paymentMethod === "mpesa" && (
                  <p className="rounded-2xl bg-blush/60 p-4 text-xs text-charcoal">
                    We'll share the till number and confirm your payment once you place the order.
                  </p>
                )}
              </Fieldset>
            </div>

            <aside className="h-fit rounded-3xl bg-soft-pink p-7 ring-1 ring-black/[0.04] lg:sticky lg:top-24">
              <h2 className="font-serif text-xl text-charcoal">Order summary</h2>
              <ul className="mt-5 space-y-4">
                {items.map((item: any) => (
                  <li
                    key={`${item.productSlug}-${item.shade.name}`}
                    className="flex gap-3"
                  >
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-black/[0.06]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">
                        {item.productName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {item.shade.name} · Qty {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm tabular-nums">
                      {formatKsh(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <dl className="mt-6 space-y-2 border-t border-black/[0.06] pt-6 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <dt>Subtotal</dt>
                  <dd className="tabular-nums">{formatKsh(subtotal)}</dd>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <dt>Delivery (Nairobi)</dt>
                  <dd className="tabular-nums">{formatKsh(DELIVERY_FEE)}</dd>
                </div>
              </dl>
              <div className="mt-4 flex justify-between border-t border-black/[0.06] pt-4 font-medium text-charcoal">
                <span>Total</span>
                <span className="tabular-nums">{formatKsh(total)}</span>
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="mt-8 block w-full rounded-full bg-charcoal py-4 text-center text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
              >
                {submitting ? "Placing order…" : `Place order · ${formatKsh(total)}`}
              </button>
              <p className="mt-4 text-center text-[11px] text-zinc-500">
                By placing your order you accept our{" "}
                <Link href="/terms" className="underline">terms</Link>.
              </p>
            </aside>
          </form>
        </div>
      </section>
    </>
  );
}

const inputClass =
  "block w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-sm text-charcoal ring-1 ring-black/[0.08] outline-none placeholder:text-zinc-400 focus:ring-charcoal";

function Fieldset({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="rounded-3xl bg-soft-pink p-6 ring-1 ring-black/[0.04] sm:p-8">
      <legend className="mb-5 -ml-2 rounded-full bg-soft-pink px-2 font-serif text-xl text-charcoal">
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}

function Field({
  label,
  input,
  error,
  optional,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
  optional?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs font-semibold uppercase tracking-widest text-zinc-500">
        {label}
        {optional && <span className="text-zinc-400 normal-case tracking-normal">optional</span>}
      </span>
      {input}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}

function PaymentOption({
  active,
  onClick,
  title,
  caption,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  caption: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl p-4 text-left ring-1 transition ${
        active
          ? "bg-white ring-charcoal"
          : "bg-white/60 ring-black/[0.06] hover:ring-black/20"
      }`}
    >
      <span className="block font-medium text-charcoal">{title}</span>
      <span className="mt-0.5 block text-xs text-zinc-500">{caption}</span>
    </button>
  );
}
