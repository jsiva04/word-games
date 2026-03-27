import { WAFFLE_PUZZLES, WafflePuzzle, isWaffleCell, WAFFLE_EPOCH, MAX_SWAPS } from '@/data/waffle';

export { MAX_SWAPS };

export type CellColor = 'green' | 'yellow' | 'white';

export interface WaffleStats {
  played: number;
  wins: number;
  streak: number;
  maxStreak: number;
  swapsDistribution: number[];
}

export interface WaffleState {
  dayIndex: number;
  grid: string[][];
  swapsUsed: number;
  gameOver: boolean;
  won: boolean;
}

const STORAGE_KEY = 'waffleState';
const STATS_KEY = 'waffleStats';

export function getTodayIndex(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - WAFFLE_EPOCH.getTime()) / 86400000);
}

export function getDailyPuzzle(): WafflePuzzle {
  return WAFFLE_PUZZLES[getTodayIndex() % WAFFLE_PUZZLES.length];
}

// Get all words (with their cell positions) for the waffle
// 3 horizontal (rows 0, 2, 4) + 3 vertical (cols 0, 2, 4)
export function getWords(puzzle: WafflePuzzle): { positions: [number, number][]; word: string }[] {
  const words = [];

  // Horizontal words: rows 0, 2, 4
  for (const row of [0, 2, 4] as const) {
    const positions: [number, number][] = [[row, 0], [row, 1], [row, 2], [row, 3], [row, 4]];
    const word = positions.map(([r, c]) => puzzle.solution[r][c]).join('');
    words.push({ positions, word });
  }

  // Vertical words: cols 0, 2, 4
  for (const col of [0, 2, 4] as const) {
    const positions: [number, number][] = [[0, col], [1, col], [2, col], [3, col], [4, col]];
    const word = positions.map(([r, c]) => puzzle.solution[r][c]).join('');
    words.push({ positions, word });
  }

  return words;
}

// Compute color for each cell based on current grid vs solution
export function computeColors(grid: string[][], puzzle: WafflePuzzle): CellColor[][] {
  const colors: CellColor[][] = Array.from({ length: 5 }, () => Array(5).fill('white'));
  const words = getWords(puzzle);

  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (!isWaffleCell(row, col)) continue;

      const letter = grid[row][col];
      const solLetter = puzzle.solution[row][col];

      if (letter === ' ') continue;

      if (letter === solLetter) {
        colors[row][col] = 'green';
        continue;
      }

      // Check if this letter appears in any solution word that passes through this cell
      let isYellow = false;
      for (const { positions, word } of words) {
        const inWord = positions.some(([r, c]) => r === row && c === col);
        if (!inWord) continue;

        // Count how many times this letter should still appear in the solution word
        // (excluding already-green positions)
        const solLetterCounts: Record<string, number> = {};
        for (let i = 0; i < 5; i++) {
          const [pr, pc] = positions[i];
          const sl = puzzle.solution[pr][pc];
          solLetterCounts[sl] = (solLetterCounts[sl] || 0) + 1;
        }

        // Subtract green matches
        for (let i = 0; i < 5; i++) {
          const [pr, pc] = positions[i];
          if (grid[pr][pc] === puzzle.solution[pr][pc]) {
            solLetterCounts[grid[pr][pc]]--;
          }
        }

        if ((solLetterCounts[letter] || 0) > 0) {
          isYellow = true;
          break;
        }
      }

      colors[row][col] = isYellow ? 'yellow' : 'white';
    }
  }

  return colors;
}

// Generate scrambled grid from solution (shuffle non-green letters)
export function generateScrambled(puzzle: WafflePuzzle): string[][] {
  // Collect all 21 letters with their positions
  const cells: [number, number][] = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (isWaffleCell(r, c) && puzzle.solution[r][c] !== ' ') {
        cells.push([r, c]);
      }
    }
  }

  // Get letters
  const letters = cells.map(([r, c]) => puzzle.solution[r][c]);

  // Shuffle with deterministic seed based on puzzle index so same puzzle = same scramble
  const shuffled = [...letters];
  const dayIdx = getTodayIndex() % WAFFLE_PUZZLES.length;
  // Simple deterministic shuffle (Fisher-Yates with seeded "random")
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (dayIdx * 1337 + i * 31 + i * i * 7) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Build grid
  const grid: string[][] = Array.from({ length: 5 }, () => Array(5).fill(' '));
  cells.forEach(([r, c], idx) => {
    grid[r][c] = shuffled[idx];
  });

  // Ensure at least some letters are not in their correct positions
  // (If the shuffle accidentally solved the puzzle, do one swap)
  const allGreen = cells.every(([r, c]) => grid[r][c] === puzzle.solution[r][c]);
  if (allGreen && cells.length >= 2) {
    [grid[cells[0][0]][cells[0][1]], grid[cells[1][0]][cells[1][1]]] =
      [grid[cells[1][0]][cells[1][1]], grid[cells[0][0]][cells[0][1]]];
  }

  return grid;
}

export function isGridSolved(grid: string[][], puzzle: WafflePuzzle): boolean {
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (!isWaffleCell(r, c)) continue;
      if (puzzle.solution[r][c] === ' ') continue;
      if (grid[r][c] !== puzzle.solution[r][c]) return false;
    }
  }
  return true;
}

export function getDefaultState(puzzle: WafflePuzzle): WaffleState {
  return {
    dayIndex: getTodayIndex(),
    grid: generateScrambled(puzzle),
    swapsUsed: 0,
    gameOver: false,
    won: false,
  };
}

export function loadState(): WaffleState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw) as WaffleState;
    if (saved.dayIndex === getTodayIndex()) return saved;
  } catch {}
  return null;
}

export function saveState(state: WaffleState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadStats(): WaffleStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw) as WaffleStats;
  } catch {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0, swapsDistribution: Array(MAX_SWAPS + 1).fill(0) };
}

export function saveStats(stats: WaffleStats): void {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

export function recordResult(won: boolean, swapsUsed: number): WaffleStats {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    stats.swapsDistribution[swapsUsed] = (stats.swapsDistribution[swapsUsed] || 0) + 1;
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
  return stats;
}

export function buildShareText(puzzle: WafflePuzzle, swapsUsed: number, won: boolean): string {
  const dayNum = getTodayIndex();
  const header = `Waffle #${dayNum} ${won ? `${swapsUsed}/${MAX_SWAPS}` : 'X'}`;
  const stars = won ? '⭐'.repeat(Math.max(0, MAX_SWAPS - swapsUsed + 1)) : '';
  return `${header}\n${stars}\n${puzzle.hWords[0]}, ${puzzle.hWords[1]}, ${puzzle.hWords[2]}`;
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
