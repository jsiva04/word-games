'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { Keyboard } from '@/components/wordle/Keyboard';
import { SquarewordBoard } from './SquarewordBoard';
import { HelpModal } from './HelpModal';
import { StatsModal } from './StatsModal';
import { useSquareword } from '@/hooks/useSquareword';
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

export function SquarewordGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    wordSolved,
    bestStates,
    keyStates,
    showStats,
    showHelp,
    stats,
    handleKey,
    handleShare,
    openStats,
    closeStats,
    openHelp,
    closeHelp,
    dayIndex,
  } = useSquareword(showToast);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

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
      <Header title="Squareword" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />

      <main className="view active">
        <div className="game">
          {state && (
            <>
              <p className="conn-instructions">
                Solve 5 words &mdash; <span>#{dayIndex}</span>
              </p>
              <SquarewordBoard
                puzzle={state.puzzle}
                guesses={state.guesses}
                currentGuess={state.currentGuess}
                wordSolved={wordSolved}
                bestStates={bestStates}
                gameOver={state.gameOver}
              />
              <Keyboard keyStates={keyStates} onKey={handleKey} />
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
