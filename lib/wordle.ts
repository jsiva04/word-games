import { ANSWER_LIST, ALL_VALID_WORDS } from '@/data/words';

export const EPOCH = new Date(2021, 5, 19);
export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;
export const FLIP_DURATION = 500;
export const FLIP_DELAY = 300;

export type TileState = 'correct' | 'present' | 'absent';

export interface TileResult {
  letter: string;
  state: TileState;
}

export interface WordleState {
  word: string;
  guesses: string[];
  currentGuess: string;
  gameOver: boolean;
  won: boolean;
  dayIndex: number;
}

export interface WordleStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  distribution: number[];
  bestTime?: number;
  lastTime?: number;
}

const STORAGE_KEY = 'wordleState';
const STATS_KEY = 'wordleStats';

export function getTodayIndex(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - EPOCH.getTime()) / 86400000);
}

export function getDailyWord(): string {
  return ANSWER_LIST[getTodayIndex() % ANSWER_LIST.length].toLowerCase();
}

export function getDefaultState(word: string): WordleState {
  return {
    word,
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false,
    dayIndex: getTodayIndex(),
  };
}

export function loadState(): WordleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as WordleState;
    if (saved.dayIndex === getTodayIndex()) {
      saved.gameOver = saved.gameOver || false;
      saved.won = saved.won || false;
      saved.currentGuess = (saved.currentGuess || '').toLowerCase();
      saved.guesses = Array.isArray(saved.guesses) ? saved.guesses : [];
      return saved;
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return null;
}

export function saveState(state: WordleState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadStats(): WordleStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as WordleStats;
  } catch {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0, distribution: [0, 0, 0, 0, 0, 0] };
}

export function saveStats(stats: WordleStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(won: boolean, guessCount: number, solveTime?: number): WordleStats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    stats.distribution[guessCount - 1]++;
    if (solveTime !== undefined) {
      stats.lastTime = solveTime;
      if (stats.bestTime === undefined || solveTime < stats.bestTime) {
        stats.bestTime = solveTime;
      }
    }
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
  return stats;
}

const HARD_MODE_KEY = 'wordleHardMode';

export function loadHardMode(): boolean {
  try {
    return localStorage.getItem(HARD_MODE_KEY) === 'true';
  } catch { return false; }
}

export function saveHardMode(val: boolean): void {
  try {
    localStorage.setItem(HARD_MODE_KEY, String(val));
  } catch {}
}

function ordinalSuffix(n: number): string {
  if (n === 1) return 'st';
  if (n === 2) return 'nd';
  if (n === 3) return 'rd';
  return 'th';
}

export function validateHardMode(
  guess: string,
  previousGuesses: string[],
  answer: string,
): string | null {
  for (const prev of previousGuesses) {
    const results = evaluateGuess(prev, answer);
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (results[i].state === 'correct' && guess[i] !== prev[i]) {
        return `${i + 1}${ordinalSuffix(i + 1)} letter must be ${prev[i].toUpperCase()}`;
      }
    }
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (results[i].state === 'present' && !guess.includes(prev[i])) {
        return `Guess must contain ${prev[i].toUpperCase()}`;
      }
    }
  }
  return null;
}

export function evaluateGuess(guess: string, answer: string): TileResult[] {
  const result: TileResult[] = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i],
    state: 'absent' as TileState,
  }));

  const answerCounts: Record<string, number> = {};
  for (const ch of answer) {
    answerCounts[ch] = (answerCounts[ch] || 0) + 1;
  }

  // First pass: greens
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i].state = 'correct';
      answerCounts[guess[i]]--;
    }
  }

  // Second pass: yellows
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === 'correct') continue;
    if (answerCounts[guess[i]] > 0) {
      result[i].state = 'present';
      answerCounts[guess[i]]--;
    }
  }

  return result;
}

export function isValidWord(word: string): boolean {
  return ALL_VALID_WORDS.includes(word);
}

export function buildShareText(state: WordleState): string {
  const dayNum = getTodayIndex();
  const guessCount = state.won ? String(state.guesses.length) : 'X';
  const header = `Wordle ${dayNum} ${guessCount}/${MAX_GUESSES}`;

  const rows = state.guesses.map((guess) =>
    evaluateGuess(guess, state.word)
      .map((item) => {
        if (item.state === 'correct') return '🟩';
        if (item.state === 'present') return '🟨';
        return '⬛';
      })
      .join('')
  );

  return header + '\n\n' + rows.join('\n');
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

export const WIN_MESSAGES = ['Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'];
