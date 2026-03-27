import { Modal } from '@/components/Modal';
import { Countdown } from '@/components/Countdown';
import { ConnectionsState, ConnectionsStats } from '@/lib/connections';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  state: ConnectionsState | null;
  stats: ConnectionsStats;
  onShare: () => void;
}

export function StatsModal({ open, onClose, state, stats, onShare }: StatsModalProps) {
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

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
      <div className="divider" />
      {state && state.guesses.length > 0 && (
        <div className="conn-result-grid">
          {state.guesses.map((guess, i) => (
            <div key={i} className="conn-result-row">
              {guess.colors.map((color, j) => (
                <div key={j} className="conn-result-dot" data-color={color} />
              ))}
            </div>
          ))}
        </div>
      )}
      {state?.gameOver && (
        <>
          <div className="divider" />
          <div className="result-section">
            <Countdown label="Next Puzzle" />
            <button className="share-btn" onClick={onShare}>Share</button>
          </div>
        </>
      )}
    </Modal>
  );
}
