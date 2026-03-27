'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  loadConnState,
  saveConnState,
  loadConnStats,
  recordConnResult,
  makeState,
  shuffle,
  buildConnShareText,
  copyToClipboard,
  ConnectionsState,
  ConnectionsStats,
  COLOR_ORDER,
  MAX_MISTAKES,
} from '@/lib/connections';
import { ConnectionColor, CONN_PUZZLES, getConnPuzzleIndex } from '@/data/connections';

export function useConnections(showToast: (msg: string, duration?: number) => void) {
  const [state, setState] = useState<ConnectionsState | null>(null);
  const [shakingWords, setShakingWords] = useState<string[]>([]);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [puzzleIndex, setPuzzleIndex] = useState(0);

  useEffect(() => {
    const idx = getConnPuzzleIndex();
    const puzzle = CONN_PUZZLES[idx];
    const saved = loadConnState(idx);
    const initial = saved ?? makeState(puzzle, idx);
    if (!saved) saveConnState(initial);
    setPuzzleIndex(idx);
    setState(initial);

    if (initial.gameOver) {
      setTimeout(() => setShowStats(true), 500);
    }
  }, []);

  const toggleSelect = useCallback((word: string) => {
    setState((prev) => {
      if (!prev || prev.gameOver) return prev;
      const idx = prev.selected.indexOf(word);
      let selected: string[];
      if (idx !== -1) {
        selected = prev.selected.filter((w) => w !== word);
      } else {
        if (prev.selected.length >= 4) return prev;
        selected = [...prev.selected, word];
      }
      const next = { ...prev, selected };
      saveConnState(next);
      return next;
    });
  }, []);

  const deselectAll = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const next = { ...prev, selected: [] };
      saveConnState(next);
      return next;
    });
  }, []);

  const shuffleTiles = useCallback(() => {
    setState((prev) => {
      if (!prev) return prev;
      const solvedColors = new Set(prev.solved);
      const remaining = prev.words.filter((w) => !solvedColors.has(w.color));
      const solved = prev.words.filter((w) => solvedColors.has(w.color));
      const next = { ...prev, words: [...solved, ...shuffle(remaining)] };
      saveConnState(next);
      return next;
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
          saveConnState(final);
          recordConnResult(true);
          setTimeout(() => {
            showToast('Solved!', 1000);
            setTimeout(() => setShowStats(true), 1200);
          }, 500);
          return final;
        }

        saveConnState(next);
        return next;
      } else {
        // Wrong guess
        const maxCount = Math.max(...COLOR_ORDER.map((c) => colorCounts[c]));
        const mistakes = prev.mistakes + 1;
        const next: ConnectionsState = { ...prev, mistakes, selected: [], guesses: newGuesses };

        // Trigger shake animation
        setShakingWords(sel);
        setTimeout(() => setShakingWords([]), 600);

        if (maxCount === 3) {
          setTimeout(() => showToast('One away!'), 300);
        }

        if (mistakes >= MAX_MISTAKES) {
          // Reveal all remaining
          const remaining = COLOR_ORDER.filter((c) => !prev.solved.includes(c));
          const final = { ...next, solved: [...prev.solved, ...remaining], gameOver: true, won: false };
          saveConnState(final);
          recordConnResult(false);
          setTimeout(() => {
            setTimeout(() => setShowStats(true), 1200);
          }, 600);
          return final;
        }

        saveConnState(next);
        return next;
      }
    });
  }, [showToast]);

  const handleShare = useCallback(async () => {
    if (!state) return;
    const text = buildConnShareText(state, puzzleIndex);
    try {
      await copyToClipboard(text);
      showToast('Copied to clipboard!');
    } catch {
      showToast('Could not copy');
    }
  }, [state, puzzleIndex, showToast]);

  const stats: ConnectionsStats = loadConnStats();

  return {
    state,
    puzzleIndex,
    shakingWords,
    showStats,
    showHelp,
    stats,
    toggleSelect,
    deselectAll,
    shuffleTiles,
    submitGuess,
    handleShare,
    openStats: () => setShowStats(true),
    closeStats: () => setShowStats(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
  };
}
