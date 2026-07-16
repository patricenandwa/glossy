"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";
import { formatKsh } from "@/lib/format";
import { NAIROBI_DELIVERY_LOCATIONS, getDeliveryFeeByCode, getDeliveryLocationByCode } from "@/lib/checkout/logistics";
import { useCart } from "@/stores/cart";

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: PaystackSetupOptions) => {
        openIframe: () => void;
      };
    };
  }
}

type PaystackSetupOptions = {
  key: string;
  email: string;
  amount: number;
  currency: string;
  ref: string;
  metadata?: Record<string, string>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

const schema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(80),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(9, "Enter a valid phone number")
    .max(20)
    .regex(/^[+0-9\s-]+$/, "Enter a valid phone number"),
  locationCode: z.string().trim().min(1, "Select an approximate delivery location"),
  addressLine: z.string().trim().min(2, "Enter the estate, road, or pickup address").max(120),
  landmark: z.string().trim().max(120).optional().or(z.literal("")),
  apartment: z.string().trim().max(120).optional().or(z.literal("")),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
  paymentMethod: z.enum(["paystack", "cash_on_delivery"]),
});

type CheckoutPageClientProps = {
  paymentState?: string;
  failedReference?: string;
};

async function loadPaystackScript() {
  if (window.PaystackPop) {
    return true;
  }

  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://js.paystack.co/v1/inline.js"]',
    ) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), { once: true });
      existingScript.addEventListener("error", () => resolve(false), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPageClient({
  paymentState,
  failedReference,
}: CheckoutPageClientProps) {
  const hasHydrated = useCart((s) => s.hasHydrated);
  const items = useCart((s) => s.items);
  const subtotal = useCart((s) => s.subtotal());
  const clear = useCart((s) => s.clear);
  const router = useRouter();

  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    locationCode: "",
    addressLine: "",
    landmark: "",
    apartment: "",
    notes: "",
    paymentMethod: "paystack" as "paystack" | "cash_on_delivery",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = values.locationCode ? getDeliveryFeeByCode(values.locationCode) : 0;
  const total = subtotal + (items.length > 0 ? deliveryFee : 0);
  const selectedLocation = getDeliveryLocationByCode(values.locationCode);

  if (!hasHydrated) {
    return (
      <section className="bg-soft-pink py-24">
        <div className="mx-auto max-w-xl px-5 text-center sm:px-8">
          <h1 className="font-serif text-4xl text-charcoal">Loading checkout</h1>
          <p className="mt-3 text-zinc-500">Fetching your saved bag details.</p>
        </div>
      </section>
    );
  }

  function set<K extends keyof typeof values>(key: K, value: (typeof values)[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (items.length === 0) {
      return;
    }

    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const nextErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        nextErrors[issue.path[0] as string] = issue.message;
      }
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      const response = await fetch("/api/v1/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...parsed.data,
          items: items.map((item) => ({
            productSlug: item.productSlug,
            quantity: item.quantity,
            shadeName: item.shade.name,
          })),
        }),
      });

      const payload = (await response.json()) as
        | {
            error?: string;
          }
        | {
            ok: true;
            mode: "cash_on_delivery";
            orderNumber: string;
          }
        | {
            ok: true;
            mode: "paystack";
            orderNumber: string;
            paystack: {
              amountInKobo: number;
              reference: string;
              email: string;
              metadata: Record<string, string>;
            };
          };

      if (!response.ok || !("ok" in payload) || !payload.ok) {
        const errorMessage = "error" in payload ? payload.error : undefined;
        throw new Error(errorMessage || "Unable to start checkout.");
      }

      if (payload.mode === "cash_on_delivery") {
        clear();
        toast.success("Order placed. We’ll call to confirm delivery.");
        router.push(`/order-confirmed/${payload.orderNumber}`);
        return;
      }

      const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY;
      if (!publicKey) {
        throw new Error("Paystack public key is not configured.");
      }

      const scriptLoaded = await loadPaystackScript();
      if (!scriptLoaded || !window.PaystackPop) {
        throw new Error("Unable to load Paystack checkout.");
      }

      const handler = window.PaystackPop.setup({
        key: publicKey,
        email: payload.paystack.email,
        amount: payload.paystack.amountInKobo,
        currency: "KES",
        ref: payload.paystack.reference,
        metadata: payload.paystack.metadata,
        callback: ({ reference }) => {
          window.location.assign(
            `/api/v1/payments/paystack/callback?reference=${encodeURIComponent(reference)}`,
          );
        },
        onClose: () => {
          setSubmitting(false);
          toast.message("Payment window closed. Your order is still pending payment.");
        },
      });

      handler.openIframe();
    } catch (error) {
      console.error("Checkout failed:", error);
      toast.error(error instanceof Error ? error.message : "Unable to complete checkout.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-20 sm:pb-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Checkout</h1>
          <p className="mt-3 text-zinc-600">
            Your order total is verified on the server before any payment starts.
          </p>
          {paymentState === "failed" && (
            <div className="mt-5 rounded-2xl bg-white/80 p-4 text-sm text-charcoal ring-1 ring-black/[0.06]">
              Paystack could not confirm your payment{failedReference ? ` for ${failedReference}` : ""}.
              You can try again below and we’ll still recalculate the total from the database.
            </div>
          )}
        </div>
      </section>

      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <form onSubmit={handleSubmit} className="grid gap-10 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <Fieldset title="Contact">
                <Field
                  label="Full name"
                  error={errors.name}
                  input={
                    <input
                      value={values.name}
                      onChange={(event) => set("name", event.target.value)}
                      placeholder="e.g. Amina Kariuki"
                      className={inputClass}
                    />
                  }
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Email"
                    error={errors.email}
                    input={
                      <input
                        value={values.email}
                        onChange={(event) => set("email", event.target.value)}
                        placeholder="e.g. amina@example.com"
                        inputMode="email"
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
                        onChange={(event) => set("phone", event.target.value)}
                        placeholder="e.g. 0712 345 678"
                        inputMode="tel"
                        className={inputClass}
                      />
                    }
                  />
                </div>
              </Fieldset>

              <Fieldset title="Delivery">
                <Field
                  label="Approximate location"
                  error={errors.locationCode}
                  input={
                    <select
                      value={values.locationCode}
                      onChange={(event) => set("locationCode", event.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select Nairobi location</option>
                      {NAIROBI_DELIVERY_LOCATIONS.map((location) => (
                        <option key={location.code} value={location.code}>
                          {location.label} · {formatKsh(location.fee)}
                        </option>
                      ))}
                    </select>
                  }
                />
                <Field
                  label="Estate / road / pickup point"
                  error={errors.addressLine}
                  input={
                    <input
                      value={values.addressLine}
                      onChange={(event) => set("addressLine", event.target.value)}
                      placeholder="e.g. Wood Avenue, Yaya Centre"
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
                      onChange={(event) => set("landmark", event.target.value)}
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
                      onChange={(event) => set("apartment", event.target.value)}
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
                      onChange={(event) => set("notes", event.target.value)}
                      rows={3}
                      placeholder="Anything the rider should know"
                      className={`${inputClass} resize-none`}
                    />
                  }
                />
                {selectedLocation && (
                  <p className="rounded-2xl bg-white p-4 text-xs text-zinc-600 ring-1 ring-black/[0.06]">
                    Placeholder logistics quote: {selectedLocation.label} delivers in about{" "}
                    {selectedLocation.eta} from our warehouse.
                  </p>
                )}
              </Fieldset>

              <Fieldset title="Payment">
                <div className="grid gap-3 sm:grid-cols-2">
                  <PaymentOption
                    active={values.paymentMethod === "paystack"}
                    onClick={() => set("paymentMethod", "paystack")}
                    title="Paystack"
                    caption="Card, bank, transfer, or wallet"
                  />
                  <PaymentOption
                    active={values.paymentMethod === "cash_on_delivery"}
                    onClick={() => set("paymentMethod", "cash_on_delivery")}
                    title="Pay on delivery"
                    caption="Nairobi only"
                  />
                </div>
                {values.paymentMethod === "paystack" && (
                  <p className="rounded-2xl bg-blush/60 p-4 text-xs text-charcoal">
                    We’ll create your order first, compute the total from the database, then open
                    Paystack with that verified amount.
                  </p>
                )}
              </Fieldset>
            </div>

            <aside className="h-fit rounded-3xl bg-soft-pink p-7 ring-1 ring-black/[0.04] lg:sticky lg:top-24">
              <h2 className="font-serif text-xl text-charcoal">Order summary</h2>
              <ul className="mt-5 space-y-4">
                {items.map((item) => (
                  <li key={`${item.productSlug}-${item.shade.name}`} className="flex gap-3">
                    <img
                      src={item.productImage}
                      alt={item.productName}
                      className="size-14 shrink-0 rounded-xl object-cover ring-1 ring-black/[0.06]"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-charcoal">{item.productName}</p>
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
                  <dt>Delivery</dt>
                  <dd className="tabular-nums">
                    {deliveryFee > 0 ? formatKsh(deliveryFee) : "Select location"}
                  </dd>
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
                {submitting
                  ? "Processing checkout..."
                  : values.paymentMethod === "paystack"
                    ? `Pay with Paystack · ${formatKsh(total)}`
                    : `Place COD order · ${formatKsh(total)}`}
              </button>
              <p className="mt-4 text-center text-[11px] text-zinc-500">
                Track future updates with your order number and phone instead of creating an account.
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
        active ? "bg-white ring-charcoal" : "bg-white/60 ring-black/[0.06] hover:ring-black/20"
      }`}
    >
      <span className="block font-medium text-charcoal">{title}</span>
      <span className="mt-0.5 block text-xs text-zinc-500">{caption}</span>
    </button>
  );
}
