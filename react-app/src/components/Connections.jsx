import { useState, useEffect } from 'react'
import { useConnections } from '../hooks/useConnections'
import { CONN_PUZZLES, getConnPuzzleIndex } from '../data/connections'

export default function Connections({ addToast }) {
  const { state, toggleTile, deselectAll, shuffleTiles, submitGuess, loadStats } = useConnections()
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState(null)

  const puzzle = CONN_PUZZLES[getConnPuzzleIndex()]

  useEffect(() => {
    if (state.gameOver && !showStats) {
      setTimeout(() => {
        setStats(loadStats())
        setShowStats(true)
      }, 500)
    }
  }, [state.gameOver, loadStats])

  const handleSubmit = () => {
    submitGuess(puzzle)
  }

  const solvedWords = new Set()
  state.solved.forEach(color => {
    const cat = puzzle.categories.find(c => c.color === color)
    if (cat) cat.words.forEach(w => solvedWords.add(w))
  })

  const remaining = state.words.filter(w => !solvedWords.has(w.word))

  return (
    <div className="conn-game">
      <div className="conn-instructions">
        Group four items that share something in common.
      </div>

      <div className="conn-board">
        {state.solved.map(color => {
          const cat = puzzle.categories.find(c => c.color === color)
          return (
            <div key={color} className="conn-solved-row" data-color={color}>
              <div className="conn-solved-name">{cat.name}</div>
              <div className="conn-solved-words">{cat.words.join(', ')}</div>
            </div>
          )
        })}

        {remaining.length > 0 && (
          <div className="conn-grid">
            {remaining.map(item => (
              <button
                key={item.word}
                className={`conn-tile ${state.selected.includes(item.word) ? 'selected' : ''}`}
                onClick={() => toggleTile(item.word)}
                disabled={state.gameOver}
              >
                {item.word}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="conn-controls">
        <div className="conn-mistakes">
          Mistakes:
          <div className="conn-mistake-dots">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`conn-dot ${i < state.mistakes ? 'used' : ''}`}
              />
            ))}
          </div>
        </div>
        <button
          className="conn-btn"
          onClick={shuffleTiles}
          disabled={state.gameOver}
        >
          Shuffle
        </button>
        <button
          className="conn-btn"
          onClick={deselectAll}
          disabled={state.selected.length === 0 || state.gameOver}
        >
          Deselect
        </button>
        <button
          className="conn-btn primary"
          onClick={handleSubmit}
          disabled={state.selected.length !== 4 || state.gameOver}
        >
          Submit
        </button>
      </div>

      {showStats && stats && (
        <div className="modal-overlay open" onClick={() => setShowStats(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Statistics</h2>
              <button className="modal-close" onClick={() => setShowStats(false)}>×</button>
            </div>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-value">{stats.played}</div>
                <div className="stat-label">Played</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.played ? Math.round((stats.wins / stats.played) * 100) : 0}</div>
                <div className="stat-label">Win %</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.streak}</div>
                <div className="stat-label">Streak</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{stats.maxStreak}</div>
                <div className="stat-label">Max</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
