'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { MenuItem } from '@/lib/constants';
import { SITE as siteConfig } from '@/config/site';
import { LayoutDashboard, LogIn, X } from 'lucide-react';
import type { SessionUser } from '@/types';

interface HomeMenuProps {
  open: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
  user: SessionUser | null;
}

export default function HomeMenu({ open, onClose, menuItems, user }: HomeMenuProps) {
  const pathname = usePathname();
  const isAdmin = user?.role === 'admin';
  const adminHref = isAdmin ? '/admin' : '/login?redirect=/admin';
  const adminLabel = isAdmin ? 'Open admin' : 'Login';

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[100] lg:hidden"
          aria-hidden={!open}
        >
          {/* Full-Screen Dimmed Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Hardware-Accelerated Sliding Navigation Container */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute left-0 top-0 h-full w-[85%] max-w-sm border-r border-black/5 bg-white p-6 shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-xl font-medium text-charcoal">{siteConfig.name}</span>
              <button
                onClick={onClose}
                className="grid size-9 place-items-center rounded-full text-charcoal hover:bg-blush/60 transition-colors"
                aria-label="Close menu"
              >
                <X className="size-5" strokeWidth={1.5} />
              </button>
            </div>

            {/* Links cluster inside mobile view */}
            <nav className="mt-10 flex flex-col gap-1.5">
              {menuItems.map((l) => {
                const isActive = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={onClose}
                    className={`rounded-2xl px-4 py-3 font-serif text-2xl transition-all duration-200 ${isActive
                        ? "bg-blush/40 text-charcoal font-medium pl-6"
                        : "text-charcoal/80 hover:bg-blush/40 hover:text-charcoal"
                      }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>

            <Link
              href={adminHref}
              onClick={onClose}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-charcoal px-5 py-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              {isAdmin ? <LayoutDashboard className="size-4" strokeWidth={1.5} /> : <LogIn className="size-4" strokeWidth={1.5} />}
              <span>{adminLabel}</span>
            </Link>

            {/* Footer contextual specifications inside drawer */}
            <div className="mt-8 border-t border-black/[0.06] pt-6 text-sm text-zinc-500">
              <p className="font-medium text-zinc-700">{siteConfig.location}</p>
              <p className="mt-1">{siteConfig.hours}</p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
