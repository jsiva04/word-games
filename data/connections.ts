export type ConnectionColor = 'yellow' | 'green' | 'blue' | 'purple';

export interface Category {
  name: string;
  color: ConnectionColor;
  words: string[];
}

export interface Puzzle {
  categories: Category[];
}

export const CONN_EPOCH = new Date(2023, 5, 12);

export function getConnPuzzleIndex(): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today.getTime() - CONN_EPOCH.getTime()) / 86400000) % CONN_PUZZLES.length;
}

export const CONN_PUZZLES: Puzzle[] = [
  // 0
  { categories: [
    { name: "Baby animals",           color: "yellow", words: ["LAMB",    "FOAL",    "CALF",    "KID"]     },
    { name: "Card games",             color: "green",  words: ["POKER",   "BRIDGE",  "SNAP",    "WAR"]     },
    { name: "___ board",              color: "blue",   words: ["SKATE",   "KEY",     "CARD",    "DART"]    },
    { name: "Words meaning wander",   color: "purple", words: ["ROAM",    "DRIFT",   "MEANDER", "RAMBLE"]  }
  ]},
  // 1
  { categories: [
    { name: "Musical instruments",    color: "yellow", words: ["DRUM",    "FLUTE",   "HARP",    "LUTE"]    },
    { name: "Types of cheese",        color: "green",  words: ["BRIE",    "GOUDA",   "EDAM",    "FETA"]    },
    { name: "Famous Jacks: ___",      color: "blue",   words: ["SPARROW", "BLACK",   "FROST",   "LONDON"]  },
    { name: "Shades of blue",         color: "purple", words: ["COBALT",  "NAVY",    "TEAL",    "CERULEAN"]}
  ]},
  // 2
  { categories: [
    { name: "Playground equipment",   color: "yellow", words: ["SLIDE",   "SWING",   "SEESAW",  "MONKEY"]  },
    { name: "Kitchen appliances",     color: "green",  words: ["TOASTER", "BLENDER", "MIXER",   "KETTLE"]  },
    { name: "Crow ___",               color: "blue",   words: ["BAR",     "FEET",    "HOP",     "BERRY"]   },
    { name: "Contronyms",             color: "purple", words: ["SANCTION","CLEAVE",  "DUST",    "TRIM"]    }
  ]},
  // 3
  { categories: [
    { name: "Citrus fruits",          color: "yellow", words: ["LIME",    "LEMON",   "ORANGE",  "YUZU"]    },
    { name: "Dog breeds",             color: "green",  words: ["BOXER",   "SETTER",  "POINTER", "BEAGLE"]  },
    { name: "___ stone",              color: "blue",   words: ["FLINT",   "KEY",     "SAND",    "COBBLE"]  },
    { name: "Words for angry",        color: "purple", words: ["LIVID",   "IRATE",   "FUMING",  "INCENSED"]}
  ]},
  // 4
  { categories: [
    { name: "Pizza toppings",         color: "yellow", words: ["OLIVE",   "BASIL",   "ONION",   "PEPPER"]  },
    { name: "Things on a map",        color: "green",  words: ["SCALE",   "LEGEND",  "BORDER",  "ROUTE"]   },
    { name: "___ light",              color: "blue",   words: ["MOON",    "SUN",     "LIME",    "SPOT"]    },
    { name: "Types of clouds",        color: "purple", words: ["CIRRUS",  "NIMBUS",  "STRATUS", "CUMULUS"] }
  ]},
  // 5
  { categories: [
    { name: "Shades of red",          color: "yellow", words: ["SCARLET", "CRIMSON", "RUBY",    "CHERRY"]  },
    { name: "Board games",            color: "green",  words: ["RISK",    "CLUE",    "SORRY",   "TABOO"]   },
    { name: "Can follow 'OVER'",      color: "blue",   words: ["BOARD",   "CAST",    "HAUL",    "DOSE"]    },
    { name: "Types of code",          color: "purple", words: ["MORSE",   "ZIP",     "QR",      "BAR"]     }
  ]},
  // 6
  { categories: [
    { name: "Farm animals",           color: "yellow", words: ["COW",     "PIG",     "HEN",     "GOAT"]    },
    { name: "Bond films: ___ Day",    color: "green",  words: ["GOLDEN",  "GROUND",  "VALEN",   "BIRTH"]   },
    { name: "Types of pasta",         color: "blue",   words: ["PENNE",   "ORZO",    "FUSILLI", "RIGATONI"]},
    { name: "Cleopatra's ___",        color: "purple", words: ["NEEDLE",  "NOSE",    "ASP",     "BARGE"]   }
  ]},
  // 7
  { categories: [
    { name: "Things in a toolbox",    color: "yellow", words: ["HAMMER",  "DRILL",   "LEVEL",   "CLAMP"]   },
    { name: "Spices",                 color: "green",  words: ["CUMIN",   "SUMAC",   "MACE",    "FENNEL"]  },
    { name: "Fire ___",               color: "blue",   words: ["WORKS",   "PLACE",   "SIDE",    "TRUCK"]   },
    { name: "Oxymorons",              color: "purple", words: ["JUMBO",   "LIVING",  "OPEN",    "FREEZER"] }
  ]},
  // 8
  { categories: [
    { name: "Dances",                 color: "yellow", words: ["SALSA",   "TANGO",   "WALTZ",   "FOXTROT"] },
    { name: "Types of coffee",        color: "green",  words: ["LATTE",   "MOCHA",   "FLAT",    "LUNGO"]   },
    { name: "___ bar",                color: "blue",   words: ["CROW",    "HANDLE",  "SALAD",   "MINI"]    },
    { name: "NATO alphabet (A-E)",    color: "purple", words: ["ALPHA",   "BRAVO",   "CHARLIE", "DELTA"]   }
  ]},
  // 9
  { categories: [
    { name: "Things on a cake",       color: "yellow", words: ["ICING",   "CANDLE",  "LAYER",   "CRUMB"]   },
    { name: "Islands",                color: "green",  words: ["MALTA",   "ARUBA",   "FIJI",    "SAMOA"]   },
    { name: "___ pool",               color: "blue",   words: ["CAR",     "GENE",    "SWIM",    "DEAD"]    },
    { name: "Silent letters: K___",   color: "purple", words: ["KNIGHT",  "KNEEL",   "KNACK",   "KNAVE"]   }
  ]},
  // 10
  { categories: [
    { name: "Yoga poses",             color: "yellow", words: ["COBRA",   "BRIDGE",  "WARRIOR", "TREE"]    },
    { name: "Cocktail ingredients",   color: "green",  words: ["BITTERS", "VERMOUTH","GRENADINE","TRIPLE"]  },
    { name: "Apple products: i___",   color: "blue",   words: ["PHONE",   "PAD",     "MAC",     "CLOUD"]   },
    { name: "Homophone of a number",  color: "purple", words: ["ATE",     "FOR",     "TOO",     "WON"]     }
  ]},
  // 11
  { categories: [
    { name: "Eye parts",              color: "yellow", words: ["IRIS",    "PUPIL",   "CORNEA",  "RETINA"]  },
    { name: "Currencies",             color: "green",  words: ["YEN",     "EURO",    "PESO",    "FRANC"]   },
    { name: "Can precede 'FISH'",     color: "blue",   words: ["SWORD",   "STAR",    "CAT",     "BLOW"]    },
    { name: "Ways to say goodbye",    color: "purple", words: ["CIAO",    "ADIEU",   "FAREWELL","TOODLES"] }
  ]},
  // 12
  { categories: [
    { name: "Planets",                color: "yellow", words: ["MARS",    "VENUS",   "SATURN",  "URANUS"]  },
    { name: "Chocolate brands",       color: "green",  words: ["TWIX",    "BOUNTY",  "WISPA",   "BOOST"]   },
    { name: "___ jump",               color: "blue",   words: ["HIGH",    "LONG",    "SHOW",    "BUNGEE"]  },
    { name: "Things that are cast",   color: "purple", words: ["SHADOW",  "SPELL",   "NET",     "DOUBT"]   }
  ]},
  // 13
  { categories: [
    { name: "Fairy tale characters",  color: "yellow", words: ["RAPUNZEL","CINDERELLA","GRETEL","SLEEPING"] },
    { name: "Types of bridges",       color: "green",  words: ["ARCH",    "CABLE",   "SWING",   "TRUSS"]   },
    { name: "Elvis ___",              color: "blue",   words: ["PRESLEY", "COSTELLO", "MITCHELL","BISHOP"]  },
    { name: "Words for nonsense",     color: "purple", words: ["BALONEY", "HOKUM",   "DRIVEL",  "TWADDLE"] }
  ]},
  // 14
  { categories: [
    { name: "Things that buzz",       color: "yellow", words: ["BEE",     "PHONE",   "SAW",     "ALARM"]   },
    { name: "Types of bread",         color: "green",  words: ["ROTI",    "NAAN",    "BRIOCHE", "CIABATTA"]},
    { name: "Greek letters",          color: "blue",   words: ["SIGMA",   "THETA",   "LAMBDA",  "OMEGA"]   },
    { name: "Collective nouns: fish", color: "purple", words: ["SCHOOL",  "SHOAL",   "DRAFT",   "RUN"]     }
  ]},
  // 15
  { categories: [
    { name: "Things that are folded", color: "yellow", words: ["TOWEL",   "MAP",     "LETTER",  "OMELET"]  },
    { name: "Punctuation marks",      color: "green",  words: ["COLON",   "HYPHEN",  "TILDE",   "CARET"]   },
    { name: "___ glass",              color: "blue",   words: ["HOUR",    "MAGNIFY", "EYE",     "LOOKING"]  },
    { name: "Prefix meaning 'three'", color: "purple", words: ["TRI",     "TRIPLE",  "TRIO",    "TRICE"]   }
  ]},
  // 16
  { categories: [
    { name: "Things in a gym",        color: "yellow", words: ["BENCH",   "RACK",    "CABLE",   "SQUAT"]   },
    { name: "Types of steak",         color: "green",  words: ["RIBEYE",  "FLANK",   "SKIRT",   "RUMP"]    },
    { name: "___ print",              color: "blue",   words: ["BLUE",    "THUMB",   "FOOT",    "FINE"]    },
    { name: "Kinds of humor",         color: "purple", words: ["DRY",     "DEADPAN", "SURREAL", "BITING"]  }
  ]},
  // 17
  { categories: [
    { name: "Things with stripes",    color: "yellow", words: ["TIGER",   "ZEBRA",   "SKUNK",   "BARCODE"] },
    { name: "Frozen desserts",        color: "green",  words: ["GELATO",  "SORBET",  "SHERBET", "KULFI"]   },
    { name: "___ room",               color: "blue",   words: ["SHOW",    "BATH",    "LIVING",  "BALL"]    },
    { name: "Anagram of a planet",    color: "purple", words: ["RASM",    "RENTA",   "RESTING", "PRUNE"]   }
  ]},
  // 18
  { categories: [
    { name: "Things that drip",       color: "yellow", words: ["FAUCET",  "CANDLE",  "ICICLE",  "PAINT"]   },
    { name: "Board game pieces",      color: "green",  words: ["TOKEN",   "DIE",     "PAWN",    "TILE"]    },
    { name: "Lock ___",               color: "blue",   words: ["SMITH",   "DOWN",    "OUT",     "STEP"]    },
    { name: "Types of poetry",        color: "purple", words: ["SONNET",  "HAIKU",   "LIMERICK","ODE"]     }
  ]},
  // 19
  { categories: [
    { name: "Things in space",        color: "yellow", words: ["COMET",   "NEBULA",  "QUASAR",  "PULSAR"]  },
    { name: "Types of market",        color: "green",  words: ["FLEA",    "BULL",    "BEAR",    "STOCK"]   },
    { name: "___ note",               color: "blue",   words: ["BANK",    "POST",    "SIDE",    "QUARTER"] },
    { name: "Words with silent 'P'",  color: "purple", words: ["PSALM",   "PNEUMA",  "PSYCHE",  "PTERIS"]  }
  ]},
  // 20
  { categories: [
    { name: "Things that pop",        color: "yellow", words: ["BALLOON", "BUBBLE",  "TOAST",   "COLLAR"]  },
    { name: "Sushi types",            color: "green",  words: ["NIGIRI",  "MAKI",    "TEMAKI",  "URAMAKI"] },
    { name: "Can follow 'GRAND'",     color: "blue",   words: ["STAND",   "MASTER",  "FATHER",  "SLAM"]    },
    { name: "Words meaning confused",  color: "purple", words: ["BAFFLED", "PUZZLED", "STUMPED", "FOXED"]   }
  ]},
  // 21
  { categories: [
    { name: "Types of hat",           color: "yellow", words: ["BERET",   "FEDORA",  "STETSON", "CLOCHE"]  },
    { name: "Phobias: fear of ___",   color: "green",  words: ["SPIDERS", "HEIGHTS", "CLOWNS",  "FLYING"]  },
    { name: "___ ship",               color: "blue",   words: ["WAR",     "AIR",     "DEALER",  "FRIEND"]  },
    { name: "Words for a small area", color: "purple", words: ["NOOK",    "ALCOVE",  "CUBBY",   "NICHE"]   }
  ]},
  // 22
  { categories: [
    { name: "Things in a museum",     color: "yellow", words: ["FOSSIL",  "STATUE",  "MURAL",   "RELIC"]   },
    { name: "Cuts of pork",           color: "green",  words: ["LOIN",    "BELLY",   "CHOP",    "RACK"]    },
    { name: "___ work",               color: "blue",   words: ["NET",     "FRAME",   "GROUND",  "OVER"]    },
    { name: "Things that are pinned", color: "purple", words: ["PHOTO",   "BLAME",   "HOPES",   "MEDAL"]   }
  ]},
  // 23
  { categories: [
    { name: "Types of cake",          color: "yellow", words: ["CARROT",  "MARBLE",  "BUNDT",   "POUND"]   },
    { name: "Things you knit",        color: "green",  words: ["SCARF",   "SWEATER", "MITT",    "BEANIE"]  },
    { name: "___ screen",             color: "blue",   words: ["BIG",     "SMOKE",   "SILVER",  "TOUCH"]   },
    { name: "Portmanteau words",      color: "purple", words: ["BRUNCH",  "SMOG",    "BLOG",    "MOTEL"]   }
  ]},
  // 24
  { categories: [
    { name: "Things that are laced",  color: "yellow", words: ["SHOE",    "CORSET",  "DRINK",   "CAKE"]    },
    { name: "Weather phenomena",      color: "green",  words: ["HAIL",    "SLEET",   "HAZE",    "SQUALL"]  },
    { name: "___ hunt",               color: "blue",   words: ["SCAVEN",  "FOX",     "WITCH",   "SNIPE"]   },
    { name: "Collective: birds",      color: "purple", words: ["FLOCK",   "MURDER",  "COLONY",  "EXALT"]   }
  ]},
  // 25
  { categories: [
    { name: "Things that are hollow", color: "yellow", words: ["LOG",     "BONE",    "REED",    "DRUM"]    },
    { name: "Languages",              color: "green",  words: ["HINDI",   "SWAHILI", "MALAY",   "CATALAN"] },
    { name: "Can follow 'UNDER'",     color: "blue",   words: ["TONE",    "COVER",   "WORLD",   "SCORE"]   },
    { name: "Things you can crack",   color: "purple", words: ["CODE",    "JOKE",    "KNUCKLE", "SAFE"]    }
  ]},
  // 26
  { categories: [
    { name: "Things in a wallet",     color: "yellow", words: ["CASH",    "CARD",    "ID",      "RECEIPT"] },
    { name: "Types of kick",          color: "green",  words: ["DROP",    "PENALTY", "FREE",    "SIDE"]    },
    { name: "___ line",               color: "blue",   words: ["DEAD",    "GUIDE",   "HAIR",    "SHORE"]   },
    { name: "Ancient writing systems",color: "purple", words: ["RUNE",    "CUNEIFORM","GLYPH",  "LINEAR"]  }
  ]},
  // 27
  { categories: [
    { name: "Things that tick",       color: "yellow", words: ["CLOCK",   "BOMB",    "INSECT",  "METER"]   },
    { name: "Types of therapy",       color: "green",  words: ["HYDRO",   "PHYSIO",  "SPEECH",  "ART"]     },
    { name: "___ zone",               color: "blue",   words: ["TIME",    "END",     "DROP",    "DANGER"]  },
    { name: "Words for very cold",    color: "purple", words: ["ARCTIC",  "FRIGID",  "GLACIAL", "POLAR"]   }
  ]},
  // 28
  { categories: [
    { name: "Things you can file",    color: "yellow", words: ["NAIL",    "TAX",     "SUIT",    "CLAIM"]   },
    { name: "Units of sound",         color: "green",  words: ["DECIBEL", "HERTZ",   "OCTAVE",  "SEMITONE"]},
    { name: "Moon ___",               color: "blue",   words: ["LIGHT",   "SHINE",   "BEAM",    "STONE"]   },
    { name: "Words for a mess",       color: "purple", words: ["FIASCO",  "DEBACLE", "SNAFU",   "SHAMBLES"]  }
  ]},
  // 29
  { categories: [
    { name: "Things that are pressed",color: "yellow", words: ["SHIRT",   "FLOWER",  "BUTTON",  "CHARGE"]  },
    { name: "Types of election",      color: "green",  words: ["PRIMARY", "RUNOFF",  "RECALL",  "BY"]      },
    { name: "___ fall",               color: "blue",   words: ["FREE",    "WATER",   "DOWN",    "LAND"]    },
    { name: "Things that are twisted",color: "purple", words: ["TRUTH",   "ANKLE",   "HUMOR",   "PLOT"]    }
  ]},
];
