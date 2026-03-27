// ─── Constants ───────────────────────────────────────────────────────────────
const EPOCH = new Date(2021, 5, 19); // Wordle's original launch date
const MAX_GUESSES = 6;
const WORD_LENGTH = 5;
const FLIP_DURATION = 500; // ms per tile flip
const FLIP_DELAY    = 300; // ms between each tile flip

// ─── Daily Word ──────────────────────────────────────────────────────────────
function getTodayIndex() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.floor((today - EPOCH) / 86400000);
}

function getDailyWord() {
  const idx = getTodayIndex() % ANSWER_LIST.length;
  return ANSWER_LIST[idx].toLowerCase();
}

// ─── State ───────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'wordleState';
const STATS_KEY   = 'wordleStats';

function getDefaultState(word) {
  return {
    word,
    guesses: [],
    currentGuess: '',
    gameOver: false,
    won: false,
    dayIndex: getTodayIndex(),
    animating: false,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    if (saved.dayIndex === getTodayIndex()) {
      // Ensure critical fields are always valid
      saved.animating = false;
      saved.gameOver = saved.gameOver || false;
      saved.won = saved.won || false;
      saved.currentGuess = (saved.currentGuess || '').toLowerCase();
      saved.guesses = Array.isArray(saved.guesses) ? saved.guesses : [];
      return saved;
    }
  } catch (e) {
    console.error('Error loading state:', e);
  }
  return null;
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { played: 0, wins: 0, streak: 0, maxStreak: 0, distribution: [0,0,0,0,0,0] };
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function recordResult(won, guessCount) {
  const stats = loadStats();
  stats.played++;
  if (won) {
    stats.wins++;
    stats.streak++;
    stats.maxStreak = Math.max(stats.maxStreak, stats.streak);
    stats.distribution[guessCount - 1]++;
  } else {
    stats.streak = 0;
  }
  saveStats(stats);
  return stats;
}

// ─── Guess evaluation ────────────────────────────────────────────────────────
function evaluateGuess(guess, answer) {
  const result = Array.from({ length: WORD_LENGTH }, (_, i) => ({
    letter: guess[i],
    state: 'absent',
  }));

  const answerCounts = {};
  for (const ch of answer) {
    answerCounts[ch] = (answerCounts[ch] || 0) + 1;
  }

  // First pass: greens
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (guess[i] === answer[i]) {
      result[i].state = 'correct';
      answerCounts[guess[i]]--;
    }
  }

  // Second pass: yellows
  for (let i = 0; i < WORD_LENGTH; i++) {
    if (result[i].state === 'correct') continue;
    if (answerCounts[guess[i]] > 0) {
      result[i].state = 'present';
      answerCounts[guess[i]]--;
    }
  }

  return result;
}

// ─── DOM helpers ─────────────────────────────────────────────────────────────
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

function showToast(msg, duration) {
  duration = duration === undefined ? 1500 : duration;
  const container = $('#toast-container');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(function() {
    el.classList.add('fade-out');
    setTimeout(function() { if (el.parentNode) el.parentNode.removeChild(el); }, 350);
  }, duration);
}

function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

// ─── Board building ───────────────────────────────────────────────────────────
function buildBoard() {
  const board = $('#board');
  clearChildren(board);
  for (let r = 0; r < MAX_GUESSES; r++) {
    const row = document.createElement('div');
    row.className = 'board-row';
    row.id = 'row-' + r;
    for (let c = 0; c < WORD_LENGTH; c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.id = 'tile-' + r + '-' + c;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function renderCurrentGuess(state) {
  const row = state.guesses.length;
  if (row >= MAX_GUESSES) return;
  for (let c = 0; c < WORD_LENGTH; c++) {
    const tile = document.getElementById('tile-' + row + '-' + c);
    const ch = state.currentGuess[c] || '';
    tile.textContent = ch.toUpperCase();
    tile.dataset.state = ch ? 'tbd' : 'empty';
  }
}

var TILE_BG = { correct: '#6aaa64', present: '#c9b458', absent: '#787c7e' };

function restoreBoard(state) {
  buildBoard();
  for (var r = 0; r < state.guesses.length; r++) {
    var guess = state.guesses[r];
    var evaluation = evaluateGuess(guess, state.word);
    for (var c = 0; c < WORD_LENGTH; c++) {
      var tile = document.getElementById('tile-' + r + '-' + c);
      tile.textContent = guess[c].toUpperCase();
      tile.dataset.state = evaluation[c].state;
      // Set colors directly — don't rely on animation fill mode on restore
      tile.style.animation = 'none';
      tile.style.background = TILE_BG[evaluation[c].state];
      tile.style.color = '#ffffff';
      tile.style.borderColor = 'transparent';
    }
  }
  renderCurrentGuess(state);
}

// ─── Row reveal animation ─────────────────────────────────────────────────────
function revealRow(rowIdx, guess, answer, onDone) {
  const evaluation = evaluateGuess(guess, answer);
  const totalDuration = WORD_LENGTH * FLIP_DELAY + FLIP_DURATION;

  for (let c = 0; c < WORD_LENGTH; c++) {
    const tile = document.getElementById('tile-' + rowIdx + '-' + c);
    tile.style.animationDelay    = (c * FLIP_DELAY) + 'ms';
    tile.style.animationDuration = FLIP_DURATION + 'ms';
    tile.dataset.state = evaluation[c].state;
  }

  setTimeout(onDone, totalDuration);
}

// ─── Keyboard ─────────────────────────────────────────────────────────────────
const KEY_PRIORITY = { correct: 3, present: 2, absent: 1 };

function updateKeyboard(guess, answer) {
  const evaluation = evaluateGuess(guess, answer);
  for (const item of evaluation) {
    const key = document.querySelector('[data-key="' + item.letter + '"]');
    if (!key) continue;
    const currentPriority = KEY_PRIORITY[key.dataset.state] || 0;
    if (KEY_PRIORITY[item.state] > currentPriority) {
      key.dataset.state = item.state;
    }
  }
}

function resetKeyboard() {
  $$('[data-key]').forEach(function(k) { delete k.dataset.state; });
}

function restoreKeyboard(state) {
  resetKeyboard();
  for (const guess of state.guesses) {
    updateKeyboard(guess, state.word);
  }
}

// ─── Input handling ───────────────────────────────────────────────────────────
function handleKey(state, key) {
  if (state.gameOver || state.animating) return;

  if (key === 'Backspace' || key === 'DELETE') {
    if (state.currentGuess.length > 0) {
      state.currentGuess = state.currentGuess.slice(0, -1);
      renderCurrentGuess(state);
    }
    return;
  }

  if (key === 'Enter' || key === 'ENTER') {
    submitWordleGuess(state);
    return;
  }

  if (/^[a-zA-Z]$/.test(key) && state.currentGuess.length < WORD_LENGTH) {
    state.currentGuess += key.toLowerCase();
    renderCurrentGuess(state);
  }
}

function submitWordleGuess(state) {
  const guess = state.currentGuess;

  if (guess.length < WORD_LENGTH) {
    showToast('Not enough letters');
    shakeRow(state.guesses.length);
    return;
  }

  if (!ALL_VALID_WORDS.includes(guess)) {
    showToast('Not in word list');
    shakeRow(state.guesses.length);
    return;
  }

  const rowIdx = state.guesses.length;

  // Show letters before flip
  for (let c = 0; c < WORD_LENGTH; c++) {
    document.getElementById('tile-' + rowIdx + '-' + c).textContent = guess[c].toUpperCase();
  }

  state.guesses.push(guess);
  state.currentGuess = '';
  saveState(state);

  state.animating = true;
  revealRow(rowIdx, guess, state.word, function() {
    state.animating = false;
    updateKeyboard(guess, state.word);

    const won = (guess === state.word);

    if (won) {
      state.gameOver = true;
      state.won = true;
      saveState(state);
      recordResult(true, state.guesses.length);

      // Bounce winning row
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = document.getElementById('tile-' + rowIdx + '-' + c);
        tile.style.animationDelay = (c * 100) + 'ms';
        tile.classList.add('bounce');
      }

      const msgs = ['Genius!','Magnificent!','Impressive!','Splendid!','Great!','Phew!'];
      const msg = msgs[Math.min(state.guesses.length - 1, msgs.length - 1)];
      setTimeout(function() {
        showToast(msg, 1800);
        setTimeout(function() { showStatsModal(state); }, 1600);
      }, 400);

    } else if (state.guesses.length >= MAX_GUESSES) {
      state.gameOver = true;
      state.won = false;
      saveState(state);
      recordResult(false, 0);
      setTimeout(function() {
        showToast(state.word.toUpperCase(), 3000);
        setTimeout(function() { showStatsModal(state); }, 2000);
      }, 400);
    }

    renderCurrentGuess(state);
  });
}

function shakeRow(rowIdx) {
  const row = document.getElementById('row-' + rowIdx);
  row.classList.add('shake');
  setTimeout(function() { row.classList.remove('shake'); }, 600);
}

// ─── Stats modal ──────────────────────────────────────────────────────────────
function showStatsModal(state) {
  const stats = loadStats();

  const winPct = stats.played ? Math.round((stats.wins / stats.played) * 100) : 0;
  document.getElementById('stat-played').textContent    = stats.played;
  document.getElementById('stat-winpct').textContent    = winPct;
  document.getElementById('stat-streak').textContent    = stats.streak;
  document.getElementById('stat-maxstreak').textContent = stats.maxStreak;

  // Rebuild distribution bars using DOM
  const distContainer = document.getElementById('guess-distribution');
  clearChildren(distContainer);

  const labelEl = document.createElement('div');
  labelEl.className = 'dist-label';
  labelEl.textContent = 'Guess Distribution';
  distContainer.appendChild(labelEl);

  const maxVal = Math.max(...stats.distribution, 1);

  for (let i = 0; i < MAX_GUESSES; i++) {
    const rowEl = document.createElement('div');
    rowEl.className = 'dist-row';

    const numEl = document.createElement('div');
    numEl.className = 'dist-num';
    numEl.textContent = String(i + 1);

    const barWrap = document.createElement('div');
    barWrap.className = 'dist-bar-wrap';

    const bar = document.createElement('div');
    bar.className = 'dist-bar';
    const pct = Math.max(7, Math.round((stats.distribution[i] / maxVal) * 100));
    bar.style.width = pct + '%';
    bar.textContent = String(stats.distribution[i]);

    if (state.won && state.guesses.length === i + 1) {
      bar.classList.add('highlight');
    }

    barWrap.appendChild(bar);
    rowEl.appendChild(numEl);
    rowEl.appendChild(barWrap);
    distContainer.appendChild(rowEl);
  }

  // Share section visibility
  document.getElementById('share-section').style.display = state.gameOver ? 'flex' : 'none';

  startCountdown();
  openModal('stats-modal');
}

function startCountdown() {
  function update() {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const diff = tomorrow - now;
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const el = document.getElementById('countdown');
    if (el) {
      el.textContent =
        pad(h) + ':' + pad(m) + ':' + pad(s);
    }
  }
  function pad(n) { return String(n).padStart(2, '0'); }
  update();
  clearInterval(window._countdownInterval);
  window._countdownInterval = setInterval(update, 1000);
}

// ─── Share / Copy ─────────────────────────────────────────────────────────────
function buildShareText(state) {
  const dayNum = getTodayIndex();
  const guessCount = state.won ? String(state.guesses.length) : 'X';
  const header = 'Wordle ' + dayNum + ' ' + guessCount + '/' + MAX_GUESSES;

  const rows = state.guesses.map(function(guess) {
    return evaluateGuess(guess, state.word).map(function(item) {
      if (item.state === 'correct') return '\uD83D\uDFE9'; // 🟩
      if (item.state === 'present') return '\uD83D\uDFE8'; // 🟨
      return '\u2B1B'; // ⬛
    }).join('');
  });

  return header + '\n\n' + rows.join('\n');
}

function copyResult(state) {
  const text = buildShareText(state);
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showToast('Copied to clipboard!');
    }).catch(function() {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand('copy'); } catch {}
  document.body.removeChild(ta);
  showToast('Copied to clipboard!');
}

// ─── Init ────────────────────────────────────────────────────────────────────
function init() {
  const daily = getDailyWord();
  let state = loadState();

  if (!state) {
    state = getDefaultState(daily);
    saveState(state);
  }

  buildBoard();
  restoreBoard(state);
  restoreKeyboard(state);

  if (state.gameOver) {
    setTimeout(function() { showStatsModal(state); }, 500);
  }

  // Physical keyboard — only handle when Wordle is the active view
  document.addEventListener('keydown', function(e) {
    if (window.getActiveGame && window.getActiveGame() !== 'wordle') return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    handleKey(state, e.key);
  });

  // On-screen keyboard
  $$('[data-key]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      handleKey(state, btn.dataset.key);
    });
  });

  // Help modal
  document.getElementById('help-btn').addEventListener('click', function() {
    openModal('help-modal');
  });

  // Stats modal
  document.getElementById('stats-btn').addEventListener('click', function() {
    showStatsModal(state);
  });

  // Share button
  document.getElementById('share-btn').addEventListener('click', function() {
    copyResult(state);
  });
}

// Shared modal close logic (registered once for all modals in the SPA)
function initSharedModals() {
  $$('.modal-close').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var overlay = btn.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    });
  });

  $$('.modal-overlay').forEach(function(overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModal(overlay.id);
    });
  });

  var touchStartY = 0;
  $$('.modal').forEach(function(modal) {
    modal.addEventListener('touchstart', function(e) {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    modal.addEventListener('touchend', function(e) {
      if (e.changedTouches[0].clientY - touchStartY > 60) {
        var overlay = modal.closest('.modal-overlay');
        if (overlay) closeModal(overlay.id);
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function() {
  init();
  initSharedModals();
});
