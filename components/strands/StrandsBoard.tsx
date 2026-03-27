'use client';

import { useRef, useCallback } from 'react';
import { posKey } from '@/lib/strands';
import { StrandsPuzzle } from '@/data/strands';

interface StrandsBoardProps {
  puzzle: StrandsPuzzle;
  selectedPositions: [number, number][];
  foundPositions: Set<string>;
  foundWords: string[];
  foundSpangram: boolean;
  justFound: { word: string; type: 'theme' | 'spangram' } | null;
  gameOver: boolean;
  onStart: (row: number, col: number) => void;
  onExtend: (row: number, col: number) => void;
  onSubmit: () => void;
}

export function StrandsBoard({
  puzzle,
  selectedPositions,
  foundPositions,
  foundWords,
  foundSpangram,
  justFound,
  gameOver,
  onStart,
  onExtend,
  onSubmit,
}: StrandsBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const isPointerDown = useRef(false);

  const getSelectedWord = () =>
    selectedPositions.map(([r, c]) => puzzle.grid[r][c]).join('');

  const getCellState = (row: number, col: number): string => {
    const key = posKey(row, col);
    const letter = puzzle.grid[row][col];

    if (foundPositions.has(key)) {
      // Is it the spangram?
      const isSpangramPos = puzzle.spangram.positions.some(([r, c]) => r === row && c === col);
      if (isSpangramPos && foundSpangram) return 'spangram';
      return 'found';
    }

    const isSelected = selectedPositions.some(([r, c]) => r === row && c === col);
    if (isSelected) return 'selected';

    return 'empty';
  };

  const handlePointerDown = useCallback(
    (e: React.PointerEvent, row: number, col: number) => {
      if (gameOver) return;
      e.preventDefault();
      isPointerDown.current = true;
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      onStart(row, col);
    },
    [gameOver, onStart]
  );

  const handlePointerEnter = useCallback(
    (row: number, col: number) => {
      if (!isPointerDown.current || gameOver) return;
      onExtend(row, col);
    },
    [gameOver, onExtend]
  );

  const handlePointerUp = useCallback(() => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="strands-wrapper">
      {/* Theme display */}
      <div className="strands-theme">
        <span className="strands-theme-label">Theme</span>
        <span className="strands-theme-text">{puzzle.theme}</span>
      </div>

      {/* Found words */}
      <div className="strands-found-words">
        {puzzle.themeWords.map((tw) => (
          <span
            key={tw.word}
            className={`strands-found-badge${foundWords.includes(tw.word) ? ' found' : ''}`}
          >
            {foundWords.includes(tw.word) ? tw.word : '?????'}
          </span>
        ))}
        <span className={`strands-found-badge spangram${foundSpangram ? ' found' : ''}`}>
          {foundSpangram ? puzzle.spangram.word : '✦ Spangram'}
        </span>
      </div>

      {/* Grid */}
      <div
        ref={boardRef}
        className="strands-grid"
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'none' }}
      >
        {puzzle.grid.map((row, rIdx) => (
          <div key={rIdx} className="strands-row">
            {row.map((letter, cIdx) => {
              const cellState = getCellState(rIdx, cIdx);
              const isLast =
                selectedPositions.length > 0 &&
                selectedPositions[selectedPositions.length - 1][0] === rIdx &&
                selectedPositions[selectedPositions.length - 1][1] === cIdx;
              return (
                <div
                  key={cIdx}
                  className={`strands-cell${cellState ? ` ${cellState}` : ''}${isLast ? ' last' : ''}`}
                  onPointerDown={(e) => handlePointerDown(e, rIdx, cIdx)}
                  onPointerEnter={() => handlePointerEnter(rIdx, cIdx)}
                >
                  {letter}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Selection feedback */}
      <div className="strands-selection">
        {selectedPositions.length > 0 && (
          <span className="strands-selection-word">{getSelectedWord()}</span>
        )}
      </div>

      {/* Just-found animation */}
      {justFound && (
        <div className={`strands-just-found${justFound.type === 'spangram' ? ' spangram' : ''}`}>
          {justFound.type === 'spangram' ? '✦ ' : ''}{justFound.word}
        </div>
      )}
    </div>
  );
}
