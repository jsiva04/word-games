'use client';

import { Modal } from '@/components/Modal';

interface GuessesModalProps {
  open: boolean;
  onClose: () => void;
  guesses: string[];
}

export function GuessesModal({ open, onClose, guesses }: GuessesModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Guesses">
      <div className="sq-guesses-modal">
        {guesses.length === 0 ? (
          <p className="sq-guesses-empty">No guesses yet.</p>
        ) : (
          <div className="sq-guesses-grid">
            {guesses.map((guess, gi) => (
              <div key={gi} className="sq-guesses-row">
                {guess.split('').map((letter, li) => (
                  <div key={li} className="sq-guesses-tile">{letter}</div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
