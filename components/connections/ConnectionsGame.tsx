'use client';

import { Header } from '@/components/Header';
import { ToastContainer } from '@/components/Toast';
import { ConnectionsBoard } from './ConnectionsBoard';
import { HelpModal } from './HelpModal';
import { StatsModal } from './StatsModal';
import { useConnections } from '@/hooks/useConnections';
import { useToast } from '@/hooks/useToast';
import { CONN_PUZZLES } from '@/data/connections';
import { MAX_MISTAKES } from '@/lib/connections';

function HelpIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  );
}

function StatsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
  );
}

export function ConnectionsGame() {
  const { toasts, showToast } = useToast();
  const {
    state,
    puzzleIndex,
    shakingWords,
    showStats,
    showHelp,
    stats,
    toggleSelect,
    deselectAll,
    shuffleTiles,
    submitGuess,
    handleShare,
    openStats,
    closeStats,
    openHelp,
    closeHelp,
  } = useConnections(showToast);

  const puzzle = CONN_PUZZLES[puzzleIndex];

  const headerButtons = (
    <>
      <button className="icon-btn" onClick={openHelp} aria-label="How to play">
        <HelpIcon />
      </button>
      <button className="icon-btn" onClick={openStats} aria-label="Statistics">
        <StatsIcon />
      </button>
    </>
  );

  const mistakesRemaining = state ? MAX_MISTAKES - state.mistakes : MAX_MISTAKES;

  return (
    <>
      <Header title="Connections" rightButtons={headerButtons} />
      <ToastContainer toasts={toasts} />

      <main className="view active">
        <div className="conn-game">
          <p className="conn-instructions">
            Create four groups of four &mdash; <span>#{puzzleIndex}</span>
          </p>

          {state && puzzle && (
            <ConnectionsBoard
              state={state}
              puzzle={puzzle}
              shakingWords={shakingWords}
              onToggle={toggleSelect}
            />
          )}

          <div className="conn-controls">
            <div className="conn-mistakes">
              Mistakes remaining
              <div className="conn-mistake-dots">
                {Array.from({ length: MAX_MISTAKES }, (_, i) => (
                  <div
                    key={i}
                    className={`conn-dot${i >= mistakesRemaining ? ' used' : ''}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="conn-controls">
            <button
              className="conn-btn"
              onClick={shuffleTiles}
              disabled={!state || state.gameOver}
            >
              Shuffle
            </button>
            <button
              className="conn-btn"
              onClick={deselectAll}
              disabled={!state || state.selected.length === 0 || state.gameOver}
            >
              Deselect all
            </button>
            <button
              className="conn-btn primary"
              onClick={submitGuess}
              disabled={!state || state.selected.length !== 4 || state.gameOver}
            >
              Submit
            </button>
          </div>
        </div>
      </main>

      <HelpModal open={showHelp} onClose={closeHelp} />
      <StatsModal
        open={showStats}
        onClose={closeStats}
        state={state}
        stats={stats}
        onShare={handleShare}
      />
    </>
  );
}
