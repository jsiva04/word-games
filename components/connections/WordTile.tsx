interface WordTileProps {
  word: string;
  selected: boolean;
  shaking: boolean;
  onToggle: (word: string) => void;
}

export function WordTile({ word, selected, shaking, onToggle }: WordTileProps) {
  return (
    <button
      className={`conn-tile${selected ? ' selected' : ''}${shaking ? ' shake' : ''}`}
      data-word={word}
      onClick={() => onToggle(word)}
    >
      {word}
    </button>
  );
}
