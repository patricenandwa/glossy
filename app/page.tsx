import { ArrowRight, Play, Sparkles, Droplet, Truck, Leaf, Heart, ShieldCheck } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { getFeatured, getBestSellers } from "@/data/products";
import { SITE } from "@/config/site";
import heroImage from "@/assets/hero-editorial.jpg";
import tiktokStill from "@/assets/social-tiktok-1.jpg";
import igStill from "@/assets/social-ig-1.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

const metadata: Metadata = {
  title: "Glow & Go — Luxury Lip Gloss, Nairobi",
  description:
    "Cushioned, high-shine lip gloss handcrafted in Nairobi. Same-day delivery, purely for lips.",
};

const WHY_US = [
  { icon: Sparkles, title: "High-shine finish", copy: "Mirror-glass reflection that lasts through your day." },
  { icon: Droplet, title: "12hr hydration", copy: "Shea butter and vitamin E for cushioned comfort." },
  { icon: Heart, title: "Affordable luxury", copy: "Salon quality without the salon prices." },
  { icon: Truck, title: "Same-day Nairobi", copy: "Order by 2pm, receive by dinner." },
  { icon: Leaf, title: "Clean ingredients", copy: "Vegan, cruelty-free, formulated with care." },
  { icon: ShieldCheck, title: "1,200+ happy lips", copy: "Loved by women across Nairobi." },
];

const GALLERY = [g1, g2, g3, g4, tiktokStill, igStill];

export default function Page() {
  const featured = getFeatured();
  const bestSellers = getBestSellers();

  return (
    <>
      {/* Hero */}
      <section className="bg-soft-pink pb-14 pt-8 sm:pb-20 sm:pt-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-center lg:gap-16">
            <div className="max-w-[38ch] animate-fade-up">
              <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-blush/70 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-charcoal">
                <span className="size-1.5 rounded-full bg-rose-gold" />
                New shade drop
              </p>
              <h1 className="text-pretty font-serif text-[44px] leading-[1] text-charcoal sm:text-6xl md:text-7xl">
                The weightless <span className="italic">glow</span> of Nairobi mornings.
              </h1>
              <p className="mt-6 max-w-[36ch] text-pretty text-base text-zinc-600 sm:text-lg">
                Cushioned hydration for a dewy, high-shine finish that lasts.
                Never sticky, always effortless.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center gap-2 rounded-full bg-charcoal px-7 text-sm font-medium text-white transition hover:opacity-90"
                >
                  Shop the collection
                  <ArrowRight className="size-4" strokeWidth={1.5} />
                </Link>
                <a
                  href={SITE.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-white py-2 pl-2 pr-5 text-sm font-medium text-charcoal ring-1 ring-black/[0.06]"
                >
                  <span className="mr-3 grid size-8 place-items-center rounded-full bg-blush">
                    <Play className="size-3 fill-charcoal text-charcoal" />
                  </span>
                  Watch on TikTok
                </a>
              </div>
            </div>

            <div className="animate-fade-up overflow-hidden rounded-[min(6vw,32px)] bg-blush ring-1 ring-black/[0.04] lg:flex-1">
              <Image
                src={heroImage}
                alt="Editorial portrait of a woman with high-gloss lips in soft morning light"
                width={1200}
                height={1600}
                fetchPriority="high"
                className="aspect-[3/4] w-full object-cover sm:aspect-[16/10] lg:aspect-[4/5]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
                The Collection
              </p>
              <h2 className="max-w-[16ch] font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                Featured glosses
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:inline text-sm font-medium text-charcoal underline decoration-rose-gold underline-offset-8"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
          <div className="mt-10 sm:hidden">
            <Link
              href="/shop"
              className="block w-full rounded-full bg-charcoal py-4 text-center text-sm font-medium text-white"
            >
              View all glosses
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="bg-soft-pink py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <h2 className="mb-12 max-w-[20ch] font-serif text-3xl text-charcoal sm:text-5xl">
            Formulated for real lips, real days.
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_US.map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-3xl bg-white p-7 ring-1 ring-black/[0.04]"
              >
                <div className="mb-6 grid size-11 place-items-center rounded-full bg-blush text-charcoal">
                  <Icon className="size-5" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl text-charcoal">{title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-8 max-w-[16ch] font-serif text-4xl leading-tight text-charcoal sm:text-5xl">
                Loved by Nairobi's finest.
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <Image
                  src={tiktokStill}
                  alt="Customer applying Glow & Go lip gloss"
                  loading="lazy"
                  width={600}
                  height={1000}
                  className="aspect-[9/16] w-full rounded-3xl object-cover ring-1 ring-black/[0.04]"
                />
                <Image
                  src={igStill}
                  alt="Smiling customer wearing Glow & Go"
                  loading="lazy"
                  width={600}
                  height={1000}
                  className="mt-8 aspect-[9/16] w-full rounded-3xl object-cover ring-1 ring-black/[0.04]"
                />
              </div>
            </div>
            <div className="flex flex-col gap-6">
              <figure className="rounded-3xl bg-soft-pink p-8 ring-1 ring-black/[0.04]">
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="size-2.5 rounded-full bg-rose-gold" />
                  ))}
                </div>
                <blockquote className="text-pretty font-medium text-charcoal">
                  "Finally, a gloss that doesn't feel like a magnet for my hair. The
                  shine is incredible and it feels so nourishing."
                </blockquote>
                <figcaption className="mt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Sarah M. — Kilimani
                </figcaption>
              </figure>
              <figure className="rounded-3xl bg-zinc-50 p-8 ring-1 ring-black/[0.04]">
                <blockquote className="text-pretty font-medium text-charcoal">
                  "The delivery was so fast! I ordered at 10am and had it by lunch.
                  My new favourite staple."
                </blockquote>
                <figcaption className="mt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Amina K. — Westlands
                </figcaption>
              </figure>
              <figure className="rounded-3xl bg-blush/60 p-8 ring-1 ring-black/[0.04]">
                <blockquote className="text-pretty font-medium text-charcoal">
                  "Cocoa Glaze is the one — deep, comfortable, and it lasts all
                  the way through dinner."
                </blockquote>
                <figcaption className="mt-6 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Njeri W. — Lavington
                </figcaption>
              </figure>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers carousel */}
      <section className="bg-soft-pink py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
              Best sellers
            </h2>
            <Link
              href="/shop"
              className="text-sm font-medium text-charcoal underline decoration-rose-gold underline-offset-8"
            >
              View all
            </Link>
          </div>
          <div className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 no-scrollbar sm:mx-0 sm:px-0">
            {bestSellers.map((p) => (
              <div
                key={p.slug}
                className="w-[75%] shrink-0 snap-start sm:w-[300px]"
              >
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ordering timeline */}
      <section className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-14 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
              How it works
            </p>
            <h2 className="mx-auto max-w-[22ch] font-serif text-3xl text-charcoal sm:text-4xl">
              From your feed to your door, seamlessly.
            </h2>
          </div>
          <ol className="relative grid gap-10 sm:grid-cols-4 sm:gap-6">
            {[
              { n: "01", t: "Choose your gloss", d: "Explore shades and pick your favourite." },
              { n: "02", t: "Checkout securely", d: "M-Pesa or cash on delivery." },
              { n: "03", t: "We prepare your order", d: "Hand-packed in our Kilimani studio." },
              { n: "04", t: "Nairobi delivery", d: "Same or next-day rider dispatch." },
            ].map((s) => (
              <li key={s.n} className="flex flex-col items-center text-center">
                <div className="mb-5 grid size-12 place-items-center rounded-full bg-blush font-serif text-sm text-charcoal ring-1 ring-black/[0.04]">
                  {s.n}
                </div>
                <h4 className="font-serif text-xl text-charcoal">{s.t}</h4>
                <p className="mt-2 max-w-[24ch] text-sm text-zinc-500">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* IG Gallery */}
      <section className="bg-soft-pink py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-zinc-500">
                @glowandgo
              </p>
              <h2 className="font-serif text-3xl text-charcoal sm:text-4xl">
                From our Instagram
              </h2>
            </div>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-charcoal underline decoration-rose-gold underline-offset-8"
            >
              Follow
            </a>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {GALLERY.map((src, i) => (
              <a
                key={i}
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-2xl ring-1 ring-black/[0.04]"
              >
                <Image
                  src={src}
                  alt={`Glow & Go Instagram feed post ${i + 1}`}
                  loading="lazy"
                  className="aspect-square w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                />
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
