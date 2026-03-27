import { ConnectionsState } from '@/lib/connections';
import { Puzzle } from '@/data/connections';
import { SolvedRow } from './SolvedRow';
import { WordTile } from './WordTile';

interface ConnectionsBoardProps {
  state: ConnectionsState;
  puzzle: Puzzle;
  shakingWords: string[];
  onToggle: (word: string) => void;
}

export function ConnectionsBoard({ state, puzzle, shakingWords, onToggle }: ConnectionsBoardProps) {
  const solvedColors = new Set(state.solved);
  const remaining = state.words.filter((w) => !solvedColors.has(w.color));

  return (
    <div className="conn-board">
      {state.solved.map((color) => {
        const cat = puzzle.categories.find((c) => c.color === color)!;
        return <SolvedRow key={color} category={cat} />;
      })}

      {remaining.length > 0 && (
        <div className="conn-grid">
          {remaining.map((item) => (
            <WordTile
              key={item.word}
              word={item.word}
              selected={state.selected.includes(item.word)}
              shaking={shakingWords.includes(item.word)}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
}
