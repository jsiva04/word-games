// Daily Connections puzzles — rotates every 30 days from CONN_EPOCH
// Each puzzle: 4 categories, each with 4 words (16 unique words total)
// Colors: yellow (easiest) → green → blue → purple (hardest)

export const CONN_EPOCH = new Date(2023, 5, 12); // NYT Connections launch date

export function getConnPuzzleIndex() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - CONN_EPOCH) / 86400000) % CONN_PUZZLES.length;
}

export const CONN_PUZZLES = [
  { categories: [
    { name: "Baby animals",           color: "yellow", words: ["LAMB",    "FOAL",    "CALF",    "KID"]     },
    { name: "Card games",             color: "green",  words: ["POKER",   "BRIDGE",  "SNAP",    "WAR"]     },
    { name: "___ board",              color: "blue",   words: ["SKATE",   "KEY",     "CARD",    "DART"]    },
    { name: "Words meaning wander",   color: "purple", words: ["ROAM",    "DRIFT",   "MEANDER", "RAMBLE"]  }
  ]},
  { categories: [
    { name: "Musical instruments",    color: "yellow", words: ["DRUM",    "FLUTE",   "HARP",    "LUTE"]    },
    { name: "Types of cheese",        color: "green",  words: ["BRIE",    "GOUDA",   "EDAM",    "FETA"]    },
    { name: "Famous Jacks: ___",      color: "blue",   words: ["SPARROW", "BLACK",   "FROST",   "LONDON"]  },
    { name: "Shades of blue",         color: "purple", words: ["COBALT",  "NAVY",    "TEAL",    "CERULEAN"]}
  ]},
  { categories: [
    { name: "Playground equipment",   color: "yellow", words: ["SLIDE",   "SWING",   "SEESAW",  "MONKEY"]  },
    { name: "Kitchen appliances",     color: "green",  words: ["TOASTER", "BLENDER", "MIXER",   "KETTLE"]  },
    { name: "Crow ___",               color: "blue",   words: ["BAR",     "FEET",    "HOP",     "BERRY"]   },
    { name: "Contronyms",             color: "purple", words: ["SANCTION","CLEAVE",  "DUST",    "TRIM"]    }
  ]},
  { categories: [
    { name: "Citrus fruits",          color: "yellow", words: ["LIME",    "LEMON",   "ORANGE",  "YUZU"]    },
    { name: "Dog breeds",             color: "green",  words: ["BOXER",   "SETTER",  "POINTER", "BEAGLE"]  },
    { name: "___ stone",              color: "blue",   words: ["FLINT",   "KEY",     "SAND",    "COBBLE"]  },
    { name: "Words for angry",        color: "purple", words: ["LIVID",   "IRATE",   "FUMING",  "INCENSED"]}
  ]},
  { categories: [
    { name: "Pizza toppings",         color: "yellow", words: ["OLIVE",   "BASIL",   "ONION",   "PEPPER"]  },
    { name: "Things on a map",        color: "green",  words: ["SCALE",   "LEGEND",  "BORDER",  "ROUTE"]   },
    { name: "___ light",              color: "blue",   words: ["MOON",    "SUN",     "LIME",    "SPOT"]    },
    { name: "Types of clouds",        color: "purple", words: ["CIRRUS",  "NIMBUS",  "STRATUS", "CUMULUS"] }
  ]},
];
