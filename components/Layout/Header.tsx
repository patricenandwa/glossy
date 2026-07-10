"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { menuItems } from "@/lib/constants";
import { useCart, type CartState } from "@/stores/cart";
import Link from "next/link";
import { SITE as siteConfig } from "@/config/site";

interface HeaderProps {
  onMenuClick?: () => void;
  showNewMenuBadge?: boolean;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const count = useCart((s: CartState) => s.itemCount());

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.04] bg-soft-pink/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-8">
          {/* Hamburger Trigger button */}
          <button
            className="-ml-1 grid size-9 place-items-center rounded-full text-charcoal lg:hidden hover:bg-blush/40 transition-colors"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="size-5" strokeWidth={1.5} />
          </button>
          
          <Link
            href="/"
            className="font-serif text-xl font-medium tracking-tight text-charcoal"
          >
            {siteConfig.name}
          </Link>

          {/* Desktop Navigation Link Cluster */}
          <nav className="hidden lg:flex gap-7">
            {menuItems.map((l) => {
              const isActive = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActive ? "text-charcoal font-semibold" : "text-zinc-600 hover:text-charcoal"
                  }`}
                >
                  {l.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Action Items Bar */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            className="hidden sm:grid size-9 place-items-center rounded-full text-charcoal hover:bg-blush/60 transition-colors"
            aria-label="Search"
          >
            <Search className="size-4" strokeWidth={1.5} />
          </button>
          <button
            className="hidden sm:grid size-9 place-items-center rounded-full text-charcoal hover:bg-blush/60 transition-colors"
            aria-label="Account (coming soon)"
            title="Account — coming soon"
          >
            <User className="size-4" strokeWidth={1.5} />
          </button>
          <Link
            href="/cart"
            className="relative flex h-9 items-center gap-2 rounded-full px-3 text-sm font-medium text-charcoal ring-1 ring-black/[0.06] hover:bg-white transition-all duration-200"
          >
            <ShoppingBag className="size-4" strokeWidth={1.5} />
            <span className="tabular-nums">{count}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
