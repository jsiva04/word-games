import { ConnectionColor, Puzzle } from '@/data/connections';

export const MAX_MISTAKES = 4;
export const COLOR_ORDER: ConnectionColor[] = ['yellow', 'green', 'blue', 'purple'];
export const SHARE_EMOJI: Record<ConnectionColor, string> = {
  yellow: '🟨',
  green: '🟩',
  blue: '🟦',
  purple: '🟪',
};

export interface WordItem {
  word: string;
  color: ConnectionColor;
}

export interface GuessRecord {
  words: string[];
  colors: ConnectionColor[];
}

export interface ConnectionsState {
  puzzleIndex: number;
  words: WordItem[];
  selected: string[];
  solved: ConnectionColor[];
  guesses: GuessRecord[];
  mistakes: number;
  gameOver: boolean;
  won: boolean;
}

export interface ConnectionsStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
}

const CONN_STATE_KEY = 'connectionsState';
const CONN_STATS_KEY = 'connectionsStats';

export function loadConnState(currentIndex: number): ConnectionsState | null {
  try {
    const raw = localStorage.getItem(CONN_STATE_KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as ConnectionsState;
    if (s.puzzleIndex === currentIndex) return s;
  } catch {}
  return null;
}

export function saveConnState(state: ConnectionsState): void {
  localStorage.setItem(CONN_STATE_KEY, JSON.stringify(state));
}

export function loadConnStats(): ConnectionsStats {
  try {
    const raw = localStorage.getItem(CONN_STATS_KEY);
    if (raw) return JSON.parse(raw) as ConnectionsStats;
  } catch {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
}

export function saveConnStats(stats: ConnectionsStats): void {
  localStorage.setItem(CONN_STATS_KEY, JSON.stringify(stats));
}

export function recordConnResult(won: boolean): ConnectionsStats {
  const stats = loadConnStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  saveConnStats(stats);
  return stats;
}

export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function makeState(puzzle: Puzzle, idx: number): ConnectionsState {
  const words: WordItem[] = [];
  for (const cat of puzzle.categories) {
    for (const w of cat.words) {
      words.push({ word: w, color: cat.color });
    }
  }
  return {
    puzzleIndex: idx,
    words: shuffle(words),
    selected: [],
    solved: [],
    guesses: [],
    mistakes: 0,
    gameOver: false,
    won: false,
  };
}

export function buildConnShareText(state: ConnectionsState, puzzleIndex: number): string {
  const result = state.won
    ? `Solved in ${state.guesses.length} guess${state.guesses.length === 1 ? '' : 'es'}`
    : 'Failed';
  const header = `Connections\nPuzzle #${puzzleIndex} \u2013 ${result}`;

  const rows = state.guesses.map((guess) =>
    guess.colors.map((c) => SHARE_EMOJI[c] || '⬛').join('')
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
