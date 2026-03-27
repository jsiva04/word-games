// ─── Constants ───────────────────────────────────────────────────────────────
const STRANDS_VIEW = 'strands-view';

// Drag state
var dragState = {
  isDragging: false,
  dragPath: [],  // positions during drag
  puzzle: null,
  state: null,
};

// ─── Storage ──────────────────────────────────────────────────────────────────
const STRANDS_STATE_KEY = 'strandsState';
const STRANDS_STATS_KEY = 'strandsStats';

function loadStrandsState() {
  try {
    var raw = localStorage.getItem(STRANDS_STATE_KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (s.puzzleIndex === getStrandsPuzzleIndex()) return s;
  } catch(e) {}
  return null;
}

function saveStrandsState(state) {
  localStorage.setItem(STRANDS_STATE_KEY, JSON.stringify(state));
}

function loadStrandsStats() {
  try {
    var raw = localStorage.getItem(STRANDS_STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
}

function saveStrandsStats(stats) {
  localStorage.setItem(STRANDS_STATS_KEY, JSON.stringify(stats));
}

function recordStrandsResult(won) {
  var stats = loadStrandsStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  saveStrandsStats(stats);
  return stats;
}

// ─── State helpers ────────────────────────────────────────────────────────────
function makeStrandsState(puzzle, idx) {
  return {
    puzzleIndex: idx,
    foundWords: [],        // array of found word indices
    foundSpangram: false,  // whether spangram is found
    selectedPositions: [], // array of [row, col] for current selection
    gameOver: false,
    won: false,
  };
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function showToast(msg, duration) {
  duration = duration === undefined ? 1500 : duration;
  var container = document.getElementById('toast-container');
  var el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(function() {
    el.classList.add('fade-out');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }, duration);
}

function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ─── Position helpers ────────────────────────────────────────────────────────
function positionsEqual(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function positionsInclude(positions, pos) {
  return positions.some(function(p) { return positionsEqual(p, pos); });
}

function getAdjacent(row, col, gridSize) {
  var adjacent = [];
  for (var r = Math.max(0, row - 1); r <= Math.min(gridSize - 1, row + 1); r++) {
    for (var c = Math.max(0, col - 1); c <= Math.min(gridSize - 1, col + 1); c++) {
      if (r === row && c === col) continue;
      adjacent.push([r, c]);
    }
  }
  return adjacent;
}

// ─── Board rendering ──────────────────────────────────────────────────────────
function renderStrandsBoard(state, puzzle) {
  var board = $('#strands-board');
  var gridSize = puzzle.grid.length;
  
  clearChildren(board);

  for (var r = 0; r < gridSize; r++) {
    for (var c = 0; c < gridSize; c++) {
      var tile = document.createElement('button');
      tile.className = 'strands-tile';
      tile.dataset.row = r;
      tile.dataset.col = c;
      tile.textContent = puzzle.grid[r][c];
      
      if (positionsInclude(state.selectedPositions, [r, c])) {
        tile.classList.add('selected');
      }
      
      // Use closure to properly capture row/col
      (function(row, col) {
        tile.addEventListener('mousedown', function(e) {
          handleTileMouseDown(e, state, puzzle, row, col);
        });
        
        tile.addEventListener('mouseenter', function(e) {
          handleTileMouseEnter(e, state, puzzle, row, col);
        });
        
        tile.addEventListener('click', function(e) {
          handleStrandsTileClick(state, puzzle, row, col);
        });
      })(r, c);
      
      board.appendChild(tile);
    }
  }
  
  updateStrandsUI(state, puzzle);
}

function updateStrandsUI(state, puzzle) {
  // Update found words display
  var foundList = $('#strands-found-list');
  if (foundList) {
    clearChildren(foundList);
    state.foundWords.forEach(function(wordIdx) {
      var word = puzzle.themeWords[wordIdx];
      var item = document.createElement('div');
      item.className = 'strands-found-item';
      item.textContent = word.word;
      foundList.appendChild(item);
    });
  }
  
  // Update spangram display
  var spangramEl = $('#strands-spangram-display');
  if (spangramEl) {
    if (state.foundSpangram) {
      spangramEl.textContent = puzzle.spangram.word;
      spangramEl.classList.add('found');
    }
  }
  
  // Update button states
  var clearBtn = $('#strands-clear');
  if (clearBtn) clearBtn.disabled = state.selectedPositions.length === 0 || state.gameOver;
  
  var submitBtn = $('#strands-submit');
  if (submitBtn) submitBtn.disabled = state.selectedPositions.length === 0 || state.gameOver;
}

// ─── Tile interaction ─────────────────────────────────────────────────────────
function handleTileMouseDown(e, state, puzzle, row, col) {
  if (state.gameOver) return;
  e.preventDefault();
  
  dragState.isDragging = true;
  dragState.dragPath = [[row, col]];
  dragState.puzzle = puzzle;
  dragState.state = state;
  
  // Clear previous selection when starting new drag
  state.selectedPositions = [[row, col]];
  updateDragVisualization(state);
}

function handleTileMouseEnter(e, state, puzzle, row, col) {
  if (!dragState.isDragging || state.gameOver) return;
  if (dragState.state !== state) return;
  
  var pos = [row, col];
  
  // Check if this position is already in the path
  if (positionsInclude(dragState.dragPath, pos)) {
    // Allow backtracking - remove trailing positions if needed
    var lastIdx = dragState.dragPath.length - 1;
    if (!positionsEqual(dragState.dragPath[lastIdx], pos)) {
      // Find where this position is in the path
      var posIdx = dragState.dragPath.findIndex(function(p) { return positionsEqual(p, pos); });
      if (posIdx !== -1 && posIdx === lastIdx - 1) {
        // Backtracking to adjacent tile
        dragState.dragPath.pop();
        dragState.state.selectedPositions.pop();
        updateDragVisualization(dragState.state);
      }
    }
    return;
  }
  
  // Check adjacency to last position in path
  var lastPos = dragState.dragPath[dragState.dragPath.length - 1];
  if (!isAdjacent(lastPos, pos, puzzle.grid.length)) {
    return;  // Not adjacent, ignore
  }
  
  // Add to path
  dragState.dragPath.push(pos);
  dragState.state.selectedPositions.push(pos);
  
  updateDragVisualization(dragState.state);
}

function updateDragVisualization(state) {
  // Update visual state of all tiles without re-rendering
  $$('.strands-tile').forEach(function(tile) {
    var row = parseInt(tile.dataset.row);
    var col = parseInt(tile.dataset.col);
    var isSelected = positionsInclude(state.selectedPositions, [row, col]);
    
    if (isSelected) {
      tile.classList.add('selected');
    } else {
      tile.classList.remove('selected');
    }
  });
}

function handleStrandsTileClick(state, puzzle, row, col) {
  if (state.gameOver || dragState.isDragging) return;
  
  var pos = [row, col];
  var posIdx = state.selectedPositions.findIndex(function(p) { return positionsEqual(p, pos); });
  
  if (posIdx !== -1) {
    // If clicking already selected, deselect
    state.selectedPositions.splice(posIdx, 1);
  } else {
    // If adjacent to last selected or first selection, add it
    if (state.selectedPositions.length === 0 || isAdjacent(state.selectedPositions[state.selectedPositions.length - 1], pos, puzzle.grid.length)) {
      state.selectedPositions.push(pos);
    } else {
      showToast('Not adjacent to selection');
      state.selectedPositions = [];
      updateDragVisualization(state);
      return;
    }
  }
  
  saveStrandsState(state);
  updateDragVisualization(state);
}

function isAdjacent(pos1, pos2, gridSize) {
  var adjacent = getAdjacent(pos1[0], pos1[1], gridSize);
  return adjacent.some(function(adj) { return positionsEqual(adj, pos2); });
}

// ─── Word checking ────────────────────────────────────────────────────────────
function checkSelection(state, puzzle) {
  if (state.selectedPositions.length === 0) return;
  
  var gridSize = puzzle.grid.length;
  
  // Get selected letters
  var selectedLetters = state.selectedPositions.map(function(pos) {
    return puzzle.grid[pos[0]][pos[1]];
  }).join('');
  
  // Check against theme words
  for (var i = 0; i < puzzle.themeWords.length; i++) {
    if (state.foundWords.indexOf(i) !== -1) continue; // Already found
    
    if (puzzle.themeWords[i].word === selectedLetters) {
      // Found a theme word!
      state.foundWords.push(i);
      state.selectedPositions = [];
      saveStrandsState(state);
      showToast(selectedLetters, 800);
      renderStrandsBoard(state, puzzle);
      
      if (state.foundWords.length === puzzle.themeWords.length && state.foundSpangram) {
        completeStrandsGame(state, puzzle);
      }
      return;
    }
  }
  
  // Check against spangram
  if (!state.foundSpangram && puzzle.spangram.word === selectedLetters) {
    state.foundSpangram = true;
    state.selectedPositions = [];
    saveStrandsState(state);
    showToast('Spangram found!', 1000);
    renderStrandsBoard(state, puzzle);
    
    if (state.foundWords.length === puzzle.themeWords.length) {
      completeStrandsGame(state, puzzle);
    }
    return;
  }
  
  showToast('Not a valid word', 800);
  state.selectedPositions = [];
  renderStrandsBoard(state, puzzle);
}

function completeStrandsGame(state, puzzle) {
  state.gameOver = true;
  state.won = true;
  saveStrandsState(state);
  var stats = recordStrandsResult(true);
  setTimeout(function() {
    showToast('Puzzle solved!', 1000);
    setTimeout(function() { showStrandsStatsModal(state, puzzle, stats); }, 1200);
  }, 500);
}

// ─── Modals ──────────────────────────────────────────────────────────────────
function showStrandsStatsModal(state, puzzle, stats) {
  var modal = $('#strands-stats-modal');
  if (!modal) return;
  
  $('#strands-stat-played').textContent = stats.played;
  $('#strands-stat-winpct').textContent = stats.played > 0 ? Math.round((stats.wins / stats.played) * 100) : 0;
  $('#strands-stat-streak').textContent = stats.streak;
  $('#strands-stat-maxstreak').textContent = stats.maxStreak;
  
  // Show share section if won
  var shareSection = modal.querySelector('#strands-share-section');
  if (shareSection && state.won) {
    shareSection.style.display = '';
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
  
  openModal('strands-stats-modal');
}

function updateCountdown() {
  var now = new Date();
  var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  var diff = tomorrow - now;
  
  var hours = Math.floor(diff / 3600000);
  var mins = Math.floor((diff % 3600000) / 60000);
  var secs = Math.floor((diff % 60000) / 1000);
  
  var countdown = $('#strands-countdown');
  if (countdown) {
    countdown.textContent = String(hours).padStart(2, '0') + ':' + 
                           String(mins).padStart(2, '0') + ':' + 
                           String(secs).padStart(2, '0');
  }
}

// ─── Initialization ──────────────────────────────────────────────────────────
function initializeStrands() {
  var puzzle = STRANDS_PUZZLES[getStrandsPuzzleIndex()];
  var state = loadStrandsState();
  
  if (!state) {
    state = makeStrandsState(puzzle, getStrandsPuzzleIndex());
  }
  
  renderStrandsBoard(state, puzzle);
  
  // Global mouseup handler for drag end
  document.addEventListener('mouseup', function() {
    if (dragState.isDragging) {
      dragState.isDragging = false;
      saveStrandsState(dragState.state);
    }
  });
  
  // Wire up buttons
  $('#strands-clear').addEventListener('click', function() {
    state.selectedPositions = [];
    saveStrandsState(state);
    renderStrandsBoard(state, puzzle);
  });
  
  $('#strands-submit').addEventListener('click', function() {
    checkSelection(state, puzzle);
  });
  
  $('#strands-help-btn').addEventListener('click', function() {
    openModal('strands-help-modal');
  });
  
  $('#strands-stats-btn').addEventListener('click', function() {
    var stats = loadStrandsStats();
    showStrandsStatsModal(state, puzzle, stats);
  });
  
  // Close modals
  document.querySelectorAll('.modal-overlay .modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal.id);
    });
  });
  
  // Update theme
  var titleEl = document.getElementById('header-title');
  if (titleEl) titleEl.textContent = puzzle.theme + ' - Strands';
  
  $('#strands-puzzle-num').textContent = 'Puzzle #' + (getStrandsPuzzleIndex() + 1);
}

// ─── Game Switch Handler ──────────────────────────────────────────────────────
window.addEventListener('gameSwitch', function(e) {
  if (e.detail.id === 'strands') {
    setTimeout(initializeStrands, 0);
  }
});

// ─── Init on page load ───────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  if (window.getActiveGame && window.getActiveGame() === 'strands') {
    initializeStrands();
  }
});
