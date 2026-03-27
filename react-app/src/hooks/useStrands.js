import { useState, useCallback } from 'react'
import { getStrandsPuzzleIndex, STRANDS_PUZZLES } from '../data/strands'

export function useStrands() {
  const STORAGE_KEY = 'strandsState'
  const STATS_KEY = 'strandsStats'

  const makeState = useCallback((puzzle, idx) => {
    return {
      puzzleIndex: idx,
      foundWords: [],
      foundSpangram: false,
      selectedPositions: [],
      gameOver: false,
      won: false,
    }
  }, [])

  const [state, setState] = useState(() => {
    const puzzleIdx = getStrandsPuzzleIndex()
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const s = JSON.parse(raw)
        if (s.puzzleIndex === puzzleIdx) return s
      }
    } catch (e) {}
    return makeState(STRANDS_PUZZLES[puzzleIdx], puzzleIdx)
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

  const setSelectedPositions = useCallback((positions) => {
    setState(prev => ({ ...prev, selectedPositions: positions }))
  }, [])

  const clearSelection = useCallback(() => {
    setState(prev => ({ ...prev, selectedPositions: [] }))
  }, [])

  const submitSelection = useCallback((puzzle, onWordFound, onSpangramFound, onComplete) => {
    setState(prev => {
      if (prev.selectedPositions.length === 0) return prev

      const selectedLetters = prev.selectedPositions
        .map(([r, c]) => puzzle.grid[r][c])
        .join('')

      // Check theme words
      for (let i = 0; i < puzzle.themeWords.length; i++) {
        if (!prev.foundWords.includes(i) && puzzle.themeWords[i].word === selectedLetters) {
          const newFoundWords = [...prev.foundWords, i]
          let newState = {
            ...prev,
            foundWords: newFoundWords,
            selectedPositions: [],
          }
          if (newFoundWords.length === puzzle.themeWords.length && prev.foundSpangram) {
            newState.gameOver = true
            newState.won = true
            recordResult(true)
            onComplete?.(newState)
          }
          saveState(newState)
          onWordFound?.(selectedLetters)
          return newState
        }
      }

      // Check spangram
      if (!prev.foundSpangram && puzzle.spangram.word === selectedLetters) {
        let newState = {
          ...prev,
          foundSpangram: true,
          selectedPositions: [],
        }
        if (prev.foundWords.length === puzzle.themeWords.length) {
          newState.gameOver = true
          newState.won = true
          recordResult(true)
          onComplete?.(newState)
        }
        saveState(newState)
        onSpangramFound?.()
        return newState
      }

      return prev
    })
  }, [saveState, recordResult])

  return {
    state,
    setState: saveState,
    setSelectedPositions,
    clearSelection,
    submitSelection,
    loadStats,
  }
}
