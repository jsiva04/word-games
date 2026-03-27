'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { StrandsBoard } from './StrandsBoard';
import { HelpModal } from './HelpModal';
import { StatsModal } from './StatsModal';
import { useStrands } from '@/hooks/useStrands';
import { useToast } from '@/hooks/useToast';

function HelpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

export function StrandsGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    puzzle,
    selectedPositions,
    justFound,
    foundPositions,
    showStats,
    showHelp,
    stats,
    startSelection,
    extendSelection,
    submitSelection,
    openStats,
    closeStats,
    openHelp,
    closeHelp,
  } = useStrands(showToast);

  const headerButtons = (
    <>
      <button className="icon-btn" onClick={openHelp} aria-label="How to play">
        <HelpIcon />
      </button>
      <button className="icon-btn" onClick={openStats} aria-label="Statistics">
        <StatsIcon />
      </button>
    </>
  );

  return (
    <>
      <Header title="Strands" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />

      <main className="view active">
        <div className="game">
          {state && (
            <StrandsBoard
              puzzle={puzzle}
              selectedPositions={selectedPositions}
              foundPositions={foundPositions}
              foundWords={state.foundWords}
              foundSpangram={state.foundSpangram}
              justFound={justFound}
              gameOver={state.gameOver}
              onStart={startSelection}
              onExtend={extendSelection}
              onSubmit={submitSelection}
            />
          )}
        </div>
      </main>

      <HelpModal open={showHelp} onClose={closeHelp} />
      <StatsModal open={showStats} onClose={closeStats} state={state} stats={stats} />
    </>
  );
}
