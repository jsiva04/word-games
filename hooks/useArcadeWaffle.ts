'use client';

import { useState, useCallback, useEffect } from 'react';
import { computeColors, isGridSolved, MAX_SWAPS, WaffleState } from '@/lib/waffle';
import { isWaffleCell, WAFFLE_PUZZLES, WafflePuzzle } from '@/data/waffle';

function puzzleForIndex(idx: number): WafflePuzzle {
  return WAFFLE_PUZZLES[idx % WAFFLE_PUZZLES.length];
}

// Generate a deterministic scramble for any puzzle index as seed
function generateScrambledForSeed(puzzle: WafflePuzzle, seed: number): string[][] {
  const cells: [number, number][] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (isWaffleCell(r, c) && puzzle.solution[r][c] !== ' ') cells.push([r, c]);
    }
  }

  const letters = cells.map(([r, c]) => puzzle.solution[r][c]);
  const shuffled = [...letters];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (seed * 1337 + i * 31 + i * i * 7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const grid: string[][] = Array.from({ length: 5 }, () => Array(5).fill(' '));
  cells.forEach(([r, c], i) => { grid[r][c] = shuffled[i]; });

  const allGreen = cells.every(([r, c]) => grid[r][c] === puzzle.solution[r][c]);
  if (allGreen && cells.length >= 2) {
    [grid[cells[0][0]][cells[0][1]], grid[cells[1][0]][cells[1][1]]] = [
      grid[cells[1][0]][cells[1][1]],
      grid[cells[0][0]][cells[0][1]],
    ];
  }

  return grid;
}

export function useArcadeWaffle(showToast: (msg: string, duration?: number) => void) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [puzzle, setPuzzle] = useState<WafflePuzzle>(WAFFLE_PUZZLES[0]);
  const [state, setState] = useState<WaffleState | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * WAFFLE_PUZZLES.length);
    const p = puzzleForIndex(startIdx);
    setPuzzleIndex(startIdx);
    setPuzzle(p);
    setState({
      dayIndex: startIdx,
      grid: generateScrambledForSeed(p, startIdx),
      swapsUsed: 0,
      gameOver: false,
      won: false,
    });
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!state || state.gameOver) return;
      if (!isWaffleCell(row, col)) return;

      const colors = computeColors(state.grid, puzzle);
      if (colors[row][col] === 'green') return;

      if (!selectedCell) {
        setSelectedCell([row, col]);
        return;
      }

      const [selRow, selCol] = selectedCell;
      if (selRow === row && selCol === col) {
        setSelectedCell(null);
        return;
      }

      const newGrid = state.grid.map((r) => [...r]);
      const tmp = newGrid[selRow][selCol];
      newGrid[selRow][selCol] = newGrid[row][col];
      newGrid[row][col] = tmp;

      const newSwaps = state.swapsUsed + 1;
      const solved = isGridSolved(newGrid, puzzle);
      const outOfSwaps = !solved && newSwaps >= MAX_SWAPS;
      const gameOver = solved || outOfSwaps;

      const newState: WaffleState = {
        ...state,
        grid: newGrid,
        swapsUsed: newSwaps,
        gameOver,
        won: solved,
      };

      setState(newState);
      setSelectedCell(null);

      if (solved) {
        setTimeout(() => {
          showToast('Solved!', 2000);
          setTimeout(() => setShowResult(true), 1000);
        }, 300);
      } else if (outOfSwaps) {
        setTimeout(() => {
          showToast('Out of swaps!', 3000);
          setTimeout(() => setShowResult(true), 2000);
        }, 300);
      }
    },
    [state, selectedCell, puzzle, showToast]
  );

  const nextPuzzle = useCallback(() => {
    const nextIdx = puzzleIndex + 1;
    const nextP = puzzleForIndex(nextIdx);
    setPuzzleIndex(nextIdx);
    setPuzzle(nextP);
    setState({
      dayIndex: nextIdx,
      grid: generateScrambledForSeed(nextP, nextIdx),
      swapsUsed: 0,
      gameOver: false,
      won: false,
    });
    setSelectedCell(null);
    setShowResult(false);
  }, [puzzleIndex]);

  const colors = state ? computeColors(state.grid, puzzle) : null;

  return {
    state,
    puzzle,
    puzzleIndex,
    colors,
    selectedCell,
    showResult,
    showHelp,
    handleCellClick,
    nextPuzzle,
    openResult: () => setShowResult(true),
    closeResult: () => setShowResult(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
  };
}
