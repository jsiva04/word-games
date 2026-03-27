'use client';

import { Modal } from '@/components/Modal';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to Play">
      <div className="help-section">
        <p>Solve <strong>5 words</strong> simultaneously using shared guesses.</p>

        <div className="divider" />

        <p>Each guess is a valid 5-letter word. It&apos;s evaluated against <em>all 5</em> target words at once.</p>

        <div className="help-examples">
          <div className="help-example">
            <div className="help-tiles">
              <div className="help-tile correct">R</div>
              <div className="help-tile absent">O</div>
              <div className="help-tile present">A</div>
              <div className="help-tile absent">D</div>
              <div className="help-tile absent">S</div>
            </div>
            <p><strong>Green</strong> = right letter, right position (for that word).</p>
            <p><strong>Yellow</strong> = letter in that word, wrong position.</p>
            <p><strong>Gray</strong> = letter not in that word.</p>
          </div>
        </div>

        <div className="divider" />

        <p>Solved words are shown with their letters revealed in green.</p>
        <p>You have <strong>9 guesses</strong> to solve all 5 words.</p>

        <div className="divider" />

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          A new Squareword puzzle is available each day.
        </p>
      </div>
    </Modal>
  );
}
