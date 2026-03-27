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
        <p>Find all the theme words hidden in the letter grid.</p>

        <div className="strands-help-examples">
          <div className="strands-help-step">
            <div className="strands-help-icon theme-icon">●</div>
            <p><strong>Theme words</strong> are highlighted in blue when found.</p>
          </div>
          <div className="strands-help-step">
            <div className="strands-help-icon spangram-icon">✦</div>
            <p>
              The <strong>Spangram</strong> is a special word that spans the grid.
              It&apos;s highlighted in gold.
            </p>
          </div>
        </div>

        <div className="divider" />

        <p>Swipe or drag across adjacent letters to select a word path.</p>
        <p>Letters can connect horizontally, vertically, or diagonally.</p>
        <p>Find all theme words + the spangram to complete the puzzle.</p>

        <div className="divider" />

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          A new Strands puzzle is available each day.
        </p>
      </div>
    </Modal>
  );
}
