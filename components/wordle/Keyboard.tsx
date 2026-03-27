import { KeyState } from '@/hooks/useWordle';

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['ENTER','z','x','c','v','b','n','m','DELETE'],
];

const DeleteIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
    <line x1="18" y1="9" x2="12" y2="15"/>
    <line x1="12" y1="9" x2="18" y2="15"/>
  </svg>
);

interface KeyboardProps {
  keyStates: KeyState;
  onKey: (key: string) => void;
}

export function Keyboard({ keyStates, onKey }: KeyboardProps) {
  return (
    <div className="keyboard" role="group" aria-label="Keyboard">
      {ROWS.map((row, ri) => (
        <div key={ri} className="key-row">
          {row.map((key) => {
            const isWide = key === 'ENTER' || key === 'DELETE';
            const state = keyStates[key.toLowerCase()];
            return (
              <button
                key={key}
                className={`key${isWide ? ' wide' : ''}`}
                data-key={key}
                data-state={state}
                aria-label={key === 'DELETE' ? 'Delete' : undefined}
                onClick={() => onKey(key)}
              >
                {key === 'DELETE' ? DeleteIcon : key === 'ENTER' ? 'Enter' : key.toUpperCase()}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
