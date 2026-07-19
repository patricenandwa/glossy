"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { SITE } from "@/config/site";

type AuthShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  footer?: React.ReactNode;
  children: React.ReactNode;
};

export function AuthShell({
  eyebrow,
  title,
  description,
  footer,
  children,
}: AuthShellProps) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-soft-pink">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(230,181,189,0.35),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(244,213,189,0.4),transparent_30%)]"
      />
      <div className="relative mx-auto flex min-h-screen max-w-6xl items-center px-5 py-10 sm:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="hidden rounded-[32px] bg-charcoal px-10 py-12 text-white shadow-[0_30px_80px_rgba(45,45,45,0.14)] lg:block">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.png"
                alt={`${SITE.name} logo`}
                width={52}
                height={52}
                className="rounded-2xl bg-white/90 p-1"
              />
              <div>
                <p className="font-serif text-2xl tracking-tight">{SITE.name}</p>
                <p className="text-sm text-white/70">{SITE.tagline}</p>
              </div>
            </Link>

            <div className="mt-16 max-w-lg">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-rose-200">
                Nairobi gloss studio
              </p>
              <h1 className="mt-5 font-serif text-5xl leading-[0.98]">
                Sign in for faster orders, easy tracking, and a smoother admin flow.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-white/74">
                {SITE.description}
              </p>
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-3">
              <FeatureStat label="Delivery" value="Same-day" />
              <FeatureStat label="Origin" value="Made in Nairobi" />
              <FeatureStat label="Finish" value="High shine" />
            </div>
          </div>

          <Card className="border-0 bg-white/88 py-0 shadow-[0_24px_80px_rgba(45,45,45,0.10)] ring-1 ring-black/[0.05] backdrop-blur-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-3 lg:hidden">
                <Image
                  src="/logo.png"
                  alt={`${SITE.name} logo`}
                  width={44}
                  height={44}
                  className="rounded-2xl bg-white p-1 ring-1 ring-black/[0.06]"
                />
                <div>
                  <p className="font-serif text-xl text-charcoal">{SITE.name}</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">{SITE.tagline}</p>
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-medium uppercase tracking-[0.28em] text-zinc-500">
                  {eyebrow}
                </p>
                <h2 className="mt-3 font-serif text-4xl leading-tight text-charcoal">
                  {title}
                </h2>
                <p className="mt-3 max-w-md text-sm leading-6 text-zinc-600">
                  {description}
                </p>
              </div>

              {children}

              {footer ? <div className="mt-8 border-t border-black/[0.06] pt-5">{footer}</div> : null}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

function FeatureStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white/8 p-5 ring-1 ring-white/10 backdrop-blur-sm">
      <p className="text-xs uppercase tracking-[0.22em] text-white/55">{label}</p>
      <p className="mt-2 font-serif text-xl text-white">{value}</p>
    </div>
  );
}
