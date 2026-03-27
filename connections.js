// ─── Constants ────────────────────────────────────────────────────────────────
var MAX_MISTAKES = 4;
var COLOR_ORDER  = ['yellow', 'green', 'blue', 'purple'];

// Share emoji for each color
var SHARE_EMOJI = { yellow: '\uD83D\uDFE8', green: '\uD83D\uDFE9', blue: '\uD83D\uDFE6', purple: '\uD83D\uDFEA' };

// ─── Storage ──────────────────────────────────────────────────────────────────
var CONN_STATE_KEY = 'connectionsState';
var CONN_STATS_KEY = 'connectionsStats';

function loadConnState() {
  try {
    var raw = localStorage.getItem(CONN_STATE_KEY);
    if (!raw) return null;
    var s = JSON.parse(raw);
    if (s.puzzleIndex === getConnPuzzleIndex()) return s;
  } catch(e) {}
  return null;
}

function saveConnState(state) {
  localStorage.setItem(CONN_STATE_KEY, JSON.stringify(state));
}

function loadConnStats() {
  try {
    var raw = localStorage.getItem(CONN_STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch(e) {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0 };
}

function saveConnStats(stats) {
  localStorage.setItem(CONN_STATS_KEY, JSON.stringify(stats));
}

function recordConnResult(won) {
  var stats = loadConnStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
  } else {
    stats.streak = 0;
  }
  saveConnStats(stats);
  return stats;
}

// ─── State helpers ────────────────────────────────────────────────────────────
function makeState(puzzle, idx) {
  // Flatten and shuffle words
  var words = [];
  puzzle.categories.forEach(function(cat) {
    cat.words.forEach(function(w) {
      words.push({ word: w, color: cat.color });
    });
  });
  shuffle(words);
  return {
    puzzleIndex: idx,
    words: words,           // {word, color}[] — current tile order
    selected: [],           // selected word strings
    solved: [],             // solved color strings, in order solved
    guesses: [],            // [{words:[...], colors:[...]}, ...] for share grid
    mistakes: 0,
    gameOver: false,
    won: false,
  };
}

function shuffle(arr) {
  for (var i = arr.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
  }
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

// ─── Board rendering ──────────────────────────────────────────────────────────
function renderBoard(state, puzzle) {
  var board = document.getElementById('conn-board');
  clearChildren(board);

  // Solved rows first
  state.solved.forEach(function(color) {
    var cat = puzzle.categories.find(function(c) { return c.color === color; });
    var row = document.createElement('div');
    row.className = 'conn-solved-row';
    row.dataset.color = color;

    var nameEl = document.createElement('div');
    nameEl.className = 'conn-solved-name';
    nameEl.textContent = cat.name;

    var wordsEl = document.createElement('div');
    wordsEl.className = 'conn-solved-words';
    wordsEl.textContent = cat.words.join(', ');

    row.appendChild(nameEl);
    row.appendChild(wordsEl);
    board.appendChild(row);
  });

  // Unsolved grid (only words not yet solved)
  var solvedColors = new Set(state.solved);
  var remaining = state.words.filter(function(w) { return !solvedColors.has(w.color); });

  if (remaining.length > 0) {
    var grid = document.createElement('div');
    grid.className = 'conn-grid';
    grid.id = 'conn-grid';

    remaining.forEach(function(item) {
      var btn = document.createElement('button');
      btn.className = 'conn-tile';
      btn.dataset.word = item.word;
      btn.textContent = item.word;
      if (state.selected.indexOf(item.word) !== -1) {
        btn.classList.add('selected');
      }
      btn.addEventListener('click', function() { handleTileClick(state, puzzle, item.word); });
      grid.appendChild(btn);
    });

    board.appendChild(grid);
  }

  updateControls(state);
}

function updateControls(state) {
  var submitBtn = document.getElementById('conn-submit');
  var shuffleBtn = document.getElementById('conn-shuffle');
  var deselectBtn = document.getElementById('conn-deselect');

  if (submitBtn) submitBtn.disabled = state.selected.length !== 4 || state.gameOver;
  if (deselectBtn) deselectBtn.disabled = state.selected.length === 0 || state.gameOver;
  if (shuffleBtn) shuffleBtn.disabled = state.gameOver;

  // Mistakes dots
  for (var i = 0; i < MAX_MISTAKES; i++) {
    var dot = document.getElementById('conn-dot-' + i);
    if (dot) {
      if (i < state.mistakes) dot.classList.add('used');
      else dot.classList.remove('used');
    }
  }
}

// ─── Tile interaction ─────────────────────────────────────────────────────────
function handleTileClick(state, puzzle, word) {
  if (state.gameOver) return;

  var idx = state.selected.indexOf(word);
  if (idx !== -1) {
    // Deselect
    state.selected.splice(idx, 1);
  } else {
    if (state.selected.length >= 4) return;
    state.selected.push(word);
    // Bounce animation
    var tile = document.querySelector('[data-word="' + CSS.escape(word) + '"]');
    if (tile) {
      tile.classList.add('bounce-in');
      tile.addEventListener('animationend', function() { tile.classList.remove('bounce-in'); }, { once: true });
    }
  }

  // Update selected state on tiles
  $$('.conn-tile').forEach(function(t) {
    if (state.selected.indexOf(t.dataset.word) !== -1) {
      t.classList.add('selected');
    } else {
      t.classList.remove('selected');
    }
  });

  updateControls(state);
  saveConnState(state);
}

// ─── Submit guess ─────────────────────────────────────────────────────────────
function submitConnectionsGuess(state, puzzle) {
  if (state.selected.length !== 4 || state.gameOver) return;

  var sel = state.selected.slice();

  // Determine which color each selected word belongs to
  var colorCounts = {};
  COLOR_ORDER.forEach(function(c) { colorCounts[c] = 0; });
  sel.forEach(function(word) {
    var item = state.words.find(function(w) { return w.word === word; });
    if (item) colorCounts[item.color]++;
  });

  // Record guess for share grid
  var guessColors = sel.map(function(word) {
    var item = state.words.find(function(w) { return w.word === word; });
    return item ? item.color : 'absent';
  });
  state.guesses.push({ words: sel.slice(), colors: guessColors });

  // Check if all 4 belong to the same category
  var correctColor = null;
  COLOR_ORDER.forEach(function(c) {
    if (colorCounts[c] === 4) correctColor = c;
  });

  if (correctColor) {
    // Correct!
    state.solved.push(correctColor);
    state.selected = [];
    saveConnState(state);
    renderBoard(state, puzzle);

    if (state.solved.length === 4) {
      state.gameOver = true;
      state.won = true;
      saveConnState(state);
      var stats = recordConnResult(true);
      setTimeout(function() {
        showToast('Solved!', 1000);
        setTimeout(function() { showConnStatsModal(state, puzzle, stats); }, 1200);
      }, 500);
    }
  } else {
    // Wrong — check "one away"
    var maxCount = Math.max.apply(null, COLOR_ORDER.map(function(c) { return colorCounts[c]; }));
    state.mistakes++;
    state.selected = [];
    saveConnState(state);

    // Shake all selected tiles
    var grid = document.getElementById('conn-grid');
    if (grid) {
      $$('.conn-tile').forEach(function(t) {
        if (sel.indexOf(t.dataset.word) !== -1) {
          t.classList.add('shake');
          t.addEventListener('animationend', function() { t.classList.remove('shake'); }, { once: true });
        }
      });
    }

    if (maxCount === 3) {
      setTimeout(function() { showToast('One away!'); }, 300);
    }

    updateControls(state);

    if (state.mistakes >= MAX_MISTAKES) {
      state.gameOver = true;
      state.won = false;
      saveConnState(state);
      var stats = recordConnResult(false);
      // Reveal remaining categories
      setTimeout(function() {
        revealRemaining(state, puzzle);
        setTimeout(function() { showConnStatsModal(state, puzzle, stats); }, 1200);
      }, 600);
    }
  }
}

function revealRemaining(state, puzzle) {
  var solvedSet = new Set(state.solved);
  COLOR_ORDER.forEach(function(color) {
    if (!solvedSet.has(color)) {
      state.solved.push(color);
    }
  });
  renderBoard(state, puzzle);
}

// ─── Shuffle remaining tiles ──────────────────────────────────────────────────
function shuffleTiles(state, puzzle) {
  var solvedColors = new Set(state.solved);
  var remaining = state.words.filter(function(w) { return !solvedColors.has(w.color); });
  shuffle(remaining);
  // Put shuffled remaining back in words array (preserving solved order conceptually)
  var solved = state.words.filter(function(w) { return solvedColors.has(w.color); });
  state.words = solved.concat(remaining);
  saveConnState(state);
  renderBoard(state, puzzle);
}

// ─── Stats & share modal ──────────────────────────────────────────────────────
function showConnStatsModal(state, puzzle, stats) {
  stats = stats || loadConnStats();
  var winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;

  document.getElementById('conn-stat-played').textContent    = stats.played;
  document.getElementById('conn-stat-winpct').textContent    = winPct;
  document.getElementById('conn-stat-streak').textContent    = stats.streak;
  document.getElementById('conn-stat-maxstreak').textContent = stats.maxStreak;

  // Guess grid preview
  var gridEl = document.getElementById('conn-result-grid');
  clearChildren(gridEl);
  state.guesses.forEach(function(guess) {
    var rowEl = document.createElement('div');
    rowEl.className = 'conn-result-row';
    guess.colors.forEach(function(color) {
      var dot = document.createElement('div');
      dot.className = 'conn-result-dot';
      dot.dataset.color = color;
      rowEl.appendChild(dot);
    });
    gridEl.appendChild(rowEl);
  });

  // Share section
  document.getElementById('conn-share-section').style.display = state.gameOver ? 'flex' : 'none';

  startConnCountdown();
  openModal('conn-stats-modal');
}

function startConnCountdown() {
  function pad(n) { return String(n).padStart(2, '0'); }
  function update() {
    var now = new Date();
    var tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    var diff = tomorrow - now;
    var el = document.getElementById('conn-countdown');
    if (el) el.textContent = pad(Math.floor(diff/3600000)) + ':' + pad(Math.floor((diff%3600000)/60000)) + ':' + pad(Math.floor((diff%60000)/1000));
  }
  update();
  clearInterval(window._connCountdown);
  window._connCountdown = setInterval(update, 1000);
}

// ─── Share / copy ─────────────────────────────────────────────────────────────
function buildConnShareText(state, puzzle) {
  var idx = getConnPuzzleIndex();
  var result = state.won ? 'Solved in ' + state.guesses.length + ' guess' + (state.guesses.length === 1 ? '' : 'es') : 'Failed';
  var header = 'Connections\nPuzzle #' + idx + ' \u2013 ' + result;

  var rows = state.guesses.map(function(guess) {
    return guess.colors.map(function(c) { return SHARE_EMOJI[c] || '\u2B1B'; }).join('');
  });

  return header + '\n\n' + rows.join('\n');
}

function copyConnResult(state, puzzle) {
  var text = buildConnShareText(state, puzzle);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Copied to clipboard!');
    }).catch(function() { fallbackCopy(text); });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  var ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch(e) {}
  document.body.removeChild(ta);
  showToast('Copied to clipboard!');
}

// ─── Init ─────────────────────────────────────────────────────────────────────
function initConnections() {
  var puzzleIdx = getConnPuzzleIndex();
  var puzzle    = CONN_PUZZLES[puzzleIdx];

  var state = loadConnState() || makeState(puzzle, puzzleIdx);
  saveConnState(state);

  // Update puzzle number in header area
  var numEl = document.getElementById('conn-puzzle-num');
  if (numEl) numEl.textContent = '#' + puzzleIdx;

  renderBoard(state, puzzle);

  // If game already over, show stats after short delay
  if (state.gameOver) {
    setTimeout(function() { showConnStatsModal(state, puzzle); }, 500);
  }

  // Submit
  document.getElementById('conn-submit').addEventListener('click', function() {
    submitConnectionsGuess(state, puzzle);
  });

  // Shuffle
  document.getElementById('conn-shuffle').addEventListener('click', function() {
    shuffleTiles(state, puzzle);
  });

  // Deselect all
  document.getElementById('conn-deselect').addEventListener('click', function() {
    state.selected = [];
    $$('.conn-tile').forEach(function(t) { t.classList.remove('selected'); });
    updateControls(state);
    saveConnState(state);
  });

  // Help modal
  document.getElementById('conn-help-btn').addEventListener('click', function() {
    openModal('conn-help-modal');
  });

  // Stats modal
  document.getElementById('conn-stats-btn').addEventListener('click', function() {
    showConnStatsModal(state, puzzle);
  });

  // Share button
  document.getElementById('conn-share-btn').addEventListener('click', function() {
    copyConnResult(state, puzzle);
  });
}

// Lazy init — run once on first activation, then no-op on subsequent switches
document.addEventListener('DOMContentLoaded', function() {
  var initialized = false;

  function maybeInit() {
    if (initialized) return;
    initialized = true;
    initConnections();
  }

  // Init immediately if Connections is the starting game
  if (window.getActiveGame && window.getActiveGame() === 'connections') {
    maybeInit();
  }

  // Init on first switch to Connections
  window.addEventListener('gameSwitch', function(e) {
    if (e.detail && e.detail.id === 'connections') maybeInit();
  });
});
