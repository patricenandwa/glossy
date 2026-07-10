import { Rating } from "@/components/product/Rating";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Reviews — Glow & Go",
  description: "Real reviews from Nairobi customers loving Glow & Go lip gloss.",
};

const REVIEWS = [
  { name: "Sarah M.", area: "Kilimani", rating: 5, product: "Glass Hour", body: "Finally, a gloss that doesn't feel like a magnet for my hair. The shine is incredible and it feels so nourishing." },
  { name: "Amina K.", area: "Westlands", rating: 5, product: "Silk Glaze", body: "Ordered at 10am, had it by lunch. My new favourite everyday gloss." },
  { name: "Njeri W.", area: "Lavington", rating: 5, product: "Cocoa Glaze", body: "Cocoa Glaze is the one. Deep, comfortable, and lasts through dinner." },
  { name: "Wanjiku T.", area: "Karen", rating: 4, product: "Rose Tint", body: "Beautiful colour, cushioned finish. Would love a matte version too!" },
  { name: "Fatuma A.", area: "Parklands", rating: 5, product: "Night Gloss", body: "The pigment! Wore it to a wedding and got so many compliments." },
  { name: "Akinyi O.", area: "South B", rating: 5, product: "Morning Dew", body: "Feels like a balm, looks like a gloss. Perfect for the office." },
];

export default function ReviewsPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-16 sm:pt-24">
        <div className="mx-auto max-w-4xl px-5 text-center sm:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Reviews</p>
          <h1 className="font-serif text-5xl leading-none text-charcoal sm:text-6xl">Loved across Nairobi.</h1>
          <div className="mt-6 inline-flex items-center gap-3">
            <Rating value={4.9} size="md" />
            <span className="text-sm text-zinc-500">Based on 1,200+ customers</span>
          </div>
        </div>
      </section>
      <section className="bg-white py-14 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 sm:grid-cols-2 sm:px-8 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.name} className="flex h-full flex-col rounded-3xl bg-soft-pink p-7 ring-1 ring-black/[0.04]">
              <Rating value={r.rating} />
              <blockquote className="mt-4 flex-1 text-pretty text-charcoal">"{r.body}"</blockquote>
              <figcaption className="mt-6 border-t border-black/[0.06] pt-4">
                <p className="text-sm font-medium text-charcoal">{r.name} · {r.area}</p>
                <p className="text-xs text-zinc-500">on {r.product}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  );
}
