import { Modal } from '@/components/Modal';

interface ArcadeResultModalProps {
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  children: React.ReactNode;
}

export function ArcadeResultModal({ open, onClose, onNext, children }: ArcadeResultModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Puzzle Complete">
      {children}
      <div className="divider" />
      <div className="arcade-result-actions">
        <button className="arcade-btn-outline" onClick={onClose}>Close</button>
        <button className="arcade-btn-next" onClick={onNext}>Next Puzzle →</button>
      </div>
    </Modal>
  );
}
