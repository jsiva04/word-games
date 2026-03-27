import { Modal } from '@/components/Modal';
import { Countdown } from '@/components/Countdown';
import { WordleState, WordleStats, MAX_GUESSES } from '@/lib/wordle';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  state: WordleState | null;
  stats: WordleStats;
  onShare: () => void;
}

export function StatsModal({ open, onClose, state, stats, onShare }: StatsModalProps) {
  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  const maxVal = Math.max(...stats.distribution, 1);

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
      <div className="guess-distribution">
        <div className="dist-label">Guess Distribution</div>
        {Array.from({ length: MAX_GUESSES }, (_, i) => {
          const count = stats.distribution[i];
          const pct = Math.max(7, Math.round((count / maxVal) * 100));
          const isHighlight = state?.won && state.guesses.length === i + 1;
          return (
            <div key={i} className="dist-row">
              <div className="dist-num">{i + 1}</div>
              <div className="dist-bar-wrap">
                <div
                  className={`dist-bar${isHighlight ? ' highlight' : ''}`}
                  style={{ width: `${pct}%` }}
                >
                  {count}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {state?.gameOver && (
        <>
          <div className="divider" />
          <div className="result-section">
            <Countdown label="Next Wordle" />
            <button className="share-btn" onClick={onShare}>Share</button>
          </div>
        </>
      )}
    </Modal>
  );
}
