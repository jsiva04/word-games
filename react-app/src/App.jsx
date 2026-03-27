import { useState, useEffect } from 'react'
import Header from './components/Header'
import Navigation from './components/Navigation'
import Wordle from './components/Wordle'
import Connections from './components/Connections'
import Strands from './components/Strands'
import Toast from './components/Toast'
import './styles/index.css'

export default function App() {
  const [currentGame, setCurrentGame] = useState('wordle')
  const [navOpen, setNavOpen] = useState(false)
  const [toasts, setToasts] = useState([])

  const games = [
    { id: 'wordle', name: 'Wordle', icon: 'grid-3x3' },
    { id: 'connections', name: 'Connections', icon: 'grid-2x2' },
    { id: 'strands', name: 'Strands', icon: 'grid-3x2' }
  ]

  const addToast = (message, duration = 2000) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }

  const handleGameSelect = (gameId) => {
    setCurrentGame(gameId)
    setNavOpen(false)
  }

  const closeNav = () => {
    setNavOpen(false)
  }

  const renderGame = () => {
    switch (currentGame) {
      case 'wordle':
        return <Wordle key="wordle" addToast={addToast} />
      case 'connections':
        return <Connections key="connections" addToast={addToast} />
      case 'strands':
        return <Strands key="strands" addToast={addToast} />
      default:
        return null
    }
  }

  const currentGameName = games.find(g => g.id === currentGame)?.name || ''

  return (
    <div className="app-container">
      <Header
        title={currentGameName}
        onMenuClick={() => setNavOpen(!navOpen)}
        onStatsClick={() => addToast('Stats feature coming soon')}
      />

      <Navigation
        isOpen={navOpen}
        games={games}
        currentGame={currentGame}
        onGameSelect={handleGameSelect}
        onClose={closeNav}
      />

      <main className="game" role="main">
        {renderGame()}
      </main>

      <Toast toasts={toasts} />

      {navOpen && <div className="nav-overlay open" onClick={closeNav} />}
    </div>
  )
}
