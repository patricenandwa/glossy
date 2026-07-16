"use client";

import { useCart } from "@/stores/cart";
import { formatKsh } from "@/lib/format";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function MobileCartBar() {
  const hasHydrated = useCart((s: any) => s.hasHydrated);
  const count = useCart((s: any) => s.itemCount());
  const subtotal = useCart((s: any) => s.subtotal());
  const pathname = usePathname();

  if (!hasHydrated) return null;
  if (count === 0) return null;
  if (pathname === "/cart" || pathname === "/checkout") return null;
  if (pathname.startsWith("/order-confirmed")) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-black/[0.04] bg-white/85 p-3 backdrop-blur-md sm:hidden">
      <Link
        href="/cart"
        className="flex w-full items-center justify-between rounded-full bg-charcoal px-5 py-3 text-white"
      >
        <span className="text-sm font-medium">
          Review bag <span className="text-white/70">({count})</span>
        </span>
        <span className="text-sm font-semibold tabular-nums">
          {formatKsh(subtotal)}
        </span>
      </Link>
    </div>
  );
}
