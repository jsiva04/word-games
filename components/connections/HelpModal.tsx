import { Modal } from '@/components/Modal';

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

export function HelpModal({ open, onClose }: HelpModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="How to play">
      <div className="help-section">
        <p>Find four groups of four words that share something in common.</p>
        <p>Select four words and tap <strong>Submit</strong> to check your answer. You have <strong>4 mistakes</strong> before the game ends.</p>
      </div>
      <div className="divider" />
      <div className="help-section">
        <p>Categories are color-coded by difficulty:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          {[
            { color: 'var(--conn-yellow)', label: 'Straightforward' },
            { color: 'var(--conn-green)',  label: 'Medium' },
            { color: 'var(--conn-blue)',   label: 'Tricky' },
            { color: 'var(--conn-purple)', label: 'Very tricky' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem' }}>
              <div style={{ width: '18px', height: '18px', borderRadius: '4px', background: color, flexShrink: 0 }} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="divider" />
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
        A new puzzle is available each day.
      </p>
    </Modal>
  );
}
