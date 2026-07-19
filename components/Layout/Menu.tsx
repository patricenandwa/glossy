'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Header from './Header';
import HomeMenu from './HomeMenu';
import type { MenuItem } from '@/lib/constants';
import type { SessionUser } from '@/types';

export default function MenuProvider({
  menuItems,
  user,
}: {
  menuItems: MenuItem[];
  user: SessionUser | null;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const hasNewItem = menuItems.some((item) => item.isNew);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <Header
        onMenuClick={() => setOpen(true)}
        showNewMenuBadge={hasNewItem}
        user={user}
      />

      {mounted && createPortal(
        <HomeMenu
          open={open}
          onClose={() => setOpen(false)}
          menuItems={menuItems}
          user={user}
        />,
        document.body
      )}
    </>
  );
}
