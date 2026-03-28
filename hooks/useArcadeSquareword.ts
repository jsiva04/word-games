'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  evaluateGuessAll,
  areAllWordsSolved,
  isWordSolved,
  getBestStates,
  getPresentLetters,
  WORD_LENGTH,
  SquarewordState,
} from '@/lib/squareword';
import { VALID_SQUAREWORD_PUZZLES } from '@/data/squareword';
import { ALL_VALID_WORDS } from '@/data/words';

function puzzleForIndex(idx: number) {
  return VALID_SQUAREWORD_PUZZLES[idx % VALID_SQUAREWORD_PUZZLES.length];
}

export function useArcadeSquareword(showToast: (msg: string, duration?: number) => void) {
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [state, setState] = useState<SquarewordState | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showGuesses, setShowGuesses] = useState(false);

  useEffect(() => {
    const startIdx = Math.floor(Math.random() * VALID_SQUAREWORD_PUZZLES.length);
    setPuzzleIndex(startIdx);
    setState({
      dayIndex: startIdx,
      puzzle: puzzleForIndex(startIdx),
      guesses: [],
      currentGuess: '',
      gameOver: false,
      won: false,
    });
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
        if (guess.length < WORD_LENGTH) { showToast('Not enough letters'); return; }
        if (
          !ALL_VALID_WORDS.includes(guess.toLowerCase()) &&
          !state.puzzle.words.some((w) => w === guess)
        ) {
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
        setState(newState);

        if (won) {
          setTimeout(() => {
            showToast('Solved!', 2000);
            setTimeout(() => setShowResult(true), 1000);
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

  const nextPuzzle = useCallback(() => {
    const nextIdx = puzzleIndex + 1;
    setPuzzleIndex(nextIdx);
    setState({
      dayIndex: nextIdx,
      puzzle: puzzleForIndex(nextIdx),
      guesses: [],
      currentGuess: '',
      gameOver: false,
      won: false,
    });
    setShowResult(false);
  }, [puzzleIndex]);

  const wordSolved = state
    ? state.puzzle.words.map((_, i) => isWordSolved(i, state.guesses, state.puzzle))
    : Array(6).fill(false);

  const bestStates = state ? getBestStates(state.puzzle, state.guesses) : null;
  const presentLetters = state ? getPresentLetters(state.puzzle, state.guesses) : [];

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
    puzzleIndex,
    wordSolved,
    bestStates,
    presentLetters,
    keyStates,
    showResult,
    showHelp,
    showGuesses,
    handleKey,
    nextPuzzle,
    openResult: () => setShowResult(true),
    closeResult: () => setShowResult(false),
    openHelp: () => setShowHelp(true),
    closeHelp: () => setShowHelp(false),
    openGuesses: () => setShowGuesses(true),
    closeGuesses: () => setShowGuesses(false),
  };
}
