"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, Truck, RotateCw, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { Rating } from "@/components/product/Rating";
import { ShadeSelector } from "@/components/product/ShadeSelector";
import { QuantityStepper } from "@/components/product/QuantityStepper";
import { useCart } from "@/stores/cart";
import { formatKsh } from "@/lib/format";
import Link from "next/link";
import type { APIProductResponse } from "@/lib/db/schema";

export default function ProductPageClientArea({ 
  product, 
  related 
}: { 
  product: APIProductResponse; 
  related: APIProductResponse[]; 
}) {
  const [shade, setShade] = useState(product.shades[0]);
  const [qty, setQty] = useState(1);
  const [galleryIdx, setGalleryIdx] = useState(0);
  const addItem = useCart((s: any) => s.addItem);
  const setCartOpen = useCart((s: any) => s.setOpen);

  const gallery = product.images && product.images.length > 0
    ? product.images.map(img => img.storageKey)
    : ["/placeholder.jpg"];

  const price = typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const rating = typeof product.rating === "string" ? parseFloat(product.rating) : product.rating;
  const reviewCount = typeof product.reviewCount === "string" ? parseInt(product.reviewCount, 10) : product.reviewCount;
  const stock = typeof product.stock === "string" ? parseInt(product.stock, 10) : product.stock;

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-charcoal"
        >
          <ChevronLeft className="size-4" />
          Back to shop
        </Link>
      </div>

      <section className="bg-soft-pink pb-16 sm:pb-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-16">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-[24px] bg-blush ring-1 ring-black/[0.04]">
              <img
                src={gallery[galleryIdx]}
                alt={`${product.name} lip gloss`}
                width={1000}
                height={1250}
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {gallery.map((src: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setGalleryIdx(i)}
                  className={`overflow-hidden rounded-2xl ring-1 transition ${
                    i === galleryIdx
                      ? "ring-charcoal"
                      : "ring-black/[0.06] hover:ring-black/20"
                  }`}
                >
                  <img
                    src={src}
                    alt={`${product.name} view ${i + 1}`}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:pt-6">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              {product.tagline}
            </p>
            <h1 className="mt-2 font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
              {product.name}
            </h1>
            <div className="mt-4 flex items-center gap-4">
              <span className="text-2xl font-medium text-charcoal tabular-nums">
                {formatKsh(price)}
              </span>
              <Rating value={rating} count={reviewCount} size="md" />
            </div>
            <p className="mt-6 text-pretty text-zinc-600">{product.description}</p>

            <div className="mt-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Shade — <span className="text-charcoal">{shade.name}</span>
              </p>
              <ShadeSelector
                shades={product.shades}
                selected={shade}
                onSelect={setShade}
                size="lg"
              />
            </div>

            <div className="mt-8 flex items-center gap-4">
              <QuantityStepper value={qty} onChange={setQty} />
              <p className="text-xs text-zinc-500">
                {stock > 10
                  ? "In stock"
                  : `Only ${stock} left`}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => {
                  addItem(product, shade, qty);
                  toast.success(`${product.name} — ${shade.name} added`);
                }}
                className="h-14 flex-1 rounded-full bg-charcoal text-sm font-medium text-white transition hover:opacity-90"
              >
                Add to bag · {formatKsh(price * qty)}
              </button>
              <Link
                href="/checkout"
                onClick={() => {
                  addItem(product, shade, qty);
                  setCartOpen(false);
                }}
                className="grid h-14 flex-1 place-items-center rounded-full bg-white text-sm font-medium text-charcoal ring-1 ring-black/[0.08] hover:bg-blush"
              >
                Buy it now
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3 rounded-3xl bg-white p-5 text-center ring-1 ring-black/[0.04]">
              <div>
                <Truck className="mx-auto size-5 text-charcoal" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Same-day Nairobi
                </p>
              </div>
              <div>
                <RotateCw className="mx-auto size-5 text-charcoal" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  Easy refunds
                </p>
              </div>
              <div>
                <ShieldCheck className="mx-auto size-5 text-charcoal" strokeWidth={1.5} />
                <p className="mt-2 text-[10px] font-semibold uppercase tracking-widest text-zinc-500">
                  100% authentic
                </p>
              </div>
            </div>

            <div className="mt-10 space-y-8">
              <Section title="Benefits">
                <ul className="space-y-2 text-sm text-zinc-600">
                  {product.benefits.map((b: string) => (
                    <li key={b} className="flex gap-2">
                      <span className="mt-2 size-1 shrink-0 rounded-full bg-rose-gold" />
                      {b}
                    </li>
                  ))}
                </ul>
              </Section>
              <Section title="How to use">
                <p className="text-sm text-zinc-600">{product.howToUse}</p>
              </Section>
              <Section title="Ingredients">
                <p className="text-sm text-zinc-600">{product.ingredients}</p>
              </Section>
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="mb-10 font-serif text-3xl text-charcoal sm:text-4xl">
            You may also love
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p: any) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="rounded-3xl bg-white p-6 ring-1 ring-black/[0.04]" open>
      <summary className="cursor-pointer list-none font-serif text-xl text-charcoal">
        {title}
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}
