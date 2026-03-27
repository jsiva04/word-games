# Word Games - React Version

A React implementation of NYT-inspired word games: Wordle, Connections, and Strands.

## Setup

```bash
npm install
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Header.jsx           # App header with menu & stats buttons
│   ├── Navigation.jsx       # Game switcher drawer
│   ├── Wordle.jsx          # Wordle game component
│   ├── Connections.jsx     # Connections game component
│   ├── Strands.jsx         # Strands game component
│   └── Toast.jsx           # Notification component
├── hooks/
│   ├── useWordle.js        # Wordle game logic
│   ├── useConnections.js   # Connections game logic
│   └── useStrands.js       # Strands game logic
├── data/
│   ├── words.js            # Word lists
│   ├── connections.js      # Connections puzzles
│   └── strands.js          # Strands puzzles
├── styles/
│   └── index.css           # Global styles
├── App.jsx                 # Main app component
└── main.jsx               # React entry point
```

## Games

### Wordle
Guess the daily word in 6 tries. Green = correct position, Yellow = correct letter wrong position, Gray = not in word.

### Connections
Group 16 words into 4 categories by finding the connection between them. Yellow is easiest, purple is hardest.

### Strands
Find words in a 6x6 grid by selecting adjacent letters. Theme words and a spangram (word spanning all categories) to discover.

## Build

```bash
npm run build
```

## Notes

- All games rotate daily based on epoch dates
- Game state persisted in localStorage
- Responsive design for mobile and desktop
