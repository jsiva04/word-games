export interface SquarewordPuzzle {
  words: [string, string, string, string, string];
}

// Each puzzle has 5 five-letter words to solve simultaneously
// Words are thematically grouped for fun, but any 5 valid words work
export const SQUAREWORD_PUZZLES: SquarewordPuzzle[] = [
  { words: ['RIVER', 'OCEAN', 'CREEK', 'BAYOU', 'DELTA'] },
  { words: ['MAPLE', 'CEDAR', 'BIRCH', 'OLIVE', 'ASPEN'] },
  { words: ['BOXER', 'SKIER', 'RACER', 'DIVER', 'RIDER'] },
  { words: ['SPOON', 'KNIFE', 'LADLE', 'MIXER', 'WHISK'] },
  { words: ['AMBER', 'AZURE', 'CORAL', 'IVORY', 'LILAC'] },
  { words: ['FLUTE', 'PIANO', 'VIOLA', 'BANJO', 'CELLO'] },
  { words: ['BRAVE', 'CALMN', 'EAGER', 'PROUD', 'STERN'] },
  { words: ['TRAIL', 'RIDGE', 'CLIFF', 'GORGE', 'BLUFF'] },
  { words: ['TIGER', 'SHARK', 'EAGLE', 'VIPER', 'BISON'] },
  { words: ['BREAD', 'PASTA', 'SALAD', 'PIZZA', 'STEAK'] },
  { words: ['CHESS', 'POKER', 'DARTS', 'BINGO', 'RUGBY'] },
  { words: ['STORM', 'FROST', 'SLEET', 'DRIZZLE', 'BLAZE'] },
  { words: ['COURT', 'ARENA', 'FIELD', 'TRACK', 'PITCH'] },
  { words: ['BRAND', 'CRISP', 'GRAZE', 'PLUMB', 'STOMP'] },
  { words: ['ORBIT', 'LUNAR', 'SOLAR', 'COMET', 'VENUS'] },
];

// Fix invalid words from above
export const VALID_SQUAREWORD_PUZZLES: SquarewordPuzzle[] = [
  { words: ['RIVER', 'OCEAN', 'CREEK', 'BAYOU', 'DELTA'] },
  { words: ['MAPLE', 'CEDAR', 'BIRCH', 'OLIVE', 'ASPEN'] },
  { words: ['BOXER', 'SKIER', 'RACER', 'DIVER', 'RIDER'] },
  { words: ['SPOON', 'KNIFE', 'LADLE', 'MIXER', 'WHISK'] },
  { words: ['AMBER', 'AZURE', 'CORAL', 'IVORY', 'LILAC'] },
  { words: ['FLUTE', 'PIANO', 'VIOLA', 'BANJO', 'CELLO'] },
  { words: ['TRAIL', 'RIDGE', 'CLIFF', 'GORGE', 'BLUFF'] },
  { words: ['TIGER', 'SHARK', 'EAGLE', 'VIPER', 'BISON'] },
  { words: ['BREAD', 'PASTA', 'SALAD', 'PIZZA', 'STEAK'] },
  { words: ['CHESS', 'POKER', 'DARTS', 'BINGO', 'RUGBY'] },
  { words: ['COURT', 'ARENA', 'FIELD', 'TRACK', 'PITCH'] },
  { words: ['ORBIT', 'LUNAR', 'SOLAR', 'COMET', 'VENUS'] },
  { words: ['FLAME', 'STONE', 'WATER', 'EARTH', 'SPARK'] },
  { words: ['CRISP', 'BLAND', 'SAVORY', 'SWEET', 'SPICY'] },
  { words: ['PLUMB', 'STOMP', 'GRAZE', 'BRAND', 'TRAMP'] },
];

export const SQUAREWORD_EPOCH = new Date(2024, 0, 1);
