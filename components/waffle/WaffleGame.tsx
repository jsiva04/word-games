'use client';

import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { WaffleBoard } from './WaffleBoard';
import { HelpModal } from './HelpModal';
import { StatsModal } from './StatsModal';
import { useWaffle } from '@/hooks/useWaffle';
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

export function WaffleGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    puzzle,
    colors,
    selectedCell,
    showStats,
    showHelp,
    stats,
    handleCellClick,
    handleShare,
    openStats,
    closeStats,
    openHelp,
    closeHelp,
    dayIndex,
  } = useWaffle(showToast);

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
      <Header title="Waffle" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />

      <main className="view active">
        <div className="game">
          {state && colors && (
            <>
              <p className="conn-instructions">
                <span>#{dayIndex}</span>
              </p>
              <WaffleBoard
                puzzle={puzzle}
                grid={state.grid}
                colors={colors}
                selectedCell={selectedCell}
                swapsUsed={state.swapsUsed}
                gameOver={state.gameOver}
                onCellClick={handleCellClick}
              />
            </>
          )}
        </div>
      </main>

      <HelpModal open={showHelp} onClose={closeHelp} />
      <StatsModal
        open={showStats}
        onClose={closeStats}
        state={state}
        stats={stats}
        onShare={handleShare}
      />
    </>
  );
}
