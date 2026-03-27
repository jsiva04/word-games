'use client';

import { Modal } from '@/components/Modal';
import { Countdown } from '@/components/Countdown';
import { StrandsStats } from '@/lib/strands';
import { StrandsState } from '@/lib/strands';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  state: StrandsState | null;
  stats: StrandsStats;
}

export function StatsModal({ open, onClose, state, stats }: StatsModalProps) {
  const winPct = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;

  return (
    <Modal open={open} onClose={onClose} title="Statistics">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-value">{stats.played}</div>
          <div className="stat-label">Played</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{winPct}</div>
          <div className="stat-label">Win %</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Current Streak</div>
        </div>
        <div className="stat-item">
          <div className="stat-value">{stats.maxStreak}</div>
          <div className="stat-label">Max Streak</div>
        </div>
      </div>

      {state?.gameOver && (
        <>
          <div className="divider" />
          <div className="result-section">
            <Countdown label="Next Strands" />
          </div>
        </>
      )}
    </Modal>
  );
}
