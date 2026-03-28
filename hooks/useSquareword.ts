'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getDailyPuzzle,
  getDefaultState,
  loadState,
  saveState,
  recordResult,
  evaluateGuessAll,
  areAllWordsSolved,
  isWordSolved,
  getBestStates,
  getPresentLetters,
  loadStats,
  getTodayIndex,
  copyToClipboard,
  WORD_LENGTH,
  SquarewordState,
  SquarewordStats,
} from '@/lib/squareword';
import { ALL_VALID_WORDS } from '@/data/words';

export function useSquareword(showToast: (msg: string, duration?: number) => void) {
  const [state, setState] = useState<SquarewordState | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuesses, setShowGuesses] = useState(false);

  useEffect(() => {
    const puzzle = getDailyPuzzle();
    const saved = loadState();
    const initial = saved ?? getDefaultState(puzzle);
    if (!saved) saveState(initial);
    setState(initial);

    if (initial.gameOver) {
      setTimeout(() => setShowStats(true), 500);
    }
  }, []);

  const handleKey = useCallback(
    (key: string) => {
      if (!state || state.gameOver) return;

      if (key === 'Backspace' || key === 'DELETE') {
        if (state.currentGuess.length > 0) {
          setState((prev) =>
            prev ? { ...prev, currentGuess: prev.currentGuess.slice(0, -1) } : prev
          );
        }
        return;
      }

      if (key === 'Enter' || key === 'ENTER') {
        const guess = state.currentGuess.toUpperCase();

        if (guess.length < WORD_LENGTH) {
          showToast('Not enough letters');
          return;
        }

        if (!ALL_VALID_WORDS.includes(guess.toLowerCase()) &&
            !state.puzzle.words.some((w) => w === guess)) {
          showToast('Not in word list');
          return;
        }

        const newGuesses = [...state.guesses, guess];
        const won = areAllWordsSolved(state.puzzle, newGuesses);

        const newState: SquarewordState = {
          ...state,
          guesses: newGuesses,
          currentGuess: '',
          gameOver: won,
          won,
        };

        saveState(newState);
        setState(newState);

        if (won) {
          recordResult(true);
          setTimeout(() => {
            showToast('Solved!', 2000);
            setTimeout(() => setShowStats(true), 1000);
          }, 300);
        }
        return;
      }

      if (/^[a-zA-Z]$/.test(key) && state.currentGuess.length < WORD_LENGTH) {
        setState((prev) =>
          prev ? { ...prev, currentGuess: prev.currentGuess + key.toUpperCase() } : prev
        );
      }
    },
    [state, showToast]
  );

  const handleShare = useCallback(async () => {
    if (!state) return;
    const dayNum = getTodayIndex();
    const text = `Squareword #${dayNum}\n6/6 words\n${state.guesses.length} guesses`;
    try {
      await copyToClipboard(text);
      showToast('Copied to clipboard!');
    } catch {
      showToast('Could not copy');
    }
  }, [state, showToast]);

  const wordSolved = state
    ? state.puzzle.words.map((_, i) => isWordSolved(i, state.guesses, state.puzzle))
    : Array(6).fill(false);

  const bestStates = state ? getBestStates(state.puzzle, state.guesses) : null;
  const presentLetters = state ? getPresentLetters(state.puzzle, state.guesses) : [];

  const stats: SquarewordStats = loadStats();

  // Aggregate key states across all words
  const keyStates: Record<string, 'correct' | 'present' | 'absent'> = {};
  if (state) {
    const PRIORITY = { correct: 3, present: 2, absent: 1 };
    for (const guess of state.guesses) {
      const allResults = evaluateGuessAll(guess.toLowerCase(), state.puzzle);
      for (const wordResult of allResults) {
        for (const tile of wordResult) {
          if (tile.state === 'empty') continue;
          const cur = PRIORITY[keyStates[tile.letter.toUpperCase()] as keyof typeof PRIORITY] ?? 0;
          if (PRIORITY[tile.state as keyof typeof PRIORITY] > cur) {
            keyStates[tile.letter.toUpperCase()] = tile.state as 'correct' | 'present' | 'absent';
          }
        }
      }
    }
  }

  return {
    state,
    wordSolved,
    bestStates,
    presentLetters,
    keyStates,
    showStats,
    showHelp,
    showGuesses,
    stats,
    handleKey,
    handleShare,
    openStats: () => setShowStats(true),
    closeStats: () => setShowStats(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
    openGuesses: () => setShowGuesses(true),
    closeGuesses: () => setShowGuesses(false),
    dayIndex: getTodayIndex(),
  };
}
