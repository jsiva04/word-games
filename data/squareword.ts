export interface SquarewordPuzzle {
  words: [string, string, string, string, string, string];
}

// Each puzzle has 6 five-letter words to solve simultaneously
// Words are thematically grouped for fun, but any 6 valid words work
export const SQUAREWORD_PUZZLES: SquarewordPuzzle[] = [
  { words: ['RIVER', 'OCEAN', 'CREEK', 'BAYOU', 'DELTA', 'BROOK'] },
  { words: ['MAPLE', 'CEDAR', 'BIRCH', 'OLIVE', 'ASPEN', 'ELDER'] },
  { words: ['BOXER', 'SKIER', 'RACER', 'DIVER', 'RIDER', 'ROWER'] },
  { words: ['SPOON', 'KNIFE', 'LADLE', 'MIXER', 'WHISK', 'TONGS'] },
  { words: ['AMBER', 'AZURE', 'CORAL', 'IVORY', 'LILAC', 'TAUPE'] },
  { words: ['BRAVE', 'CALMN', 'EAGER', 'PROUD', 'STERN', 'SWIFT'] },
  { words: ['TRAIL', 'RIDGE', 'CLIFF', 'GORGE', 'BLUFF', 'SLOPE'] },
  { words: ['TIGER', 'SHARK', 'EAGLE', 'VIPER', 'BISON', 'HYENA'] },
  { words: ['BREAD', 'PASTA', 'SALAD', 'PIZZA', 'STEAK', 'SUSHI'] },
  { words: ['CHESS', 'POKER', 'DARTS', 'BINGO', 'RUGBY', 'CRAPS'] },
  { words: ['STORM', 'FROST', 'SLEET', 'DRIZZLE', 'BLAZE', 'CLOUD'] },
  { words: ['COURT', 'ARENA', 'FIELD', 'TRACK', 'PITCH', 'LINKS'] },
  { words: ['BRAND', 'CRISP', 'GRAZE', 'PLUMB', 'STOMP', 'CRIMP'] },
  { words: ['ORBIT', 'LUNAR', 'SOLAR', 'COMET', 'VENUS', 'PLUTO'] },
];

// Fix invalid words from above
export const VALID_SQUAREWORD_PUZZLES: SquarewordPuzzle[] = [
  { words: ['RIVER', 'OCEAN', 'CREEK', 'BAYOU', 'DELTA', 'BROOK'] },
  { words: ['MAPLE', 'CEDAR', 'BIRCH', 'OLIVE', 'ASPEN', 'ELDER'] },
  { words: ['BOXER', 'SKIER', 'RACER', 'DIVER', 'RIDER', 'ROWER'] },
  { words: ['SPOON', 'KNIFE', 'LADLE', 'MIXER', 'WHISK', 'TONGS'] },
  { words: ['AMBER', 'AZURE', 'CORAL', 'IVORY', 'LILAC', 'TAUPE'] },
  { words: ['FLUTE', 'PIANO', 'VIOLA', 'BANJO', 'CELLO', 'ORGAN'] },
  { words: ['TRAIL', 'RIDGE', 'CLIFF', 'GORGE', 'BLUFF', 'SLOPE'] },
  { words: ['TIGER', 'SHARK', 'EAGLE', 'VIPER', 'BISON', 'HYENA'] },
  { words: ['BREAD', 'PASTA', 'SALAD', 'PIZZA', 'STEAK', 'SUSHI'] },
  { words: ['CHESS', 'POKER', 'DARTS', 'BINGO', 'RUGBY', 'CRAPS'] },
  { words: ['COURT', 'ARENA', 'FIELD', 'TRACK', 'PITCH', 'LINKS'] },
  { words: ['ORBIT', 'LUNAR', 'SOLAR', 'COMET', 'VENUS', 'PLUTO'] },
  { words: ['FLAME', 'STONE', 'WATER', 'EARTH', 'SPARK', 'VAPOR'] },
  { words: ['CRISP', 'BLAND', 'TANGY', 'SWEET', 'SPICY', 'SMOKY'] },
  { words: ['PLUMB', 'STOMP', 'GRAZE', 'BRAND', 'TRAMP', 'CRIMP'] },
];

export const SQUAREWORD_EPOCH = new Date(2024, 0, 1);
