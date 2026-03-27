'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getDailyPuzzle,
  getDefaultState,
  loadState,
  saveState,
  recordResult,
  isAdjacent,
  posKey,
  checkFoundWord,
  getFoundPositions,
  loadStats,
  getTodayIndex,
  StrandsState,
  StrandsStats,
} from '@/lib/strands';

export function useStrands(showToast: (msg: string, duration?: number) => void) {
  const [state, setState] = useState<StrandsState | null>(null);
  const [selectedPositions, setSelectedPositions] = useState<[number, number][]>([]);
  const [justFound, setJustFound] = useState<{ word: string; type: 'theme' | 'spangram' } | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const isDragging = useRef(false);

  const puzzle = getDailyPuzzle();

  useEffect(() => {
    const saved = loadState();
    const initial = saved ?? getDefaultState();
    if (!saved) saveState(initial);
    setState(initial);

    if (initial.gameOver) {
      setTimeout(() => setShowStats(true), 500);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPositions([]);
  }, []);

  const startSelection = useCallback((row: number, col: number) => {
    isDragging.current = true;
    setSelectedPositions([[row, col]]);
  }, []);

  const extendSelection = useCallback(
    (row: number, col: number) => {
      if (!isDragging.current) return;

      setSelectedPositions((prev) => {
        if (!prev.length) return [[row, col]];

        // Already in selection? Check if it's the second-to-last (going back)
        const existingIdx = prev.findIndex(([r, c]) => r === row && c === col);
        if (existingIdx !== -1) {
          if (existingIdx === prev.length - 2) {
            // Going back — trim last
            return prev.slice(0, prev.length - 1);
          }
          return prev; // Already in path, ignore
        }

        const last = prev[prev.length - 1];
        if (!isAdjacent(last, [row, col])) return prev;

        return [...prev, [row, col]];
      });
    },
    []
  );

  const submitSelection = useCallback(() => {
    isDragging.current = false;
    if (!state || selectedPositions.length < 3) {
      clearSelection();
      return;
    }

    const result = checkFoundWord(selectedPositions, puzzle, puzzle.grid);

    if (!result) {
      showToast('Not a theme word');
      clearSelection();
      return;
    }

    const word = selectedPositions.map(([r, c]) => puzzle.grid[r][c]).join('');

    // Already found?
    if (
      (result === 'theme' && state.foundWords.includes(word)) ||
      (result === 'spangram' && state.foundSpangram)
    ) {
      showToast('Already found!');
      clearSelection();
      return;
    }

    setJustFound({ word, type: result });
    setTimeout(() => setJustFound(null), 1500);

    const newFoundWords = result === 'theme' ? [...state.foundWords, word] : state.foundWords;
    const newFoundSpangram = result === 'spangram' ? true : state.foundSpangram;

    const allThemeFound = puzzle.themeWords.every((tw) => newFoundWords.includes(tw.word));
    const won = allThemeFound && newFoundSpangram;

    const newState: StrandsState = {
      ...state,
      foundWords: newFoundWords,
      foundSpangram: newFoundSpangram,
      gameOver: won,
      won,
    };

    saveState(newState);
    setState(newState);
    clearSelection();

    if (won) {
      recordResult(true);
      setTimeout(() => {
        showToast('Puzzle complete!', 2000);
        setTimeout(() => setShowStats(true), 1000);
      }, 300);
    }
  }, [state, selectedPositions, puzzle, showToast, clearSelection]);

  const foundPositions = state
    ? getFoundPositions(state.foundWords, state.foundSpangram, puzzle)
    : new Set<string>();

  const stats: StrandsStats = loadStats();

  return {
    state,
    puzzle,
    selectedPositions,
    justFound,
    foundPositions,
    showStats,
    showHelp,
    stats,
    dayIndex: getTodayIndex(),
    startSelection,
    extendSelection,
    submitSelection,
    clearSelection,
    openStats: () => setShowStats(true),
    closeStats: () => setShowStats(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
  };
}
