'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  makeState,
  shuffle,
  ConnectionsState,
  COLOR_ORDER,
  MAX_MISTAKES,
} from '@/lib/connections';
import { ConnectionColor, CONN_PUZZLES } from '@/data/connections';

function puzzleForIndex(idx: number) {
  return CONN_PUZZLES[idx % CONN_PUZZLES.length];
}

export function useArcadeConnections(showToast: (msg: string, duration?: number) => void) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [state, setState] = useState<ConnectionsState | null>(null);
  const [shakingWords, setShakingWords] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * CONN_PUZZLES.length);
    setPuzzleIndex(startIdx);
    setState(makeState(puzzleForIndex(startIdx), startIdx));
  }, []);

  const toggleSelect = useCallback((word: string) => {
    setState((prev) => {
      if (!prev || prev.gameOver) return prev;
      const idx = prev.selected.indexOf(word);
      const selected =
        idx !== -1
          ? prev.selected.filter((w) => w !== word)
          : prev.selected.length >= 4
          ? prev.selected
          : [...prev.selected, word];
      return { ...prev, selected };
    });
  }, []);

  const deselectAll = useCallback(() => {
    setState((prev) => (prev ? { ...prev, selected: [] } : prev));
  }, []);

  const shuffleTiles = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const solvedColors = new Set(prev.solved);
      const remaining = prev.words.filter((w) => !solvedColors.has(w.color));
      const solved = prev.words.filter((w) => solvedColors.has(w.color));
      return { ...prev, words: [...solved, ...shuffle(remaining)] };
    });
  }, []);

  const submitGuess = useCallback(() => {
    setState((prev) => {
      if (!prev || prev.selected.length !== 4 || prev.gameOver) return prev;

      const sel = prev.selected.slice();
      const colorCounts: Record<string, number> = {};
      for (const c of COLOR_ORDER) colorCounts[c] = 0;
      for (const word of sel) {
        const item = prev.words.find((w) => w.word === word);
        if (item) colorCounts[item.color]++;
      }

      const guessColors = sel.map((word) => {
        const item = prev.words.find((w) => w.word === word);
        return item ? item.color : ('absent' as ConnectionColor);
      });
      const newGuesses = [...prev.guesses, { words: sel, colors: guessColors }];

      let correctColor: ConnectionColor | null = null;
      for (const c of COLOR_ORDER) {
        if (colorCounts[c] === 4) correctColor = c as ConnectionColor;
      }

      if (correctColor) {
        const solved = [...prev.solved, correctColor];
        const next: ConnectionsState = { ...prev, solved, selected: [], guesses: newGuesses };
        if (solved.length === 4) {
          const final = { ...next, gameOver: true, won: true };
          setTimeout(() => {
            showToast('Solved!', 1000);
            setTimeout(() => setShowResult(true), 1200);
          }, 500);
          return final;
        }
        return next;
      } else {
        const maxCount = Math.max(...COLOR_ORDER.map((c) => colorCounts[c]));
        const mistakes = prev.mistakes + 1;
        const next: ConnectionsState = { ...prev, mistakes, selected: [], guesses: newGuesses };

        setShakingWords(sel);
        setTimeout(() => setShakingWords([]), 600);

        if (maxCount === 3) setTimeout(() => showToast('One away!'), 300);

        if (mistakes >= MAX_MISTAKES) {
          const remaining = COLOR_ORDER.filter((c) => !prev.solved.includes(c));
          const final = {
            ...next,
            solved: [...prev.solved, ...remaining],
            gameOver: true,
            won: false,
          };
          setTimeout(() => setTimeout(() => setShowResult(true), 1200), 600);
          return final;
        }
        return next;
      }
    });
  }, [showToast]);

  const nextPuzzle = useCallback(() => {
    const nextIdx = puzzleIndex + 1;
    setPuzzleIndex(nextIdx);
    setState(makeState(puzzleForIndex(nextIdx), nextIdx));
    setShowResult(false);
  }, [puzzleIndex]);

  return {
    state,
    puzzleIndex,
    shakingWords,
    showResult,
    showHelp,
    toggleSelect,
    deselectAll,
    shuffleTiles,
    submitGuess,
    nextPuzzle,
    openResult: () => setShowResult(true),
    closeResult: () => setShowResult(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
  };
}
