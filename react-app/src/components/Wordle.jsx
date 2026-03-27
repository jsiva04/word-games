import { useState, useEffect } from 'react'
import { useWordle } from '../hooks/useWordle'
import { ANSWER_LIST } from '../data/words'

const WORD_LENGTH = 5
const MAX_GUESSES = 6
const KEY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
]

function getTodayIndex() {
  const EPOCH = new Date(2021, 5, 19)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((today - EPOCH) / 86400000)
}

export default function Wordle({ addToast }) {
  const { state, setState, submitGuess, handleKey, evaluateGuess, loadStats } = useWordle()
  const [keyStates, setKeyStates] = useState({})
  const [showStats, setShowStats] = useState(false)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      handleKey(e.key)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKey])

  const handleSubmit = () => {
    const result = submitGuess(state.currentGuess, (newState) => {
      if (newState.gameOver) {
        setStats(loadStats())
        setShowStats(true)
      }
    })
    if (result.error) {
      addToast(result.error)
    }
  }

  const currentRowIdx = state.guesses.length
  const allRows = [...state.guesses]
  if (currentRowIdx < MAX_GUESSES) {
    allRows.push(state.currentGuess)
  }

  const renderBoard = () => {
    return (
      <div className="board-container">
        <div className="board">
          {Array.from({ length: MAX_GUESSES }).map((_, rowIdx) => (
            <div key={rowIdx} className="board-row">
              {Array.from({ length: WORD_LENGTH }).map((_, colIdx) => {
                const guess = allRows[rowIdx] || ''
                const letter = guess[colIdx] || ''
                let tileState = 'empty'
                
                if (letter) {
                  if (rowIdx < state.guesses.length) {
                    const evaluation = evaluateGuess(state.guesses[rowIdx], state.word)
                    tileState = evaluation[colIdx].state
                  } else {
                    tileState = 'tbd'
                  }
                }

                return (
                  <div
                    key={`${rowIdx}-${colIdx}`}
                    className="tile"
                    data-state={tileState}
                  >
                    {letter.toUpperCase()}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const handleKeyClick = (key) => {
    if (key === 'ENTER') {
      handleSubmit()
    } else if (key === 'BACKSPACE') {
      handleKey('Backspace')
    } else {
      handleKey(key.toLowerCase())
    }
  }

  return (
    <div className="wordle-container">
      {renderBoard()}

      <div className="keyboard">
        {KEY_ROWS.map((row, idx) => (
          <div key={idx} className="key-row">
            {idx === 2 && (
              <button
                className="key wide"
                onClick={() => handleKeyClick('ENTER')}
                disabled={state.gameOver}
              >
                Enter
              </button>
            )}
            {row.map(key => (
              <button
                key={key}
                className="key"
                data-state={keyStates[key.toLowerCase()]}
                onClick={() => handleKeyClick(key)}
                disabled={state.gameOver}
              >
                {key}
              </button>
            ))}
            {idx === 2 && (
              <button
                className="key wide"
                onClick={() => handleKeyClick('BACKSPACE')}
                disabled={state.gameOver}
              >
                Back
              </button>
            )}
          </div>
        ))}
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
            <div className="divider"></div>
            <div className="guess-distribution">
              <div className="dist-label">Guess Distribution</div>
              {stats.distribution.map((count, i) => (
                <div key={i} className="dist-row">
                  <div className="dist-num">{i + 1}</div>
                  <div className="dist-bar-wrap">
                    <div
                      className={`dist-bar ${state.won && state.guesses.length === i + 1 ? 'highlight' : ''}`}
                      style={{ width: Math.max(7, Math.round((count / Math.max(...stats.distribution, 1)) * 100)) + '%' }}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
