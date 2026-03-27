import { evaluateGuess, FLIP_DELAY, FLIP_DURATION, MAX_GUESSES, WORD_LENGTH } from '@/lib/wordle';
import { Tile } from './Tile';

interface BoardProps {
  word: string;
  guesses: string[];
  currentGuess: string;
  shakingRow: number | null;
  revealingRow: number | null;
  bouncingRow: number | null;
}

export function Board({ word, guesses, currentGuess, shakingRow, revealingRow, bouncingRow }: BoardProps) {
  return (
    <div className="board-container">
      <div className="board" role="grid" aria-label="Wordle game board">
        {Array.from({ length: MAX_GUESSES }, (_, r) => {
          const guess = guesses[r];
          const isCurrentRow = r === guesses.length;
          const isRevealing = revealingRow === r;
          const isBouncing = bouncingRow === r;
          const isShaking = shakingRow === r;

          return (
            <div
              key={r}
              className={`board-row${isShaking ? ' shake' : ''}`}
              id={`row-${r}`}
            >
              {Array.from({ length: WORD_LENGTH }, (_, c) => {
                if (guess) {
                  // Submitted guess row
                  const evaluation = evaluateGuess(guess, word);
                  const tileState = isRevealing ? 'tbd' : evaluation[c].state;
                  return (
                    <Tile
                      key={c}
                      letter={guess[c]}
                      state={tileState}
                      animationDelay={isRevealing ? c * FLIP_DELAY : isBouncing ? c * 100 : undefined}
                      animationDuration={isRevealing ? FLIP_DURATION : undefined}
                      bounce={isBouncing}
                    />
                  );
                } else if (isCurrentRow) {
                  // Current input row
                  const letter = currentGuess[c];
                  return (
                    <Tile
                      key={c}
                      letter={letter}
                      state={letter ? 'tbd' : 'empty'}
                    />
                  );
                } else {
                  // Empty row
                  return <Tile key={c} state="empty" />;
                }
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
