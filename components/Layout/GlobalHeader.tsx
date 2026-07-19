'use client';

import { usePathname } from 'next/navigation';
import MenuProvider from './Menu';
import { menuItems } from '@/lib/constants';
import type { SessionUser } from '@/types';


const NO_HEADER_ROUTES = ['/login', '/signup', '/forgot-password', '/verify-email', '/admin'];

export function GlobalHeader({ user }: { user: SessionUser | null }) {
    const pathname = usePathname();
    const shouldShowHeader = !NO_HEADER_ROUTES.some(route => pathname?.startsWith(route));

    if (!shouldShowHeader) return null;

    return (
        <>
            <MenuProvider menuItems={menuItems} user={user} />
            <div className="h-14" />
        </>
    );
}
