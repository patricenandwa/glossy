"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { APIProductResponse, DbShade } from "@/lib/db/schema";
import { useCart } from "@/stores/cart";
import { formatKsh } from "@/lib/format";
import { Rating } from "./Rating";
import { ShadeSelector } from "./ShadeSelector";
import Link from "next/link";
import Image from "next/image";

const FALLBACK_SHADE: DbShade = {
  name: "Signature",
  hex: "#d7b49e",
};

export function ProductCard({ product }: { product: APIProductResponse }) {
  const [shade, setShade] = useState<DbShade>(product.shades[0] ?? FALLBACK_SHADE);
  const addItem = useCart((s: any) => s.addItem);

  const productImage = product.images?.[0]?.storageKey || "/placeholder.jpg";
  const price =
    typeof product.price === "string" ? parseFloat(product.price) : product.price;
  const rating =
    typeof product.rating === "string" ? parseFloat(product.rating) : product.rating;
  const stock =
    typeof product.stock === "string" ? parseInt(product.stock, 10) : product.stock;
  const isOutOfStock = stock <= 0;
  const hasShadeOptions = product.shades.length > 0;

  return (
    <div className="group flex flex-col gap-4">
      <Link
        href={`/product/${product.slug}`}
        className="block overflow-hidden rounded-[24px] bg-blush/40 ring-1 ring-black/[0.04]"
      >
        <div className="aspect-[4/5] overflow-hidden">
          <Image
            src={productImage}
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
            {formatKsh(price)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between">
          {hasShadeOptions ? (
            <ShadeSelector
              shades={product.shades}
              selected={shade}
              onSelect={setShade}
              size="sm"
            />
          ) : (
            <p className="text-xs text-zinc-500">Shade will be selected for you.</p>
          )}
          <Rating value={rating} />
        </div>
        <button
          type="button"
          onClick={() => {
            if (isOutOfStock) {
              toast.error(`${product.name} is currently out of stock`);
              return;
            }

            addItem(product, shade);
            toast.success(`${product.name} — ${shade.name} added`);
          }}
          disabled={isOutOfStock}
          className="mt-5 w-full rounded-full bg-white py-3 text-sm font-medium text-charcoal ring-1 ring-black/[0.06] transition hover:bg-charcoal hover:text-white disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-white disabled:hover:text-charcoal"
        >
          {isOutOfStock ? "Out of stock" : "Quick add"}
        </button>
      </div>
    </div>
  );
}
