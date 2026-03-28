'use client';

import { useEffect } from 'react';
import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { Keyboard } from '@/components/wordle/Keyboard';
import { SquarewordBoard } from '@/components/squareword/SquarewordBoard';
import { HelpModal } from '@/components/squareword/HelpModal';
import { GuessesModal } from '@/components/squareword/GuessesModal';
import { ArcadeResultModal } from './ArcadeResultModal';
import { useArcadeSquareword } from '@/hooks/useArcadeSquareword';
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

export function ArcadeSquarewordGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    puzzleIndex,
    wordSolved,
    bestStates,
    presentLetters,
    keyStates,
    showResult,
    showHelp,
    showGuesses,
    handleKey,
    nextPuzzle,
    closeResult,
    openHelp,
    closeHelp,
    openGuesses,
    closeGuesses,
  } = useArcadeSquareword(showToast);

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
          ? `Solved in ${state.guesses.length} guess${state.guesses.length === 1 ? '' : 'es'}!`
          : 'Game over!'}
      </p>
    </div>
  ) : null;

  const headerButtons = (
    <button className="icon-btn" onClick={openHelp} aria-label="How to play">
      <HelpIcon />
    </button>
  );

  return (
    <>
      <Header title="Squareword" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />
      <main className="view active">
        <div className="game">
          {state && (
            <>
              <p className="conn-instructions"><span>Puzzle #{puzzleIndex}</span></p>
              <SquarewordBoard
                puzzle={state.puzzle}
                guesses={state.guesses}
                currentGuess={state.currentGuess}
                wordSolved={wordSolved}
                bestStates={bestStates}
                presentLetters={presentLetters}
                onViewGuesses={openGuesses}
              />
              <Keyboard keyStates={keyStates} onKey={handleKey} />
            </>
          )}
        </div>
      </main>
      <HelpModal open={showHelp} onClose={closeHelp} />
      <GuessesModal open={showGuesses} onClose={closeGuesses} guesses={state?.guesses ?? []} />
      <ArcadeResultModal open={showResult} onClose={closeResult} onNext={nextPuzzle}>
        {resultContent}
      </ArcadeResultModal>
    </>
  );
}
