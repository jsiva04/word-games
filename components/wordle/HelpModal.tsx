import { Modal } from '@/components/Modal';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <div className="help-section">
        <p>Guess the <strong>Wordle</strong> in 6 tries.</p>
        <p>Each guess must be a valid 5-letter word. The color of the tiles will change to show how close your guess was.</p>
      </div>
      <div className="divider" />
      <div className="help-examples">
        <div className="help-example">
          <div className="help-tiles">
            <div className="help-tile correct">W</div>
            <div className="help-tile">E</div>
            <div className="help-tile">A</div>
            <div className="help-tile">R</div>
            <div className="help-tile">Y</div>
          </div>
          <p><strong>W</strong> is in the word and in the correct spot.</p>
        </div>
        <div className="help-example">
          <div className="help-tiles">
            <div className="help-tile">P</div>
            <div className="help-tile present">I</div>
            <div className="help-tile">L</div>
            <div className="help-tile">L</div>
            <div className="help-tile">S</div>
          </div>
          <p><strong>I</strong> is in the word but in the wrong spot.</p>
        </div>
        <div className="help-example">
          <div className="help-tiles">
            <div className="help-tile">V</div>
            <div className="help-tile">A</div>
            <div className="help-tile">G</div>
            <div className="help-tile absent">U</div>
            <div className="help-tile">E</div>
          </div>
          <p><strong>U</strong> is not in the word in any spot.</p>
        </div>
      </div>
      <div className="divider" />
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        A new Wordle is available each day.
      </p>
    </Modal>
  );
}
