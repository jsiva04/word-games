'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { Board } from '@/components/wordle/Board';
import { Keyboard } from '@/components/wordle/Keyboard';
import { HelpModal } from '@/components/wordle/HelpModal';
import { ArcadeResultModal } from './ArcadeResultModal';
import { useArcadeWordle } from '@/hooks/useArcadeWordle';
import { useToast } from '@/hooks/useToast';
import { evaluateGuess } from '@/lib/wordle';

function HelpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

export function ArcadeWordleGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    puzzleIndex,
    keyStates,
    shakingRow,
    revealingRow,
    bouncingRow,
    showResult,
    showHelp,
    handleKey,
    nextPuzzle,
    closeResult,
    openHelp,
    closeHelp,
  } = useArcadeWordle(showToast);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      handleKey(e.key);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleKey]);

  const resultContent = state?.gameOver ? (
    <div className="arcade-result-content">
      <p className="arcade-result-message">
        {state.won
          ? `Solved in ${state.guesses.length} / 6 guesses!`
          : `The word was: ${state.word.toUpperCase()}`}
      </p>
      <div className="arcade-emoji-grid">
        {state.guesses.map((guess, i) => (
          <div key={i} className="arcade-emoji-row">
            {evaluateGuess(guess, state.word).map((item, j) => (
              <span key={j}>
                {item.state === 'correct' ? '🟩' : item.state === 'present' ? '🟨' : '⬛'}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  ) : null;

  const headerButtons = (
    <button className="icon-btn" onClick={openHelp} aria-label="How to play">
      <HelpIcon />
    </button>
  );

  return (
    <>
      <Header title="Wordle" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />
      <main className="view active">
        <div className="game">
          {state && (
            <>
              <p className="conn-instructions"><span>Puzzle #{puzzleIndex}</span></p>
              <Board
                word={state.word}
                guesses={state.guesses}
                currentGuess={state.currentGuess}
                shakingRow={shakingRow}
                revealingRow={revealingRow}
                bouncingRow={bouncingRow}
              />
              <Keyboard keyStates={keyStates} onKey={handleKey} />
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
