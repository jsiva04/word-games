export interface StrandsWord {
  word: string;
  positions: [number, number][]; // [row, col]
}

export interface StrandsPuzzle {
  theme: string;
  grid: string[][];
  themeWords: StrandsWord[];
  spangram: StrandsWord & { hint: string };
}

// Each puzzle: 6-row × 6-col letter grid
// All cells are covered by exactly one word (theme or spangram)
// Spangram spans the grid from one side to the other
export const STRANDS_PUZZLES: StrandsPuzzle[] = [
  // 0 - Animals
  {
    theme: 'Animals',
    grid: [
      ['L', 'I', 'O', 'N', 'S', 'T'],
      ['A', 'F', 'L', 'E', 'A', 'E'],
      ['G', 'R', 'E', 'E', 'K', 'G'],
      ['I', 'O', 'W', 'L', 'S', 'S'],
      ['R', 'A', 'B', 'B', 'I', 'T'],
      ['S', 'N', 'A', 'K', 'E', 'L'],
    ],
    themeWords: [
      { word: 'LION', positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: 'OWLS', positions: [[3,2],[3,3],[3,0],[3,1]] },
      { word: 'RABBIT', positions: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]] },
      { word: 'SNAKE', positions: [[5,0],[5,1],[5,2],[5,3],[5,4]] },
      { word: 'FLEA', positions: [[1,1],[1,2],[1,3],[1,4]] },
    ],
    spangram: {
      word: 'TIGERS',
      hint: 'Big cats with stripes',
      positions: [[0,4],[0,5],[1,5],[2,5],[3,5],[4,5]],
    },
  },
  // 1 - Colors
  {
    theme: 'Colors',
    grid: [
      ['B', 'L', 'U', 'E', 'R', 'E'],
      ['R', 'E', 'D', 'O', 'R', 'A'],
      ['O', 'L', 'I', 'V', 'E', 'N'],
      ['W', 'H', 'I', 'T', 'E', 'G'],
      ['G', 'R', 'E', 'E', 'N', 'E'],
      ['S', 'I', 'L', 'V', 'E', 'R'],
    ],
    themeWords: [
      { word: 'BLUE', positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: 'RED', positions: [[1,0],[1,1],[1,2]] },
      { word: 'OLIVE', positions: [[2,0],[2,1],[2,2],[2,3],[2,4]] },
      { word: 'WHITE', positions: [[3,0],[3,1],[3,2],[3,3],[3,4]] },
      { word: 'GREEN', positions: [[4,0],[4,1],[4,2],[4,3],[4,4]] },
      { word: 'SILVER', positions: [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]] },
    ],
    spangram: {
      word: 'ORANGE',
      hint: 'A citrus hue',
      positions: [[0,4],[0,5],[1,5],[1,4],[1,3],[2,5]],
    },
  },
  // 2 - Fruits
  {
    theme: 'Fruits',
    grid: [
      ['A', 'P', 'P', 'L', 'E', 'M'],
      ['B', 'A', 'N', 'A', 'N', 'A'],
      ['O', 'R', 'A', 'N', 'G', 'E'],
      ['C', 'H', 'E', 'R', 'R', 'Y'],
      ['G', 'R', 'A', 'P', 'E', 'S'],
      ['L', 'I', 'M', 'E', 'N', 'S'],
    ],
    themeWords: [
      { word: 'APPLE', positions: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
      { word: 'BANANA', positions: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]] },
      { word: 'ORANGE', positions: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]] },
      { word: 'CHERRY', positions: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]] },
      { word: 'GRAPES', positions: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]] },
      { word: 'LIME', positions: [[5,0],[5,1],[5,2],[5,3]] },
    ],
    spangram: {
      word: 'MELON',
      hint: 'Summer fruit',
      positions: [[0,5],[1,5],[2,5],[3,5],[4,5]],
    },
  },
  // 3 - Weather
  {
    theme: 'Weather',
    grid: [
      ['R', 'A', 'I', 'N', 'S', 'T'],
      ['S', 'L', 'E', 'E', 'T', 'O'],
      ['N', 'O', 'W', 'S', 'T', 'R'],
      ['C', 'L', 'O', 'U', 'D', 'S'],
      ['F', 'O', 'G', 'G', 'Y', 'L'],
      ['W', 'I', 'N', 'D', 'Y', 'E'],
    ],
    themeWords: [
      { word: 'RAIN', positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: 'SLEET', positions: [[1,0],[1,1],[1,2],[1,3],[1,4]] },
      { word: 'SNOW', positions: [[2,0],[2,1],[2,2],[2,3]] },
      { word: 'CLOUDS', positions: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]] },
      { word: 'FOGGY', positions: [[4,0],[4,1],[4,2],[4,3],[4,4]] },
      { word: 'WINDY', positions: [[5,0],[5,1],[5,2],[5,3],[5,4]] },
    ],
    spangram: {
      word: 'STORMY',
      hint: 'Turbulent skies',
      positions: [[0,4],[0,5],[1,5],[2,5],[3,5],[4,5]],
    },
  },
  // 4 - Sports
  {
    theme: 'Sports',
    grid: [
      ['S', 'O', 'C', 'C', 'E', 'R'],
      ['T', 'E', 'N', 'N', 'I', 'U'],
      ['G', 'O', 'L', 'F', 'S', 'G'],
      ['B', 'O', 'X', 'I', 'N', 'B'],
      ['C', 'R', 'I', 'C', 'K', 'Y'],
      ['S', 'W', 'I', 'M', 'E', 'T'],
    ],
    themeWords: [
      { word: 'SOCCER', positions: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]] },
      { word: 'TENNIS', positions: [[1,0],[1,1],[1,2],[1,3],[1,4],[2,4]] },
      { word: 'GOLF', positions: [[2,0],[2,1],[2,2],[2,3]] },
      { word: 'BOXING', positions: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]] },
      { word: 'CRICKET', positions: [[4,0],[4,1],[4,2],[4,3],[4,4],[5,4],[5,3]] },
      { word: 'SWIM', positions: [[5,0],[5,1],[5,2],[5,3]] },
    ],
    spangram: {
      word: 'RUGBY',
      hint: 'Tackles and scrums',
      positions: [[1,5],[2,5],[3,5],[4,5],[5,5]],
    },
  },
  // 5 - Music
  {
    theme: 'Instruments',
    grid: [
      ['P', 'I', 'A', 'N', 'O', 'F'],
      ['V', 'I', 'O', 'L', 'I', 'L'],
      ['N', 'D', 'R', 'U', 'M', 'U'],
      ['B', 'A', 'N', 'J', 'O', 'T'],
      ['H', 'A', 'R', 'P', 'T', 'E'],
      ['G', 'U', 'I', 'T', 'A', 'R'],
    ],
    themeWords: [
      { word: 'PIANO', positions: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
      { word: 'VIOLIN', positions: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]] },
      { word: 'DRUM', positions: [[2,1],[2,2],[2,3],[2,4]] },
      { word: 'BANJO', positions: [[3,0],[3,1],[3,2],[3,3],[3,4]] },
      { word: 'HARP', positions: [[4,0],[4,1],[4,2],[4,3]] },
      { word: 'GUITAR', positions: [[5,0],[5,1],[5,2],[5,3],[5,4],[5,5]] },
    ],
    spangram: {
      word: 'FLUTE',
      hint: 'Blown woodwind',
      positions: [[0,5],[1,5],[2,5],[3,5],[4,5]],
    },
  },
  // 6 - Countries
  {
    theme: 'Countries',
    grid: [
      ['F', 'R', 'A', 'N', 'C', 'E'],
      ['S', 'P', 'A', 'I', 'N', 'G'],
      ['J', 'A', 'P', 'A', 'N', 'E'],
      ['B', 'R', 'A', 'Z', 'I', 'R'],
      ['I', 'N', 'D', 'I', 'A', 'M'],
      ['C', 'H', 'I', 'N', 'A', 'Y'],
    ],
    themeWords: [
      { word: 'FRANCE', positions: [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]] },
      { word: 'SPAIN', positions: [[1,0],[1,1],[1,2],[1,3],[1,4]] },
      { word: 'JAPAN', positions: [[2,0],[2,1],[2,2],[2,3],[2,4]] },
      { word: 'BRAZIL', positions: [[3,0],[3,1],[3,2],[3,3],[3,4],[2,5]] },
      { word: 'INDIA', positions: [[4,0],[4,1],[4,2],[4,3],[4,4]] },
      { word: 'CHINA', positions: [[5,0],[5,1],[5,2],[5,3],[5,4]] },
    ],
    spangram: {
      word: 'GERMANY',
      hint: 'Heart of Europe',
      positions: [[0,5],[1,5],[2,5],[3,5],[4,5],[5,5],[5,4]],
    },
  },
];

export const STRANDS_EPOCH = new Date(2024, 0, 1);
