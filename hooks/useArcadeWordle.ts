'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  evaluateGuess,
  isValidWord,
  MAX_GUESSES,
  WORD_LENGTH,
  FLIP_DURATION,
  FLIP_DELAY,
  WIN_MESSAGES,
} from '@/lib/wordle';
import { ANSWER_LIST } from '@/data/words';

export type KeyState = Record<string, 'correct' | 'present' | 'absent'>;

const KEY_PRIORITY = { correct: 3, present: 2, absent: 1 };

export interface ArcadeWordleState {
  word: string;
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
}

function wordForIndex(idx: number): string {
  return ANSWER_LIST[idx % ANSWER_LIST.length].toLowerCase();
}

export function useArcadeWordle(showToast: (msg: string, duration?: number) => void) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [state, setState] = useState<ArcadeWordleState | null>(null);
  const [keyStates, setKeyStates] = useState<KeyState>({});
  const [shakingRow, setShakingRow] = useState<number | null>(null);
  const [revealingRow, setRevealingRow] = useState<number | null>(null);
  const [bouncingRow, setBouncingRow] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const animatingRef = useRef(false);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * ANSWER_LIST.length);
    setPuzzleIndex(startIdx);
    setState({
      word: wordForIndex(startIdx),
      guesses: [],
      currentGuess: '',
      gameOver: false,
      won: false,
    });
  }, []);

  const updateKeyStates = useCallback((guess: string, answer: string) => {
    const evaluation = evaluateGuess(guess, answer);
    setKeyStates((prev) => {
      const next = { ...prev };
      for (const item of evaluation) {
        const cur = KEY_PRIORITY[next[item.letter]] ?? 0;
        if (KEY_PRIORITY[item.state] > cur) next[item.letter] = item.state;
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
    const newState: ArcadeWordleState = { ...state, guesses: newGuesses, currentGuess: '' };
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
        setState(finalState);
        setBouncingRow(rowIdx);
        const msg = WIN_MESSAGES[Math.min(newGuesses.length - 1, WIN_MESSAGES.length - 1)];
        setTimeout(() => {
          showToast(msg, 1800);
          setTimeout(() => setShowResult(true), 1600);
        }, 400);
      } else if (newGuesses.length >= MAX_GUESSES) {
        const finalState = { ...newState, gameOver: true, won: false };
        setState(finalState);
        setTimeout(() => {
          showToast(newState.word.toUpperCase(), 3000);
          setTimeout(() => setShowResult(true), 2000);
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
    if (key === 'Enter' || key === 'ENTER') { submitGuess(); return; }
    if (/^[a-zA-Z]$/.test(key) && state.currentGuess.length < WORD_LENGTH) {
      setState((prev) => prev ? { ...prev, currentGuess: prev.currentGuess + key.toLowerCase() } : prev);
    }
  }, [state, submitGuess]);

  const nextPuzzle = useCallback(() => {
    const nextIdx = puzzleIndex + 1;
    setPuzzleIndex(nextIdx);
    setState({
      word: wordForIndex(nextIdx),
      guesses: [],
      currentGuess: '',
      gameOver: false,
      won: false,
    });
    setKeyStates({});
    setShowResult(false);
    animatingRef.current = false;
  }, [puzzleIndex]);

  return {
    state,
    puzzleIndex,
    keyStates,
    shakingRow,
    revealingRow,
    bouncingRow,
    showResult,
    showHelp,
    handleKey,
    nextPuzzle,
    openResult: () => setShowResult(true),
    closeResult: () => setShowResult(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
  };
}
