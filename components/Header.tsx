'use client';

import { useState } from 'react';
import { NavDrawer } from './NavDrawer';

interface HeaderProps {
  title: string;
  rightButtons?: React.ReactNode;
}

export function Header({ title, rightButtons }: HeaderProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header>
      <div className="header-left">
        <NavDrawer
          open={drawerOpen}
          onOpen={() => setDrawerOpen(true)}
          onClose={() => setDrawerOpen(false)}
        />
      </div>
      <div className="header-title">{title}</div>
      <div className="header-right">
        {rightButtons}
      </div>
    </header>
  );
}
