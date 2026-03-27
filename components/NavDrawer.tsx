'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GAMES = [
  { id: 'wordle', name: 'Wordle', href: '/wordle' },
  { id: 'connections', name: 'Connections', href: '/connections' },
  { id: 'strands', name: 'Strands', href: '/strands' },
  { id: 'squareword', name: 'Squareword', href: '/squareword' },
  { id: 'waffle', name: 'Waffle', href: '/waffle' },
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

  function StrandsIcon() {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
        {[[0,0],[4,0],[8,0],[12,0],[16,0],[2,4],[6,4],[10,4],[14,4],[4,8],[8,8],[12,8],[6,12],[10,12],[8,16]].map(([x, y], i) => (
          <circle key={i} cx={x + 2} cy={y + 2} r="2" />
        ))}
      </svg>
    );
  }

  function SquarewordIcon() {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
        {[[0,0],[6,0],[12,0],[0,6],[6,6],[12,6],[0,12],[6,12],[12,12]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="5" height="5" rx="1" />
        ))}
      </svg>
    );
  }

  function WaffleIcon() {
    return (
      <svg viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
        {/* Waffle pattern: rows 0,2,4 full; rows 1,3 only cols 0,2,4 */}
        {[[0,0],[4,0],[8,0],[12,0],[16,0],
          [0,4],[8,4],[16,4],
          [0,8],[4,8],[8,8],[12,8],[16,8],
          [0,12],[8,12],[16,12],
          [0,16],[4,16],[8,16],[12,16],[16,16]
        ].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="3" height="3" rx="0.5" />
        ))}
      </svg>
    );
  }

  const icons: Record<string, React.ReactNode> = {
    wordle: <WordleIcon />,
    connections: <ConnectionsIcon />,
    strands: <StrandsIcon />,
    squareword: <SquarewordIcon />,
    waffle: <WaffleIcon />,
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
