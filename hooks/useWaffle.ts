'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDailyPuzzle,
  getDefaultState,
  loadState,
  saveState,
  recordResult,
  computeColors,
  isGridSolved,
  loadStats,
  getTodayIndex,
  buildShareText,
  copyToClipboard,
  MAX_SWAPS,
  WaffleState,
  WaffleStats,
} from '@/lib/waffle';
import { isWaffleCell } from '@/data/waffle';

export function useWaffle(showToast: (msg: string, duration?: number) => void) {
  const [state, setState] = useState<WaffleState | null>(null);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const puzzle = getDailyPuzzle();

  useEffect(() => {
    const saved = loadState();
    const initial = saved ?? getDefaultState(puzzle);
    if (!saved) saveState(initial);
    setState(initial);

    if (initial.gameOver) {
      setTimeout(() => setShowStats(true), 500);
    }
  }, []);

  const handleCellClick = useCallback(
    (row: number, col: number) => {
      if (!state || state.gameOver) return;
      if (!isWaffleCell(row, col)) return;

      const colors = computeColors(state.grid, puzzle);
      if (colors[row][col] === 'green') return; // Can't select green cells

      if (!selectedCell) {
        setSelectedCell([row, col]);
        return;
      }

      const [selRow, selCol] = selectedCell;

      // Clicking same cell deselects
      if (selRow === row && selCol === col) {
        setSelectedCell(null);
        return;
      }

      // Perform swap
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

      saveState(newState);
      setState(newState);
      setSelectedCell(null);

      if (solved) {
        recordResult(true, newSwaps);
        setTimeout(() => {
          showToast('Solved!', 2000);
          setTimeout(() => setShowStats(true), 1000);
        }, 300);
      } else if (outOfSwaps) {
        recordResult(false, newSwaps);
        setTimeout(() => {
          showToast('Out of swaps!', 3000);
          setTimeout(() => setShowStats(true), 2000);
        }, 300);
      }
    },
    [state, selectedCell, puzzle, showToast]
  );

  const handleShare = useCallback(async () => {
    if (!state) return;
    const text = buildShareText(puzzle, state.swapsUsed, state.won);
    try {
      await copyToClipboard(text);
      showToast('Copied to clipboard!');
    } catch {
      showToast('Could not copy');
    }
  }, [state, puzzle, showToast]);

  const colors = state ? computeColors(state.grid, puzzle) : null;
  const stats: WaffleStats = loadStats();

  return {
    state,
    puzzle,
    colors,
    selectedCell,
    showStats,
    showHelp,
    stats,
    handleCellClick,
    handleShare,
    openStats: () => setShowStats(true),
    closeStats: () => setShowStats(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
    dayIndex: getTodayIndex(),
  };
}
