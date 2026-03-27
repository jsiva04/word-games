import { useState, useCallback } from 'react'
import { CONN_EPOCH, getConnPuzzleIndex, CONN_PUZZLES } from '../data/connections'

const MAX_MISTAKES = 4
const COLOR_ORDER = ['yellow', 'green', 'blue', 'purple']

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function useConnections() {
  const STORAGE_KEY = 'connectionsState'
  const STATS_KEY = 'connectionsStats'

  const makeState = useCallback((puzzle, idx) => {
    const words = []
    puzzle.categories.forEach(cat => {
      cat.words.forEach(w => {
        words.push({ word: w, color: cat.color })
      })
    })
    return {
      puzzleIndex: idx,
      words: shuffle(words),
      selected: [],
      solved: [],
      guesses: [],
      mistakes: 0,
      gameOver: false,
      won: false,
    }
  }, [])

  const [state, setState] = useState(() => {
    const puzzleIdx = getConnPuzzleIndex()
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.puzzleIndex === puzzleIdx) return s
      }
    } catch (e) {}
    return makeState(CONN_PUZZLES[puzzleIdx], puzzleIdx)
  })

  const saveState = useCallback((newState) => {
    setState(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }, [])

  const loadStats = useCallback(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY)
      if (raw) return JSON.parse(raw)
    } catch (e) {}
    return { played: 0, wins: 0, streak: 0, maxStreak: 0 }
  }, [])

  const recordResult = useCallback((won) => {
    const stats = loadStats()
    stats.played++
    if (won) {
      stats.wins++
      stats.streak++
      stats.maxStreak = Math.max(stats.maxStreak, stats.streak)
    } else {
      stats.streak = 0
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
    return stats
  }, [loadStats])

  const toggleTile = useCallback((word) => {
    setState(prev => {
      if (prev.gameOver) return prev
      const idx = prev.selected.indexOf(word)
      let newSelected
      if (idx !== -1) {
        newSelected = prev.selected.filter((_, i) => i !== idx)
      } else {
        if (prev.selected.length >= 4) return prev
        newSelected = [...prev.selected, word]
      }
      const newState = { ...prev, selected: newSelected }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  }, [])

  const deselectAll = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, selected: [] }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  }, [])

  const shuffleTiles = useCallback(() => {
    setState(prev => {
      const solvedColors = new Set(prev.solved)
      const remaining = prev.words.filter(w => !solvedColors.has(w.color))
      const shuffled = shuffle(remaining)
      const newWords = prev.words.filter(w => solvedColors.has(w.color)).concat(shuffled)
      const newState = { ...prev, words: newWords }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
      return newState
    })
  }, [])

  const submitGuess = useCallback((puzzle) => {
    setState(prev => {
      if (prev.selected.length !== 4 || prev.gameOver) return prev

      const sel = prev.selected.slice()
      const colorCounts = {}
      COLOR_ORDER.forEach(c => colorCounts[c] = 0)
      sel.forEach(word => {
        const item = prev.words.find(w => w.word === word)
        if (item) colorCounts[item.color]++
      })

      const guessColors = sel.map(word => {
        const item = prev.words.find(w => w.word === word)
        return item ? item.color : 'absent'
      })
      const newGuesses = [...prev.guesses, { words: sel, colors: guessColors }]

      let correctColor = null
      COLOR_ORDER.forEach(c => {
        if (colorCounts[c] === 4) correctColor = c
      })

      if (correctColor) {
        const newSolved = [...prev.solved, correctColor]
        const newState = {
          ...prev,
          solved: newSolved,
          selected: [],
          guesses: newGuesses,
        }
        if (newSolved.length === 4) {
          newState.gameOver = true
          newState.won = true
          recordResult(true)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
        return newState
      } else {
        const maxCount = Math.max(...COLOR_ORDER.map(c => colorCounts[c]))
        let newState = {
          ...prev,
          mistakes: prev.mistakes + 1,
          selected: [],
          guesses: newGuesses,
        }
        if (newState.mistakes >= MAX_MISTAKES) {
          const solvedSet = new Set(prev.solved)
          const allSolved = []
          COLOR_ORDER.forEach(color => {
            if (!solvedSet.has(color)) allSolved.push(color)
          })
          newState.solved = [...prev.solved, ...allSolved]
          newState.gameOver = true
          newState.won = false
          recordResult(false)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
        return newState
      }
    })
  }, [recordResult])

  return {
    state,
    setState: saveState,
    toggleTile,
    deselectAll,
    shuffleTiles,
    submitGuess,
    loadStats,
    getConnPuzzleIndex,
  }
}
