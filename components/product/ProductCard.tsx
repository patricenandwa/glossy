"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/products";
import { useCart } from "@/stores/cart";
import { formatKsh } from "@/lib/format";
import { Rating } from "./Rating";
import { ShadeSelector } from "./ShadeSelector";
import Link from "next/link";
import Image from "next/image";

export function ProductCard({ product }: { product: Product }) {
  const [shade, setShade] = useState(product.shades[0]);
  const addItem = useCart((s: any) => s.addItem);

  return (
    <div className="group flex flex-col gap-4">
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden rounded-[24px] bg-blush/40 ring-1 ring-black/[0.04]"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <Image
            src={product.image}
            alt={`${product.name} lip gloss by Glow & Go`}
            loading="lazy"
            width={800}
            height={1000}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      </Link>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/product/${product.slug}`}
              className="block truncate font-medium text-charcoal"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 truncate text-xs text-zinc-500">
              {product.tagline}
            </p>
          </div>
          <span className="shrink-0 text-sm font-medium text-zinc-700 tabular-nums">
            {formatKsh(product.price)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <ShadeSelector
            shades={product.shades}
            selected={shade}
            onSelect={setShade}
            size="sm"
          />
          <Rating value={product.rating} />
        </div>
        <button
          type="button"
          onClick={() => {
            addItem(product, shade);
            toast.success(`${product.name} — ${shade.name} added`);
          }}
          className="mt-5 w-full rounded-full bg-white py-3 text-sm font-medium text-charcoal ring-1 ring-black/[0.06] transition hover:bg-charcoal hover:text-white"
        >
          Quick add
        </button>
      </div>
    </div>
  );
}
