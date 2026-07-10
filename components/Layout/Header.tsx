"use client";

import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS, SITE } from "@/config/site";
import { useCart } from "@/stores/cart";
import Link from "next/link";

export function Header() {
  const [open, setOpen] = useState(false);
  const count = useCart((s: any) => s.itemCount());

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.04] bg-soft-pink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          <button
            className="-ml-1 grid size-9 place-items-center rounded-full text-charcoal lg:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-tight text-charcoal"
          >
            {SITE.name}
          </Link>
          <nav className="hidden lg:flex gap-7">
            {NAV_LINKS.slice(1).map((l) => (
              <Link
                key={l.to}
                href={l.to}
                className="text-sm font-medium text-zinc-600 transition-colors hover:text-charcoal"
                // activeProps={{ className: "text-charcoal" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="hidden sm:grid size-9 place-items-center rounded-full text-charcoal hover:bg-blush/60"
            aria-label="Search"
          >
            <Search className="size-4" strokeWidth={1.5} />
          </button>
          <button
            className="hidden sm:grid size-9 place-items-center rounded-full text-charcoal hover:bg-blush/60"
            aria-label="Account (coming soon)"
            title="Account — coming soon"
          >
            <User className="size-4" strokeWidth={1.5} />
          </button>
          <Link
            href="/cart"
            className="relative flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-charcoal ring-1 ring-black/[0.06] hover:bg-white"
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} />
            <span className="tabular-nums">{count}</span>
          </Link>
        </div>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm animate-fade-up"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[82%] max-w-sm bg-soft-pink p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl">{SITE.name}</span>
              <button
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-full"
                aria-label="Close menu"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl px-4 py-3 font-serif text-2xl text-charcoal hover:bg-blush/60"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8 border-t border-black/[0.06] pt-6 text-sm text-zinc-500">
              <p>{SITE.location}</p>
              <p className="mt-1">{SITE.hours}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
