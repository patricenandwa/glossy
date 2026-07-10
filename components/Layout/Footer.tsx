"use client";

import { SITE } from "@/config/site";
import Link from "next/link";

const POLICY_LINKS = [
  { to: "/about", label: "About" },
  { to: "/faqs", label: "FAQs" },
  { to: "/contact", label: "Contact" },
  { to: "/track", label: "Track Order" },
];

const LEGAL_LINKS = [
  { to: "/shipping-policy", label: "Shipping" },
  { to: "/refund-policy", label: "Refunds" },
  { to: "/privacy-policy", label: "Privacy" },
  { to: "/terms", label: "Terms" },
];

export function Footer() {
  return (
    <footer className="bg-charcoal pt-20 pb-40 text-white sm:pb-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-14 sm:grid-cols-2">
          <div>
            <h3 className="mb-4 font-serif text-3xl text-white">Stay Glowing</h3>
            <p className="mb-6 max-w-[36ch] text-white/60">
              Early access to new shade drops, delivery updates, and quiet Nairobi
              beauty events.
            </p>
            <form
              className="flex max-w-sm gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.currentTarget.elements.namedItem(
                  "email",
                ) as HTMLInputElement;
                if (input?.value) input.value = "";
              }}
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Your email"
                className="h-12 flex-1 rounded-full bg-white/[0.06] px-6 text-sm text-white placeholder:text-white/40 outline-none ring-1 ring-white/10 focus:ring-rose-gold"
              />
              <button
                type="submit"
                className="h-12 rounded-full bg-white px-6 text-sm font-medium text-charcoal transition hover:bg-blush"
              >
                Join
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:justify-self-end">
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                Company
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                {POLICY_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link href={l.to} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
                Policies
              </h4>
              <ul className="space-y-3 text-sm text-white/70">
                {LEGAL_LINKS.map((l) => (
                  <li key={l.to}>
                    <Link href={l.to} className="hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-6 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} {SITE.name} Nairobi. {SITE.tagline}
          </p>
          <div className="flex gap-6 text-sm">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white"
            >
              Instagram
            </a>
            <a
              href={SITE.tiktok}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white"
            >
              TikTok
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-white"
            >
              WhatsApp
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="text-white/60 hover:text-white"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
