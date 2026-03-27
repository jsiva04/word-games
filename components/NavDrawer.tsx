'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GAMES = [
  { id: 'wordle', name: 'Wordle', href: '/wordle' },
  { id: 'connections', name: 'Connections', href: '/connections' },
];

function WordleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      {[[0,0],[7,0],[14,0],[0,7],[7,7],[14,7],[0,14],[7,14],[14,14]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="5" height="5" rx="1" />
      ))}
    </svg>
  );
}

function ConnectionsIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
      {[[0,0],[9,0],[0,9],[9,9]].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="8" height="8" rx="2" />
      ))}
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="22" height="22">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

interface NavDrawerProps {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export function NavDrawer({ open, onOpen, onClose }: NavDrawerProps) {
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current - e.changedTouches[0].clientX > 60) onClose();
  }

  const icons: Record<string, React.ReactNode> = {
    wordle: <WordleIcon />,
    connections: <ConnectionsIcon />,
  };

  return (
    <>
      <button className="icon-btn" onClick={onOpen} aria-label="Open menu">
        <HamburgerIcon />
      </button>

      <div
        className={`nav-overlay${open ? ' open' : ''}`}
        onClick={handleOverlayClick}
      >
        <div
          className="nav-drawer"
          ref={drawerRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="nav-drawer-header">
            <span className="nav-drawer-title">Games</span>
            <button className="nav-close icon-btn" onClick={onClose} aria-label="Close menu">
              <CloseIcon />
            </button>
          </div>
          <nav className="nav-list">
            {GAMES.map((game) => {
              const isActive = pathname === game.href || pathname === '/' && game.id === 'wordle';
              return (
                <Link
                  key={game.id}
                  href={game.href}
                  className={`nav-item${isActive ? ' nav-item--active' : ''}`}
                  onClick={onClose}
                >
                  <span className="nav-item-icon">{icons[game.id]}</span>
                  <span className="nav-item-name">{game.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
