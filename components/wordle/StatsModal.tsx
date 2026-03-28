import { Modal } from '@/components/Modal';
import { Countdown } from '@/components/Countdown';
import { WordleState, WordleStats, MAX_GUESSES } from '@/lib/wordle';

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  state: WordleState | null;
  stats: WordleStats;
  onShare: () => void;
  hardMode: boolean;
  onToggleHardMode: () => void;
}

function formatTime(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function StatsModal({ open, onClose, state, stats, onShare, hardMode, onToggleHardMode }: StatsModalProps) {
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
      {stats.bestTime !== undefined && (
        <div className="solve-times">
          <div className="stat-item">
            <div className="stat-value stat-value--sm">{formatTime(stats.bestTime)}</div>
            <div className="stat-label">Best Time</div>
          </div>
          {stats.lastTime !== undefined && (
            <div className="stat-item">
              <div className="stat-value stat-value--sm">{formatTime(stats.lastTime)}</div>
              <div className="stat-label">Last Time</div>
            </div>
          )}
        </div>
      )}
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
      <div className="divider" />
      <div className="settings-row">
        <div className="settings-row-info">
          <span className="settings-row-label">Hard Mode</span>
          <span className="settings-row-desc">Revealed hints must be used in future guesses</span>
        </div>
        <button
          className={`toggle${hardMode ? ' on' : ''}`}
          onClick={onToggleHardMode}
          aria-pressed={hardMode}
          aria-label="Toggle hard mode"
        />
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
