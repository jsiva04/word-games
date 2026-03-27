import { TileResult } from '@/lib/wordle';

interface TileProps {
  letter?: string;
  state?: TileResult['state'] | 'tbd' | 'empty';
  animationDelay?: number;
  animationDuration?: number;
  bounce?: boolean;
}

export function Tile({ letter, state = 'empty', animationDelay, animationDuration, bounce }: TileProps) {
  const style: React.CSSProperties = {};
  if (animationDelay !== undefined) style.animationDelay = `${animationDelay}ms`;
  if (animationDuration !== undefined) style.animationDuration = `${animationDuration}ms`;

  return (
    <div
      className={`tile${bounce ? ' bounce' : ''}`}
      data-state={state}
      style={style}
    >
      {letter?.toUpperCase()}
    </div>
  );
}
