// Daily Strands puzzles — rotates every day
// Each puzzle: 6x6 letter grid, 4-5 theme words, 1 spangram

export const STRANDS_EPOCH = new Date(2024, 0, 1); // Strands launch date

export function getStrandsPuzzleIndex() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - STRANDS_EPOCH) / 86400000) % STRANDS_PUZZLES.length;
}

export const STRANDS_PUZZLES = [
  {
    theme: "Animals",
    grid: [
      ['L', 'I', 'O', 'N', 'S', 'T'],
      ['A', 'F', 'L', 'E', 'A', 'E'],
      ['G', 'R', 'E', 'E', 'K', 'G'],
      ['I', 'O', 'W', 'L', 'S', 'S'],
      ['R', 'A', 'B', 'B', 'I', 'T'],
      ['S', 'N', 'A', 'K', 'E', 'L']
    ],
    themeWords: [
      { word: "LION", positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: "OWLS", positions: [[3,0],[3,1],[3,2],[3,3]] },
      { word: "RABBIT", positions: [[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]] },
      { word: "SNAKE", positions: [[5,0],[5,1],[5,2],[5,3],[5,4]] }
    ],
    spangram: { word: "WILDLIFEPEST", hint: "All creatures great and small" }
  },
  {
    theme: "Colors",
    grid: [
      ['B', 'L', 'U', 'E', 'R', 'E'],
      ['R', 'E', 'D', 'O', 'R', 'A'],
      ['O', 'L', 'I', 'V', 'E', 'N'],
      ['W', 'H', 'I', 'T', 'E', 'G'],
      ['G', 'R', 'E', 'E', 'N', 'E'],
      ['S', 'I', 'L', 'V', 'E', 'R']
    ],
    themeWords: [
      { word: "BLUE", positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: "RED", positions: [[1,0],[1,1],[1,2]] },
      { word: "WHITE", positions: [[3,0],[3,1],[3,2],[3,3],[3,4]] },
      { word: "GREEN", positions: [[4,0],[4,1],[4,2],[4,3],[4,4]] }
    ],
    spangram: { word: "PAINTER", hint: "Works with many hues" }
  },
  {
    theme: "Fruits",
    grid: [
      ['A', 'P', 'P', 'L', 'E', 'M'],
      ['B', 'A', 'N', 'A', 'N', 'A'],
      ['O', 'R', 'A', 'N', 'G', 'E'],
      ['C', 'H', 'E', 'R', 'R', 'Y'],
      ['G', 'R', 'A', 'P', 'E', 'S'],
      ['L', 'I', 'M', 'E', 'N', 'S']
    ],
    themeWords: [
      { word: "APPLE", positions: [[0,0],[0,1],[0,2],[0,3],[0,4]] },
      { word: "BANANA", positions: [[1,0],[1,1],[1,2],[1,3],[1,4],[1,5]] },
      { word: "ORANGE", positions: [[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]] },
      { word: "CHERRY", positions: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]] }
    ],
    spangram: { word: "GROCERIES", hint: "Fresh from the market" }
  },
  {
    theme: "Verbs of Motion",
    grid: [
      ['R', 'U', 'N', 'A', 'S', 'K'],
      ['W', 'A', 'L', 'K', 'I', 'P'],
      ['J', 'U', 'M', 'P', 'E', 'R'],
      ['S', 'K', 'I', 'P', 'P', 'I'],
      ['C', 'R', 'A', 'W', 'L', 'N'],
      ['D', 'I', 'V', 'E', 'B', 'G']
    ],
    themeWords: [
      { word: "RUN", positions: [[0,0],[0,1],[0,2]] },
      { word: "WALK", positions: [[1,0],[1,1],[1,2],[1,3]] },
      { word: "JUMP", positions: [[2,0],[2,1],[2,2],[2,3]] },
      { word: "CRAWL", positions: [[4,0],[4,1],[4,2],[4,3],[4,4]] }
    ],
    spangram: { word: "EXERCISE", hint: "Physical activity" }
  },
  {
    theme: "Flowers",
    grid: [
      ['R', 'O', 'S', 'E', 'P', 'I'],
      ['T', 'U', 'L', 'I', 'P', 'L'],
      ['D', 'A', 'I', 'S', 'Y', 'L'],
      ['S', 'U', 'N', 'F', 'L', 'O'],
      ['W', 'E', 'R', 'M', 'O', 'E'],
      ['L', 'I', 'L', 'Y', 'R', 'S']
    ],
    themeWords: [
      { word: "ROSE", positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: "TULIP", positions: [[1,0],[1,1],[1,2],[1,3],[1,4]] },
      { word: "DAISY", positions: [[2,0],[2,1],[2,2],[2,3],[2,4]] },
      { word: "SUNFLOWER", positions: [[3,3],[3,4],[3,5],[4,0],[4,1],[4,2],[4,3],[4,4],[4,5]] }
    ],
    spangram: { word: "GARDEN", hint: "Blooming place" }
  },
  {
    theme: "Weather",
    grid: [
      ['R', 'A', 'I', 'N', 'S', 'T'],
      ['S', 'L', 'E', 'E', 'T', 'O'],
      ['N', 'O', 'W', 'S', 'T', 'R'],
      ['C', 'L', 'O', 'U', 'D', 'S'],
      ['F', 'O', 'G', 'G', 'Y', 'L'],
      ['W', 'I', 'N', 'D', 'Y', 'E']
    ],
    themeWords: [
      { word: "RAIN", positions: [[0,0],[0,1],[0,2],[0,3]] },
      { word: "SNOW", positions: [[2,0],[2,1],[2,2],[2,3]] },
      { word: "CLOUDS", positions: [[3,0],[3,1],[3,2],[3,3],[3,4],[3,5]] },
      { word: "WINDY", positions: [[5,0],[5,1],[5,2],[5,3],[5,4]] }
    ],
    spangram: { word: "FORECAST", hint: "What meteorologists predict" }
  }
];
