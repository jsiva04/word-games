'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getDailyWord,
  getDefaultState,
  loadState,
  saveState,
  recordResult,
  evaluateGuess,
  isValidWord,
  buildShareText,
  copyToClipboard,
  WordleState,
  WordleStats,
  loadStats,
  getTodayIndex,
  MAX_GUESSES,
  WORD_LENGTH,
  FLIP_DURATION,
  FLIP_DELAY,
  WIN_MESSAGES,
} from '@/lib/wordle';

export type KeyState = Record<string, 'correct' | 'present' | 'absent'>;

const KEY_PRIORITY = { correct: 3, present: 2, absent: 1 };

export function useWordle(showToast: (msg: string, duration?: number) => void) {
  const [state, setState] = useState<WordleState | null>(null);
  const [keyStates, setKeyStates] = useState<KeyState>({});
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [bouncingRow, setBouncingRow] = useState<number | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const animatingRef = useRef(false);

  // Init on mount
  useEffect(() => {
    const daily = getDailyWord();
    const saved = loadState();
    const initial = saved ?? getDefaultState(daily);
    if (!saved) saveState(initial);

    // Restore key states from saved guesses
    const keys: KeyState = {};
    for (const guess of initial.guesses) {
      const evaluation = evaluateGuess(guess, initial.word);
      for (const item of evaluation) {
        const cur = KEY_PRIORITY[keys[item.letter]] ?? 0;
        if (KEY_PRIORITY[item.state] > cur) {
          keys[item.letter] = item.state;
        }
      }
    }
    setKeyStates(keys);
    setState(initial);

    if (initial.gameOver) {
      setTimeout(() => setShowStats(true), 500);
    }
  }, []);

  const updateKeyStates = useCallback((guess: string, answer: string) => {
    const evaluation = evaluateGuess(guess, answer);
    setKeyStates((prev) => {
      const next = { ...prev };
      for (const item of evaluation) {
        const cur = KEY_PRIORITY[next[item.letter]] ?? 0;
        if (KEY_PRIORITY[item.state] > cur) {
          next[item.letter] = item.state;
        }
      }
      return next;
    });
  }, []);

  const submitGuess = useCallback(() => {
    if (!state || animatingRef.current || state.gameOver) return;

    const guess = state.currentGuess;

    if (guess.length < WORD_LENGTH) {
      showToast('Not enough letters');
      setShakingRow(state.guesses.length);
      setTimeout(() => setShakingRow(null), 600);
      return;
    }

    if (!isValidWord(guess)) {
      showToast('Not in word list');
      setShakingRow(state.guesses.length);
      setTimeout(() => setShakingRow(null), 600);
      return;
    }

    const rowIdx = state.guesses.length;
    const newGuesses = [...state.guesses, guess];
    const newState: WordleState = { ...state, guesses: newGuesses, currentGuess: '' };
    saveState(newState);
    setState(newState);

    animatingRef.current = true;
    setRevealingRow(rowIdx);

    const totalDuration = WORD_LENGTH * FLIP_DELAY + FLIP_DURATION;
    setTimeout(() => {
      setRevealingRow(null);
      animatingRef.current = false;
      updateKeyStates(guess, newState.word);

      const won = guess === newState.word;

      if (won) {
        const finalState = { ...newState, gameOver: true, won: true };
        saveState(finalState);
        setState(finalState);
        recordResult(true, newGuesses.length);
        setBouncingRow(rowIdx);
        const msg = WIN_MESSAGES[Math.min(newGuesses.length - 1, WIN_MESSAGES.length - 1)];
        setTimeout(() => {
          showToast(msg, 1800);
          setTimeout(() => setShowStats(true), 1600);
        }, 400);
      } else if (newGuesses.length >= MAX_GUESSES) {
        const finalState = { ...newState, gameOver: true, won: false };
        saveState(finalState);
        setState(finalState);
        recordResult(false, 0);
        setTimeout(() => {
          showToast(newState.word.toUpperCase(), 3000);
          setTimeout(() => setShowStats(true), 2000);
        }, 400);
      }
    }, totalDuration);
  }, [state, showToast, updateKeyStates]);

  const handleKey = useCallback((key: string) => {
    if (!state || animatingRef.current || state.gameOver) return;

    if (key === 'Backspace' || key === 'DELETE') {
      if (state.currentGuess.length > 0) {
        setState((prev) => prev ? { ...prev, currentGuess: prev.currentGuess.slice(0, -1) } : prev);
      }
      return;
    }

    if (key === 'Enter' || key === 'ENTER') {
      submitGuess();
      return;
    }

    if (/^[a-zA-Z]$/.test(key) && state.currentGuess.length < WORD_LENGTH) {
      setState((prev) => prev ? { ...prev, currentGuess: prev.currentGuess + key.toLowerCase() } : prev);
    }
  }, [state, submitGuess]);

  const handleShare = useCallback(async () => {
    if (!state) return;
    const text = buildShareText(state);
    try {
      await copyToClipboard(text);
      showToast('Copied to clipboard!');
    } catch {
      showToast('Could not copy');
    }
  }, [state, showToast]);

  const stats: WordleStats = loadStats();

  return {
    state,
    keyStates,
    shakingRow,
    revealingRow,
    bouncingRow,
    showStats,
    showHelp,
    stats,
    handleKey,
    handleShare,
    openStats: () => setShowStats(true),
    closeStats: () => setShowStats(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
    todayIndex: getTodayIndex(),
  };
}
