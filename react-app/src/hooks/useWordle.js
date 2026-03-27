import { useState, useCallback, useEffect } from 'react'
import { ANSWER_LIST, VALID_WORDS } from '../data/words'

const EPOCH = new Date(2021, 5, 19)
const MAX_GUESSES = 6
const WORD_LENGTH = 5
const FLIP_DURATION = 500
const FLIP_DELAY = 300

function getTodayIndex() {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor((today - EPOCH) / 86400000)
}

function getDailyWord() {
  const idx = getTodayIndex() % ANSWER_LIST.length
  return ANSWER_LIST[idx].toLowerCase()
}

export function useWordle() {
  const STORAGE_KEY = 'wordleState'
  const STATS_KEY = 'wordleStats'

  const [state, setState] = useState(() => {
    const word = getDailyWord()
    const saved = (() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return null
        const s = JSON.parse(raw)
        if (s.dayIndex === getTodayIndex()) {
          return { ...s, animating: false }
        }
      } catch (e) {
        console.error('Error loading state:', e)
      }
      return null
    })()

    return saved || {
      word,
      guesses: [],
      currentGuess: '',
      gameOver: false,
      won: false,
      dayIndex: getTodayIndex(),
      animating: false,
    }
  })

  const saveState = useCallback((newState) => {
    setState(newState)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState))
  }, [])

  const loadStats = useCallback(() => {
    try {
      const raw = localStorage.getItem(STATS_KEY)
      if (raw) return JSON.parse(raw)
    } catch {}
    return { played: 0, wins: 0, streak: 0, maxStreak: 0, distribution: [0,0,0,0,0,0] }
  }, [])

  const recordResult = useCallback((won, guessCount) => {
    const stats = loadStats()
    stats.played++
    if (won) {
      stats.wins++
      stats.streak++
      stats.maxStreak = Math.max(stats.maxStreak, stats.streak)
      stats.distribution[guessCount - 1]++
    } else {
      stats.streak = 0
    }
    localStorage.setItem(STATS_KEY, JSON.stringify(stats))
    return stats
  }, [loadStats])

  const evaluateGuess = useCallback((guess, answer) => {
    const result = Array.from({ length: WORD_LENGTH }, (_, i) => ({
      letter: guess[i],
      state: 'absent',
    }))

    const answerCounts = {}
    for (const ch of answer) {
      answerCounts[ch] = (answerCounts[ch] || 0) + 1
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess[i] === answer[i]) {
        result[i].state = 'correct'
        answerCounts[guess[i]]--
      }
    }

    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i].state === 'correct') continue
      if (answerCounts[guess[i]] > 0) {
        result[i].state = 'present'
        answerCounts[guess[i]]--
      }
    }

    return result
  }, [])

  const submitGuess = useCallback((guess, onComplete) => {
    if (state.gameOver || state.animating) return

    if (guess.length < WORD_LENGTH) {
      return { error: 'Not enough letters' }
    }

    if (!VALID_WORDS.has(guess)) {
      return { error: 'Not in word list' }
    }

    const newGuesses = [...state.guesses, guess]
    const newState = {
      ...state,
      guesses: newGuesses,
      currentGuess: '',
      animating: true,
    }

    const won = guess === state.word
    if (won) {
      newState.gameOver = true
      newState.won = true
      newState.animating = false
      recordResult(true, newGuesses.length)
    } else if (newGuesses.length >= MAX_GUESSES) {
      newState.gameOver = true
      newState.won = false
      newState.animating = false
      recordResult(false, 0)
    } else {
      newState.animating = false
    }

    saveState(newState)
    onComplete?.(newState)
    return { success: true }
  }, [state, saveState, recordResult])

  const handleKey = useCallback((key) => {
    if (state.gameOver || state.animating) return

    if (key === 'Backspace' || key === 'DELETE') {
      setState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }))
      return
    }

    if (/^[a-zA-Z]$/.test(key) && state.currentGuess.length < WORD_LENGTH) {
      setState(prev => ({
        ...prev,
        currentGuess: prev.currentGuess + key.toLowerCase(),
      }))
    }
  }, [state.gameOver, state.animating, state.currentGuess.length])

  const getTodayIndexValue = useCallback(() => getTodayIndex(), [])

  return {
    state,
    setState: saveState,
    submitGuess,
    handleKey,
    evaluateGuess,
    loadStats,
    getTodayIndex: getTodayIndexValue,
  }
}
