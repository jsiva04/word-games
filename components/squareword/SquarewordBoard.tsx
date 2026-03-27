'use client';

import { TileState } from '@/lib/squareword';
import { SquarewordPuzzle } from '@/data/squareword';

interface SquarewordBoardProps {
  puzzle: SquarewordPuzzle;
  guesses: string[];
  currentGuess: string;
  wordSolved: boolean[];
  bestStates: TileState[][] | null;
  gameOver: boolean;
}

const STATE_COLORS: Record<TileState, string> = {
  correct: 'var(--tile-correct)',
  present: 'var(--tile-present)',
  absent: 'var(--tile-absent)',
  empty: 'transparent',
};

export function SquarewordBoard({
  puzzle,
  guesses,
  currentGuess,
  wordSolved,
  bestStates,
  gameOver,
}: SquarewordBoardProps) {
  return (
    <div className="sq-board">
      {puzzle.words.map((word, wordIdx) => {
        const solved = wordSolved[wordIdx];
        const states = bestStates?.[wordIdx] ?? Array(5).fill('empty');

        return (
          <div key={wordIdx} className={`sq-word-row${solved ? ' solved' : ''}`}>
            <div className="sq-word-number">{wordIdx + 1}</div>
            <div className="sq-tiles">
              {Array.from({ length: 5 }, (_, i) => {
                const state = states[i];
                const isCurrentInput = !solved && !gameOver;
                const letter =
                  solved
                    ? word[i].toUpperCase()
                    : state === 'correct'
                    ? word[i].toUpperCase()
                    : '';

                const style =
                  state !== 'empty'
                    ? { background: STATE_COLORS[state as TileState], borderColor: 'transparent', color: '#fff' }
                    : {};

                return (
                  <div key={i} className="sq-tile" style={style}>
                    {letter}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Current guess input row */}
      <div className="sq-input-row">
        <div className="sq-input-label">Guess</div>
        <div className="sq-tiles">
          {Array.from({ length: 5 }, (_, i) => {
            const letter = currentGuess[i] || '';
            return (
              <div key={i} className={`sq-tile sq-input-tile${letter ? ' filled' : ''}`}>
                {letter}
              </div>
            );
          })}
        </div>
      </div>

      {/* Guess counter */}
      <div className="sq-guess-counter">
        {guesses.length} / 9 guesses used
      </div>
    </div>
  );
}
