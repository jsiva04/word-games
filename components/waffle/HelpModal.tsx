'use client';

import { Modal } from '@/components/Modal';
import { MAX_SWAPS } from '@/data/waffle';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to Play">
      <div className="help-section">
        <p>
          Rearrange the letters to make <strong>6 words</strong> — three across and
          three down — by swapping pairs of letters.
        </p>

        <div className="divider" />

        <div className="waffle-help-colors">
          <div className="waffle-help-row">
            <div className="waffle-cell waffle-letter waffle-green waffle-help-cell">A</div>
            <p><strong>Green</strong> — correct position. These letters are locked.</p>
          </div>
          <div className="waffle-help-row">
            <div className="waffle-cell waffle-letter waffle-yellow waffle-help-cell">B</div>
            <p><strong>Yellow</strong> — belongs to a crossing word at this position, but wrong spot.</p>
          </div>
          <div className="waffle-help-row">
            <div className="waffle-cell waffle-letter waffle-white waffle-help-cell">C</div>
            <p><strong>White</strong> — not in any word passing through this cell.</p>
          </div>
        </div>

        <div className="divider" />

        <p>
          Tap a letter to select it, then tap another to swap them. You have{' '}
          <strong>{MAX_SWAPS} swaps</strong>.
        </p>
        <p>Green letters cannot be moved.</p>

        <div className="divider" />

        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          A new Waffle puzzle is available each day.
        </p>
      </div>
    </Modal>
  );
}
