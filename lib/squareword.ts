import { VALID_SQUAREWORD_PUZZLES, SquarewordPuzzle, SQUAREWORD_EPOCH } from '@/data/squareword';

export const WORD_LENGTH = 5;
export const NUM_WORDS = 6;

export type TileState = 'correct' | 'present' | 'absent' | 'empty';

export interface TileResult {
  letter: string;
  state: TileState;
}

export interface SquarewordState {
  dayIndex: number;
  puzzle: SquarewordPuzzle;
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
}

export interface SquarewordStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
}

const STORAGE_KEY = 'squarewordState';
const STATS_KEY = 'squarewordStats';

export function getTodayIndex(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - SQUAREWORD_EPOCH.getTime()) / 86400000);
}

export function getDailyPuzzle(): SquarewordPuzzle {
  return VALID_SQUAREWORD_PUZZLES[getTodayIndex() % VALID_SQUAREWORD_PUZZLES.length];
}

export function getDefaultState(puzzle: SquarewordPuzzle): SquarewordState {
  return {
    dayIndex: getTodayIndex(),
    puzzle,
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false,
  };
}

export function loadState(): SquarewordState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as SquarewordState;
    if (saved.dayIndex === getTodayIndex() && saved.puzzle.words.length === NUM_WORDS) return saved;
  } catch {}
  return null;
}

export function saveState(state: SquarewordState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadStats(): SquarewordStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as SquarewordStats;
  } catch {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
}

export function saveStats(stats: SquarewordStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(won: boolean): SquarewordStats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
  return stats;
}

// Evaluate a guess against a single target word (Wordle-style)
export function evaluateGuess(guess: string, target: string): TileResult[] {
  const result: TileResult[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i],
    state: 'absent' as TileState,
  }));

  const targetCounts: Record<string, number> = {};
  for (const ch of target) {
    targetCounts[ch] = (targetCounts[ch] || 0) + 1;
  }

  // Pass 1: greens
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === target[i]) {
      result[i].state = 'correct';
      targetCounts[guess[i]]--;
    }
  }

  // Pass 2: yellows
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === 'correct') continue;
    if (targetCounts[guess[i]] > 0) {
      result[i].state = 'present';
      targetCounts[guess[i]]--;
    }
  }

  return result;
}

// For each of the 6 target words, evaluate the guess
export function evaluateGuessAll(
  guess: string,
  puzzle: SquarewordPuzzle
): TileResult[][] {
  return puzzle.words.map((word) => evaluateGuess(guess, word.toLowerCase()));
}

// Check if a word is solved (all green) by any guess
export function isWordSolved(
  wordIdx: number,
  guesses: string[],
  puzzle: SquarewordPuzzle
): boolean {
  const target = puzzle.words[wordIdx].toLowerCase();
  return guesses.some((g) => g.toLowerCase() === target);
}

// Get the "best" tile state for each position of each word across all guesses
export function getBestStates(
  puzzle: SquarewordPuzzle,
  guesses: string[]
): TileState[][] {
  const PRIORITY: Record<TileState, number> = { correct: 3, present: 2, absent: 1, empty: 0 };
  return puzzle.words.map((word) => {
    const best: TileState[] = Array(WORD_LENGTH).fill('empty');
    for (const guess of guesses) {
      const eval_ = evaluateGuess(guess.toLowerCase(), word.toLowerCase());
      for (let i = 0; i < WORD_LENGTH; i++) {
        if (PRIORITY[eval_[i].state] > PRIORITY[best[i]]) {
          best[i] = eval_[i].state;
        }
      }
    }
    return best;
  });
}

// Get column-level "locked" letters: for each column position,
// if all 5 words agree on what's there (i.e., one guess got green for that col in all words)
// we show that as a column hint
export function getColumnHints(
  puzzle: SquarewordPuzzle,
  guesses: string[]
): (string | null)[] {
  const hints: (string | null)[] = Array(WORD_LENGTH).fill(null);
  for (let col = 0; col < WORD_LENGTH; col++) {
    // All 6 words have the same letter at this col?
    const letters = new Set(puzzle.words.map((w) => w[col].toUpperCase()));
    if (letters.size === 1) {
      hints[col] = [...letters][0];
    }
  }
  return hints;
}

// For each word, collect letters that have been "present" (yellow) across all guesses
export function getPresentLetters(puzzle: SquarewordPuzzle, guesses: string[]): string[][] {
  return puzzle.words.map((word) => {
    const present = new Set<string>();
    for (const guess of guesses) {
      const result = evaluateGuess(guess.toLowerCase(), word.toLowerCase());
      for (const tile of result) {
        if (tile.state === 'present') present.add(tile.letter.toUpperCase());
      }
    }
    return Array.from(present);
  });
}

export function areAllWordsSolved(
  puzzle: SquarewordPuzzle,
  guesses: string[]
): boolean {
  return puzzle.words.every((_, i) => isWordSolved(i, guesses, puzzle));
}

export async function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
  } else {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
  }
}
