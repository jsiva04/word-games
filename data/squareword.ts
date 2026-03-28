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
// Each puzzle is a valid 6×5 word rectangle:
// the 6 rows are 5-letter words and the 5 columns are 6-letter words.
export const VALID_SQUAREWORD_PUZZLES: SquarewordPuzzle[] = [
  { words: ['FLUSH', 'LANCE', 'ARRAY', 'YIELD', 'ENEMA', 'RELAY'] },
  // cols: FLAYER, LARINE, UNREEL, SCALMA, HEYDAY
  { words: ['FLOAT', 'LABRA', 'ACORN', 'YULAN', 'ENEMY', 'RATEL'] },
  // cols: FLAYER, LACUNA, OBOLET, ARRAME, TANNYL
  { words: ['FLOCK', 'LAURA', 'ACTOR', 'YURTA', 'ENACT', 'RAPHE'] },
  // cols: FLAYER, LACUNA, OUTRAP, CROTCH, KARATE
  { words: ['FOHAT', 'LAIRY', 'ARGIL', 'YAHOO', 'EGEST', 'REREE'] },
  // cols: FLAYER, OARAGE, HIGHER, ARIOSE, TYLOTE
  { words: ['FATAL', 'LLAMA', 'ADLAY', 'YOUZE', 'ESKER', 'READY'] },
  // cols: FLAYER, ALDOSE, TALUKA, AMAZED, LAYERY
  { words: ['FRASE', 'LIBER', 'ADUST', 'YERTH', 'EASEL', 'RUTTY'] },
  // cols: FLAYER, RIDEAU, ABURST, SESTET, ERTHLY
  { words: ['FRIKE', 'LEBAN', 'APING', 'YACAL', 'ELEGY', 'RESIN'] },
  // cols: FLAYER, REPALE, IBICES, KANAGI, ENGLYN
  { words: ['FLOUR', 'LAINE', 'ANTIC', 'YGAPO', 'ELVER', 'READD'] },
  // cols: FLAYER, LANGLE, OITAVA, UNIPED, RECORD
  { words: ['FLEAM', 'LARGO', 'AMINI', 'YACAL', 'ENATE', 'RYDER'] },
  // cols: FLAYER, LAMANY, ERICAD, AGNATE, MOILER
  { words: ['FLIMP', 'LEGER', 'AKNEE', 'YAIRD', 'ENTER', 'REEDY'] },
  // cols: FLAYER, LEKANE, IGNITE, MEERED, PREDRY
  { words: ['FROCK', 'LEGOA', 'ATAVI', 'YAMEN', 'EKING', 'RECTA'] },
  // cols: FLAYER, RETAKE, OGAMIC, COVENT, KAINGA
  { words: ['FRAME', 'LAMEL', 'ADYTA', 'YULAN', 'ELUTE', 'RAMET'] },
  // cols: FLAYER, RADULA, AMYLUM, METATE, ELANET
  { words: ['FRASS', 'LAETI', 'ADORN', 'YULAN', 'ELITE', 'RADAR'] },
  // cols: FLAYER, RADULA, AEOLID, STRATA, SINNER
  { words: ['FLUMP', 'LONER', 'ATLEE', 'YAIRD', 'ESKER', 'REEDY'] },
  // cols: FLAYER, LOTASE, UNLIKE, MEERED, PREDRY
  { words: ['FROST', 'LEACH', 'ASKAR', 'YALLA', 'ELEMI', 'RETAN'] },
  // cols: FLAYER, RESALE, OAKLET, SCALMA, THRAIN
];

export const SQUAREWORD_EPOCH = new Date(2024, 0, 1);
