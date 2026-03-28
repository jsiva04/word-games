'use client';

import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { WaffleBoard } from '@/components/waffle/WaffleBoard';
import { HelpModal } from '@/components/waffle/HelpModal';
import { ArcadeResultModal } from './ArcadeResultModal';
import { useArcadeWaffle } from '@/hooks/useArcadeWaffle';
import { useToast } from '@/hooks/useToast';
import { MAX_SWAPS } from '@/data/waffle';

function HelpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

export function ArcadeWaffleGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    puzzle,
    puzzleIndex,
    colors,
    selectedCell,
    showResult,
    showHelp,
    handleCellClick,
    nextPuzzle,
    closeResult,
    openHelp,
    closeHelp,
  } = useArcadeWaffle(showToast);

  const resultContent = state?.gameOver ? (
    <div className="arcade-result-content">
      <p className="arcade-result-message">
        {state.won
          ? `Solved in ${state.swapsUsed} / ${MAX_SWAPS} swaps!`
          : 'Out of swaps!'}
      </p>
      {state.won && (
        <div className="waffle-stars" style={{ textAlign: 'center', margin: '8px 0' }}>
          {'⭐'.repeat(Math.max(1, MAX_SWAPS - state.swapsUsed + 1))}
        </div>
      )}
    </div>
  ) : null;

  const headerButtons = (
    <button className="icon-btn" onClick={openHelp} aria-label="How to play">
      <HelpIcon />
    </button>
  );

  return (
    <>
      <Header title="Waffle" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />
      <main className="view active">
        <div className="game">
          {state && colors && (
            <>
              <p className="conn-instructions"><span>Puzzle #{puzzleIndex}</span></p>
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
      <ArcadeResultModal open={showResult} onClose={closeResult} onNext={nextPuzzle}>
        {resultContent}
      </ArcadeResultModal>
    </>
  );
}
