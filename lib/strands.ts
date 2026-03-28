import { STRANDS_PUZZLES, StrandsPuzzle, STRANDS_EPOCH } from '@/data/strands';

export const STRANDS_ROWS = 6;
export const STRANDS_COLS = 6;

export interface StrandsStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
}

export interface StrandsState {
  dayIndex: number;
  foundWords: string[];
  foundSpangram: boolean;
  hintsUsed: number;
  gameOver: boolean;
  won: boolean;
}

const STORAGE_KEY = 'strandsState';
const STATS_KEY = 'strandsStats';

export function getTodayIndex(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - STRANDS_EPOCH.getTime()) / 86400000);
}

export function getDailyPuzzle(): StrandsPuzzle {
  return STRANDS_PUZZLES[getTodayIndex() % STRANDS_PUZZLES.length];
}

export function isAdjacent(
  [r1, c1]: [number, number],
  [r2, c2]: [number, number]
): boolean {
  return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
}

export function posKey(row: number, col: number): string {
  return `${row},${col}`;
}

export function getDefaultState(): StrandsState {
  return {
    dayIndex: getTodayIndex(),
    foundWords: [],
    foundSpangram: false,
    hintsUsed: 0,
    gameOver: false,
    won: false,
  };
}

export function loadState(): StrandsState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as StrandsState;
    if (saved.dayIndex === getTodayIndex()) return saved;
  } catch {}
  return null;
}

export function saveState(state: StrandsState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadStats(): StrandsStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as StrandsStats;
  } catch {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
}

export function saveStats(stats: StrandsStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(won: boolean): StrandsStats {
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

// Check if positions form a path that matches a known word in the puzzle
export function checkFoundWord(
  positions: [number, number][],
  puzzle: StrandsPuzzle,
  grid: string[][]
): 'theme' | 'spangram' | null {
  const word = positions.map(([r, c]) => grid[r][c]).join('');
  const posStr = positions.map(([r, c]) => posKey(r, c)).join('|');

  // Check spangram
  const spanStr = puzzle.spangram.positions.map(([r, c]) => posKey(r, c)).join('|');
  if (word === puzzle.spangram.word && posStr === spanStr) return 'spangram';

  // Check theme words
  for (const tw of puzzle.themeWords) {
    const twStr = tw.positions.map(([r, c]) => posKey(r, c)).join('|');
    if (word === tw.word && posStr === twStr) return 'theme';
  }

  return null;
}

// Get all positions used by found words
export function getFoundPositions(
  foundWords: string[],
  foundSpangram: boolean,
  puzzle: StrandsPuzzle
): Set<string> {
  const found = new Set<string>();
  for (const word of foundWords) {
    const tw = puzzle.themeWords.find((w) => w.word === word);
    if (tw) tw.positions.forEach(([r, c]) => found.add(posKey(r, c)));
  }
  if (foundSpangram) {
    puzzle.spangram.positions.forEach(([r, c]) => found.add(posKey(r, c)));
  }
  return found;
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
