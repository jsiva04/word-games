'use client';

import { CellColor } from '@/lib/waffle';
import { WafflePuzzle, isWaffleCell, MAX_SWAPS } from '@/data/waffle';

interface WaffleBoardProps {
  puzzle: WafflePuzzle;
  grid: string[][];
  colors: CellColor[][];
  selectedCell: [number, number] | null;
  swapsUsed: number;
  gameOver: boolean;
  onCellClick: (row: number, col: number) => void;
}

const COLOR_CLASS: Record<CellColor, string> = {
  green: 'waffle-green',
  yellow: 'waffle-yellow',
  white: 'waffle-white',
};

export function WaffleBoard({
  puzzle,
  grid,
  colors,
  selectedCell,
  swapsUsed,
  gameOver,
  onCellClick,
}: WaffleBoardProps) {
  const swapsRemaining = MAX_SWAPS - swapsUsed;

  return (
    <div className="waffle-wrapper">
      <div className="waffle-grid">
        {Array.from({ length: 5 }, (_, row) => (
          <div key={row} className="waffle-row">
            {Array.from({ length: 5 }, (_, col) => {
              if (!isWaffleCell(row, col)) {
                return <div key={col} className="waffle-cell waffle-empty" />;
              }

              const letter = grid[row][col];
              const color = colors[row][col];
              const isSelected =
                selectedCell !== null &&
                selectedCell[0] === row &&
                selectedCell[1] === col;
              const isGreen = color === 'green';

              return (
                <button
                  key={col}
                  className={`waffle-cell waffle-letter ${COLOR_CLASS[color]}${isSelected ? ' waffle-selected' : ''}${isGreen ? ' waffle-locked' : ''}`}
                  onClick={() => onCellClick(row, col)}
                  disabled={gameOver || isGreen}
                  aria-label={`${letter} at row ${row + 1}, column ${col + 1}`}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <div className="waffle-swaps">
        <span className="waffle-swaps-label">Swaps remaining:</span>
        <div className="waffle-swaps-dots">
          {Array.from({ length: MAX_SWAPS }, (_, i) => (
            <div
              key={i}
              className={`waffle-swap-dot${i >= swapsRemaining ? ' used' : ''}`}
            />
          ))}
        </div>
        <span className="waffle-swaps-count">{swapsRemaining}</span>
      </div>
    </div>
  );
}
