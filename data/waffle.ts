export interface WafflePuzzle {
  // solution[row][col] = letter, only 21 cells matter (waffle pattern)
  // Rows 0,2,4: all 5 cols
  // Rows 1,3: only cols 0, 2, 4
  solution: string[][];
  // horizontal words: rows 0, 2, 4
  hWords: [string, string, string];
  // vertical words: cols 0, 2, 4
  vWords: [string, string, string];
}

// isWaffleCell: returns true if this (row,col) is part of the waffle
export function isWaffleCell(row: number, col: number): boolean {
  return row % 2 === 0 || col % 2 === 0;
}

// Verified puzzles: each row word and column word is valid
// Row 0 = hWords[0], Row 2 = hWords[1], Row 4 = hWords[2]
// Col 0 = vWords[0], Col 2 = vWords[1], Col 4 = vWords[2]
export const WAFFLE_PUZZLES: WafflePuzzle[] = [
  // Puzzle 1: AGREE/RUNGS/SPEED + ACRES/RANGE/EASED
  {
    hWords: ['AGREE', 'RUNGS', 'SPEED'],
    vWords: ['ACRES', 'RANGE', 'EASED'],
    solution: [
      ['A', 'G', 'R', 'E', 'E'],
      ['C', ' ', 'A', ' ', 'A'],
      ['R', 'U', 'N', 'G', 'S'],
      ['E', ' ', 'G', ' ', 'E'],
      ['S', 'P', 'E', 'E', 'D'],
    ],
  },
  // Puzzle 2: TRIBE/REEDS/OPTED + TURBO/INEPT/EASED
  {
    hWords: ['TRIBE', 'REEDS', 'OPTED'],
    vWords: ['TURBO', 'INEPT', 'EASED'],
    solution: [
      ['T', 'R', 'I', 'B', 'E'],
      ['U', ' ', 'N', ' ', 'A'],
      ['R', 'E', 'E', 'D', 'S'],
      ['B', ' ', 'P', ' ', 'E'],
      ['O', 'P', 'T', 'E', 'D'],
    ],
  },
  // Puzzle 3: EARTH/COVER/LANCE + EXCEL/RIVEN/HORDE
  {
    hWords: ['EARTH', 'COVER', 'LANCE'],
    vWords: ['EXCEL', 'RIVEN', 'HORDE'],
    solution: [
      ['E', 'A', 'R', 'T', 'H'],
      ['X', ' ', 'I', ' ', 'O'],
      ['C', 'O', 'V', 'E', 'R'],
      ['E', ' ', 'E', ' ', 'D'],
      ['L', 'A', 'N', 'C', 'E'],
    ],
  },
  // Puzzle 4: BALED/ALGAE/DOTES + BLAND/LIGHT/DRESS
  {
    hWords: ['BALED', 'ALGAE', 'DOTES'],
    vWords: ['BLAND', 'LIGHT', 'DRESS'],
    solution: [
      ['B', 'A', 'L', 'E', 'D'],
      ['L', ' ', 'I', ' ', 'R'],
      ['A', 'L', 'G', 'A', 'E'],
      ['N', ' ', 'H', ' ', 'S'],
      ['D', 'O', 'T', 'E', 'S'],
    ],
  },
  // Puzzle 5: PULSE/ASSET/TERRA + PLANT/LASER/EXTRA
  {
    hWords: ['PULSE', 'ASSET', 'TERRA'],
    vWords: ['PLANT', 'LASER', 'EXTRA'],
    solution: [
      ['P', 'U', 'L', 'S', 'E'],
      ['L', ' ', 'A', ' ', 'X'],
      ['A', 'S', 'S', 'E', 'T'],
      ['N', ' ', 'E', ' ', 'R'],
      ['T', 'E', 'R', 'R', 'A'],
    ],
  },
];

export const WAFFLE_EPOCH = new Date(2024, 0, 1);
export const MAX_SWAPS = 15;
