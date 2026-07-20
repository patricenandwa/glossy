import founder from "@/assets/about-founder.jpeg";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Glow & Go, Nairobi",
  description: "Nairobi-made lip gloss, formulated with intention. Meet the studio behind Glow & Go.",
  openGraph: {
    title: "About — Glow & Go, Nairobi",
    description: "The story behind Nairobi's most-loved lip gloss.",
  },
};

export default function AboutPage() {
  return (
    <>
      <section className="bg-soft-pink pt-14 pb-16 sm:pt-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-zinc-500">Our story</p>
            <h1 className="font-serif text-5xl leading-[1] text-charcoal sm:text-6xl">Made in Nairobi. Made for lips.</h1>
            <p className="mt-6 text-pretty text-lg text-zinc-600">
              Glow & Go began with a simple frustration: nothing on the shelf felt like it was made for us. Not the shade range, not the finish, not the feel. So we built it ourselves — one cushioned, high-shine gloss at a time.
            </p>
          </div>
          <Image src={founder} alt="Founder of Glow & Go" width={1000} height={1200} className="aspect-[4/5] w-full rounded-[32px] object-cover ring-1 ring-black/[0.04]" />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 sm:px-8 sm:grid-cols-3">
          {[
            { t: "Mission", d: "Elevate the everyday lip with formulas designed for real Kenyan women." },
            { t: "Vision", d: "Become the most-loved beauty label out of Nairobi — starting with lips." },
            { t: "Promise", d: "Clean ingredients, honest pricing, and fast delivery. Always." },
          ].map((v) => (
            <div key={v.t} className="rounded-3xl bg-soft-pink p-8 ring-1 ring-black/[0.04]">
              <h3 className="font-serif text-2xl text-charcoal">{v.t}</h3>
              <p className="mt-3 text-sm text-zinc-600">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-soft-pink py-20 text-center">
        <div className="mx-auto max-w-2xl px-5 sm:px-8">
          <h2 className="font-serif text-4xl text-charcoal">Why only lips?</h2>
          <p className="mt-5 text-zinc-600">
            Because lips deserve their own house. When you focus on one thing, you make it beautifully. Every formula we ship starts and ends here.
          </p>
          <Link href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-charcoal px-8 text-sm font-medium text-white">Shop the collection</Link>
        </div>
      </section>
    </>
  );
}
