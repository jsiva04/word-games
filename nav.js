// Shared navigation — in-page game switcher (SPA)
// Injects a hamburger button into .header-left and manages view switching.
// Dispatches a 'gameSwitch' CustomEvent when the active game changes so that
// individual game scripts can react without nav.js knowing their internals.

(function () {
  var GAMES = [
    { id: 'wordle',      name: 'Wordle',      icon: makeWordleIcon()      },
    { id: 'connections', name: 'Connections', icon: makeConnectionsIcon() },
  ];

  var ACTIVE_KEY = 'activeGame';
  var activeGame = localStorage.getItem(ACTIVE_KEY) || 'wordle';

  // ── Public API (called by game scripts or externally) ─────────────────────
  window.switchGame = function (id) {
    if (!GAMES.find(function(g) { return g.id === id; })) return;
    activeGame = id;
    localStorage.setItem(ACTIVE_KEY, id);

    // Toggle views
    GAMES.forEach(function (g) {
      var view = document.getElementById(g.id + '-view');
      if (view) {
        if (g.id === id) view.classList.add('active');
        else             view.classList.remove('active');
      }
    });

    // Toggle header buttons
    var wBtns = document.getElementById('wordle-header-btns');
    var cBtns = document.getElementById('conn-header-btns');
    if (wBtns) wBtns.style.display = id === 'wordle'      ? '' : 'none';
    if (cBtns) cBtns.style.display = id === 'connections' ? '' : 'none';

    // Update header title
    var titleEl = document.getElementById('header-title');
    if (titleEl) {
      var game = GAMES.find(function(g) { return g.id === id; });
      if (game) titleEl.textContent = game.name;
    }

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(function (a) {
      if (a.dataset.gameId === id) a.classList.add('nav-item--active');
      else                         a.classList.remove('nav-item--active');
    });

    // Notify game scripts
    window.dispatchEvent(new CustomEvent('gameSwitch', { detail: { id: id } }));

    closeDrawer();
  };

  window.getActiveGame = function () { return activeGame; };

  // ── SVG helpers ───────────────────────────────────────────────────────────
  function svgEl(viewBox) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', viewBox);
    s.setAttribute('fill', 'currentColor');
    s.setAttribute('width', '20');
    s.setAttribute('height', '20');
    return s;
  }

  function makeWordleIcon() {
    var s = svgEl('0 0 20 20');
    [[0,0],[7,0],[14,0],[0,7],[7,7],[14,7],[0,14],[7,14],[14,14]].forEach(function(p) {
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', p[0]); r.setAttribute('y', p[1]);
      r.setAttribute('width', '5'); r.setAttribute('height', '5'); r.setAttribute('rx', '1');
      s.appendChild(r);
    });
    return s;
  }

  function makeConnectionsIcon() {
    var s = svgEl('0 0 20 20');
    [[0,0],[9,0],[0,9],[9,9]].forEach(function(p) {
      var r = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      r.setAttribute('x', p[0]); r.setAttribute('y', p[1]);
      r.setAttribute('width', '8'); r.setAttribute('height', '8'); r.setAttribute('rx', '2');
      s.appendChild(r);
    });
    return s;
  }

  function makeLineIcon(pairs) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('fill', 'none');
    s.setAttribute('stroke', 'currentColor');
    s.setAttribute('stroke-width', '2');
    s.setAttribute('stroke-linecap', 'round');
    s.setAttribute('width', '22'); s.setAttribute('height', '22');
    pairs.forEach(function(p) {
      var l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', p[0]); l.setAttribute('y1', p[1]);
      l.setAttribute('x2', p[2]); l.setAttribute('y2', p[3]);
      s.appendChild(l);
    });
    return s;
  }

  // ── Build overlay + drawer ────────────────────────────────────────────────
  function buildDrawer() {
    var overlay = document.createElement('div');
    overlay.id = 'nav-overlay';
    overlay.className = 'nav-overlay';

    var drawer = document.createElement('div');
    drawer.className = 'nav-drawer';

    // Drawer header
    var dHeader = document.createElement('div');
    dHeader.className = 'nav-drawer-header';
    var dTitle = document.createElement('span');
    dTitle.className = 'nav-drawer-title';
    dTitle.textContent = 'Games';
    var closeBtn = document.createElement('button');
    closeBtn.className = 'nav-close icon-btn';
    closeBtn.setAttribute('aria-label', 'Close menu');
    closeBtn.appendChild(makeLineIcon([[18,6,6,18],[6,6,18,18]]));
    dHeader.appendChild(dTitle);
    dHeader.appendChild(closeBtn);

    // Game list
    var list = document.createElement('nav');
    list.className = 'nav-list';
    GAMES.forEach(function (game) {
      var a = document.createElement('a');
      a.className = 'nav-item' + (game.id === activeGame ? ' nav-item--active' : '');
      a.href = '#';
      a.dataset.gameId = game.id;
      a.setAttribute('aria-label', game.name);
      var iconWrap = document.createElement('span');
      iconWrap.className = 'nav-item-icon';
      iconWrap.appendChild(game.icon);
      var nameEl = document.createElement('span');
      nameEl.className = 'nav-item-name';
      nameEl.textContent = game.name;
      a.appendChild(iconWrap);
      a.appendChild(nameEl);
      a.addEventListener('click', function (e) {
        e.preventDefault();
        window.switchGame(game.id);
      });
      list.appendChild(a);
    });

    drawer.appendChild(dHeader);
    drawer.appendChild(list);
    overlay.appendChild(drawer);
    document.body.appendChild(overlay);

    // Hamburger button → inject into .header-left
    var headerLeft = document.querySelector('.header-left');
    if (headerLeft) {
      var hamburger = document.createElement('button');
      hamburger.className = 'icon-btn';
      hamburger.id = 'nav-hamburger';
      hamburger.setAttribute('aria-label', 'Open menu');
      hamburger.appendChild(makeLineIcon([[3,6,21,6],[3,12,21,12],[3,18,21,18]]));
      headerLeft.insertBefore(hamburger, headerLeft.firstChild);
      hamburger.addEventListener('click', openDrawer);
    }

    closeBtn.addEventListener('click', closeDrawer);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) closeDrawer(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

    // Swipe left to close
    var tx = 0;
    drawer.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
    drawer.addEventListener('touchend', function (e) { if (tx - e.changedTouches[0].clientX > 60) closeDrawer(); });

    // Apply initial state (in case localStorage had a non-default game)
    if (activeGame !== 'wordle') {
      window.switchGame(activeGame);
    }
  }

  function openDrawer()  { var el = document.getElementById('nav-overlay'); if (el) el.classList.add('open'); }
  function closeDrawer() { var el = document.getElementById('nav-overlay'); if (el) el.classList.remove('open'); }

  document.addEventListener('DOMContentLoaded', buildDrawer);
})();
