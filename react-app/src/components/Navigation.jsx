export default function Navigation({ isOpen, games, currentGame, onGameSelect, onClose }) {
  return (
    <>
      <div className={`nav-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <nav className={`nav-drawer ${isOpen ? 'open' : ''}`}>
        <div className="nav-drawer-header">
          <span className="nav-drawer-title">Games</span>
          <button 
            className="icon-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <ul className="nav-list">
          {games.map(game => (
            <li key={game.id}>
              <button
                className={`nav-item ${currentGame === game.id ? 'active' : ''}`}
                onClick={() => onGameSelect(game.id)}
              >
                <span className="nav-item-icon">
                  {game.icon === 'grid-3x3' && (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="4" cy="4" r="2" />
                      <circle cx="12" cy="4" r="2" />
                      <circle cx="20" cy="4" r="2" />
                      <circle cx="4" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="20" cy="12" r="2" />
                      <circle cx="4" cy="20" r="2" />
                      <circle cx="12" cy="20" r="2" />
                      <circle cx="20" cy="20" r="2" />
                    </svg>
                  )}
                  {game.icon === 'grid-2x2' && (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="6" cy="6" r="2.5" />
                      <circle cx="18" cy="6" r="2.5" />
                      <circle cx="6" cy="18" r="2.5" />
                      <circle cx="18" cy="18" r="2.5" />
                    </svg>
                  )}
                  {game.icon === 'grid-3x2' && (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="3" cy="4" r="1.5" />
                      <circle cx="9" cy="4" r="1.5" />
                      <circle cx="15" cy="4" r="1.5" />
                      <circle cx="21" cy="4" r="1.5" />
                      <circle cx="3" cy="14" r="1.5" />
                      <circle cx="9" cy="14" r="1.5" />
                      <circle cx="15" cy="14" r="1.5" />
                      <circle cx="21" cy="14" r="1.5" />
                    </svg>
                  )}
                </span>
                <span className="nav-item-name">{game.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  )
}
