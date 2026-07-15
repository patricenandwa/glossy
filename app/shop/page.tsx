import { ProductCard } from "@/components/product/ProductCard";
import { fetchProducts } from "@/lib/api";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All Glosses — Glow & Go Nairobi",
  description:
    "Explore the full Glow & Go lip gloss collection. Cushioned, high-shine, delivered same-day across Nairobi.",
  openGraph: {
    title: "Shop All Glosses — Glow & Go Nairobi",
    description: "The full Glow & Go collection. Delivered same-day across Nairobi.",
  },
};

export default async function ShopPage() {
  const products = await fetchProducts();
  
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-10 sm:pt-20 sm:pb-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">
            The collection
          </p>
          <h1 className="max-w-[20ch] font-serif text-5xl leading-[1] text-charcoal sm:text-6xl">
            Every gloss, one place.
          </h1>
          <p className="mt-5 max-w-[42ch] text-zinc-600">
            Eight shades, one obsession. Cushioned, comfortable, and made to last
            through Nairobi weather.
          </p>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
