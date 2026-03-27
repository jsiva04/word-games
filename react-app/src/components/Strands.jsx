import { useState, useEffect, useRef } from 'react'
import { useStrands } from '../hooks/useStrands'
import { STRANDS_PUZZLES, getStrandsPuzzleIndex } from '../data/strands'

export default function Strands({ addToast }) {
  const { state, setSelectedPositions, clearSelection, submitSelection, loadStats } = useStrands()
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState(null)
  const dragStateRef = useRef({ isDragging: false, startRow: null, startCol: null })

  const puzzle = STRANDS_PUZZLES[getStrandsPuzzleIndex()]

  const isAdjacent = (pos1, pos2) => {
    const [r1, c1] = pos1
    const [r2, c2] = pos2
    return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && (r1 !== r2 || c1 !== c2)
  }

  const isPositionSelected = (row, col) => {
    return state.selectedPositions.some(([r, c]) => r === row && c === col)
  }

  const handleMouseDown = (row, col) => {
    if (state.gameOver) return
    dragStateRef.current = { isDragging: true, startRow: row, startCol: col }
    setSelectedPositions([[row, col]])
  }

  const handleMouseEnter = (row, col) => {
    if (!dragStateRef.current.isDragging || state.gameOver) return
    
    const pos = [row, col]
    const lastPos = state.selectedPositions[state.selectedPositions.length - 1] || [dragStateRef.current.startRow, dragStateRef.current.startCol]
    
    // Check if adjacent
    if (!isAdjacent(lastPos, pos)) return
    
    // Check if already in path
    if (state.selectedPositions.some(([r, c]) => r === row && c === col)) return
    
    setSelectedPositions([...state.selectedPositions, pos])
  }

  const handleMouseUp = () => {
    dragStateRef.current.isDragging = false
  }

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [])

  const handleSubmit = () => {
    submitSelection(
      puzzle,
      (word) => {
        addToast(`Found: ${word}`, 800)
      },
      () => {
        addToast('Spangram found!', 1000)
      },
      (newState) => {
        if (newState.gameOver) {
          setStats(loadStats())
          setShowStats(true)
        }
      }
    )
  }

  return (
    <div className="strands-container">
      <div className="strands-board">
        {puzzle.grid.map((row, r) => (
          <div key={r} style={{ display: 'flex', gap: '5px' }}>
            {row.map((letter, c) => (
              <button
                key={`${r}-${c}`}
                className={`strands-tile ${isPositionSelected(r, c) ? 'selected' : ''}`}
                onMouseDown={() => handleMouseDown(r, c)}
                onMouseEnter={() => handleMouseEnter(r, c)}
                disabled={state.gameOver}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="strands-info">
        <div className="strands-found">
          <h3>Found Words:</h3>
          <div className="strands-found-list">
            {state.foundWords.map(idx => (
              <div key={idx} className="strands-found-item">
                {puzzle.themeWords[idx].word}
              </div>
            ))}
          </div>
        </div>

        <div className="strands-spangram">
          <div className={`strands-spangram-display ${state.foundSpangram ? 'found' : ''}`}>
            {state.foundSpangram ? puzzle.spangram.word : '[SPANGRAM]'}
          </div>
        </div>
      </div>

      <div className="conn-controls">
        <button
          className="conn-btn"
          onClick={clearSelection}
          disabled={state.selectedPositions.length === 0 || state.gameOver}
        >
          Clear
        </button>
        <button
          className="conn-btn primary"
          onClick={handleSubmit}
          disabled={state.selectedPositions.length === 0 || state.gameOver}
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
