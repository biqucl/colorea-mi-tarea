/* Colorea Mi Tarea – juegos: memoria (pares) y contar */
'use strict';

// ---------- voz ----------
let gameSound = localStorage.getItem('gameSound') !== 'off';
function say(text, lng = lang) {
  if (!gameSound || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lng === 'en' ? 'en-US' : 'es-ES';
  const v = speechSynthesis.getVoices().find(v => v.lang.replace('_', '-').toLowerCase().startsWith(lng));
  if (v) u.voice = v;
  u.rate = 0.85;
  speechSynthesis.speak(u);
}
function soundIcons() { $$('.snd-btn').forEach(b => { b.textContent = gameSound ? '🔊' : '🔇'; b.title = t('sound'); }); }
$$('.snd-btn').forEach(b => b.onclick = () => {
  gameSound = !gameSound;
  localStorage.setItem('gameSound', gameSound ? 'on' : 'off');
  if (!gameSound && window.speechSynthesis) speechSynthesis.cancel();
  soundIcons();
});

const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
// puntos como en un dado, en una cuadrícula de 3×3 (casillas 0–8)
const DOTS = { 1: [4], 2: [0, 8], 3: [0, 4, 8], 4: [0, 2, 6, 8], 5: [0, 2, 4, 6, 8], 6: [0, 2, 3, 5, 6, 8],
  7: [0, 2, 3, 4, 5, 6, 8], 8: [0, 1, 2, 3, 5, 6, 7, 8], 9: [0, 1, 2, 3, 4, 5, 6, 7, 8] };
const WORDS = [
  ['🐶', 'perro', 'dog'], ['🐱', 'gato', 'cat'], ['☀️', 'sol', 'sun'], ['🏠', 'casa', 'house'],
  ['🍎', 'manzana', 'apple'], ['🐟', 'pez', 'fish'], ['🌸', 'flor', 'flower'], ['🌳', 'árbol', 'tree'],
  ['🌙', 'luna', 'moon'], ['🚗', 'auto', 'car'], ['🐦', 'pájaro', 'bird'], ['📖', 'libro', 'book'],
];

function openGames() { show('#screen-games'); }
function celebrate(onAgain) {
  $('#game-win-again').onclick = () => { $('#game-win').classList.add('hidden'); onAgain(); };
  $('#game-win').classList.remove('hidden');
  say(t('wellDone'));
}

// ---------- memoria ----------
const MEM_PAIRS = 6;
const mem = { mode: localStorage.getItem('memMode') || 'case', cards: [], open: [], lock: false, done: 0 };

// cada par son dos caras distintas con la misma clave
function memPairs() {
  if (mem.mode === 'dots') {
    return shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, MEM_PAIRS)
      .map(n => [{ key: n, text: String(n), speak: String(n) }, { key: n, dots: n, speak: String(n) }]);
  }
  if (mem.mode === 'words') {
    return shuffle(WORDS.slice()).slice(0, MEM_PAIRS)
      .map(([e, es, en]) => [{ key: en, emoji: e, word: es, tag: 'ES', speak: es, lng: 'es' },
                             { key: en, emoji: e, word: en, tag: 'EN', speak: en, lng: 'en' }]);
  }
  const abc = Object.keys(GLYPHS.upper).filter(c => lang === 'es' || c !== 'Ñ');
  return shuffle(abc).slice(0, MEM_PAIRS)
    .map(c => [{ key: c, text: c, speak: c }, { key: c, text: c.toLowerCase(), speak: c.toLowerCase() }]);
}

function memFace(f) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  const add = (tag, attrs, text) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    if (text != null) el.textContent = text;
    svg.appendChild(el);
  };
  if (f.dots) {
    DOTS[f.dots].forEach(i => add('circle', { cx: 22 + (i % 3) * 28, cy: 22 + Math.floor(i / 3) * 28, r: 10, fill: '#111' }));
  } else if (f.word) {
    add('text', { x: 50, y: 42, 'font-size': 44, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, f.emoji);
    add('text', { x: 50, y: 84, 'font-size': Math.min(24, 150 / f.word.length), 'font-weight': 700, 'text-anchor': 'middle',
      'dominant-baseline': 'central', fill: '#111', 'font-family': 'Arial,sans-serif' }, f.word);
    add('text', { x: 6, y: 12, 'font-size': 12, 'font-weight': 700, fill: f.tag === 'ES' ? '#c62828' : '#1565c0',
      'font-family': 'Arial,sans-serif' }, f.tag);
  } else {
    add('text', { x: 50, y: 54, 'font-size': 76, 'font-weight': 700, 'text-anchor': 'middle', 'dominant-baseline': 'central',
      fill: '#111', 'font-family': 'Arial,sans-serif' }, f.text);
  }
  return svg;
}

function memNew() {
  mem.open = []; mem.lock = false; mem.done = 0;
  mem.cards = shuffle(memPairs().flat());
  const grid = $('#mem-grid');
  grid.innerHTML = '';
  mem.cards.forEach((f, i) => {
    const b = document.createElement('button');
    b.className = 'mem-card';
    b.setAttribute('aria-label', t('memCard', i + 1));
    const inner = document.createElement('div'); inner.className = 'mem-inner';
    const back = document.createElement('div'); back.className = 'mem-back'; back.textContent = '?';
    const front = document.createElement('div'); front.className = 'mem-front'; front.appendChild(memFace(f));
    inner.append(back, front); b.appendChild(inner);
    b.onclick = () => memFlip(i, b);
    f.el = b;
    grid.appendChild(b);
  });
  $$('.mem-mode').forEach(b => b.classList.toggle('active', b.dataset.mode === mem.mode));
  memLayout();
}

// elige filas × columnas para que las cartas sean lo más grandes posible
function memLayout() {
  const grid = $('#mem-grid'), n = mem.cards.length;
  if (!n || $('#screen-memory').classList.contains('hidden')) return;
  const r = grid.getBoundingClientRect(), gap = 12, pad = 24;
  let best = { s: 0 };
  for (let cols = 2; cols <= n; cols++) {
    const rows = Math.ceil(n / cols);
    if (rows * cols - n >= cols) continue;
    const w = (r.width - pad - gap * (cols - 1)) / cols, h = (r.height - pad - gap * (rows - 1)) / rows;
    const s = Math.min(w, h / 1.15);
    if (s > best.s) best = { s, cols, rows };
  }
  const w = Math.floor(best.s), h = Math.floor(best.s * 1.15);
  grid.style.gridTemplateColumns = `repeat(${best.cols}, ${w}px)`;
  grid.style.gridTemplateRows = `repeat(${best.rows}, ${h}px)`;
}

function memFlip(i, el) {
  const f = mem.cards[i];
  if (mem.lock || f.matched || mem.open.includes(i)) return;
  el.classList.add('open');
  say(f.speak, f.lng);
  mem.open.push(i);
  if (mem.open.length < 2) return;
  const [a, b] = mem.open.map(k => mem.cards[k]);
  if (a.key === b.key) {
    a.matched = b.matched = true;
    a.el.classList.add('matched'); b.el.classList.add('matched');
    mem.open = []; mem.done++;
    if (mem.done === MEM_PAIRS) setTimeout(() => celebrate(memNew), 900);
  } else {
    mem.lock = true;
    setTimeout(() => {
      a.el.classList.remove('open'); b.el.classList.remove('open');
      mem.open = []; mem.lock = false;
    }, 1500);
  }
}

function openMemory() { show('#screen-memory'); soundIcons(); memNew(); }
$$('.mem-mode').forEach(b => b.onclick = () => { mem.mode = b.dataset.mode; localStorage.setItem('memMode', mem.mode); memNew(); });
$('#mem-restart').onclick = memNew;

// ---------- contar ----------
const COUNT_THINGS = [
  { e: '🍎', es: '¿Cuántas manzanas hay?', en: 'How many apples are there?' },
  { e: '🐶', es: '¿Cuántos perritos hay?', en: 'How many puppies are there?' },
  { e: '⭐', es: '¿Cuántas estrellas hay?', en: 'How many stars are there?' },
  { e: '🚗', es: '¿Cuántos autos hay?', en: 'How many cars are there?' },
  { e: '🐟', es: '¿Cuántos peces hay?', en: 'How many fish are there?' },
  { e: '🎈', es: '¿Cuántos globos hay?', en: 'How many balloons are there?' },
  { e: '🌸', es: '¿Cuántas flores hay?', en: 'How many flowers are there?' },
  { e: '🐥', es: '¿Cuántos pollitos hay?', en: 'How many chicks are there?' },
];
const cnt = { max: +localStorage.getItem('countMax') === 10 ? 10 : 5, n: 0, thing: null, marked: [], stars: 0, busy: false };

function cntQuestion() { return cnt.thing[lang] || cnt.thing.es; }

function cntNew() {
  let n;
  do n = 1 + Math.floor(Math.random() * cnt.max); while (n === cnt.n && cnt.max > 1);
  let thing;
  do thing = COUNT_THINGS[Math.floor(Math.random() * COUNT_THINGS.length)]; while (thing === cnt.thing);
  Object.assign(cnt, { n, thing, marked: [], busy: false });

  // los objetos van en casillas al azar de una cuadrícula de 5 × 3 (3 × 5 si la pantalla está vertical), con un pequeño desorden
  const svg = $('#cnt-field'), box0 = svg.getBoundingClientRect();
  const tall = box0.height > box0.width * 1.2, cols = tall ? 3 : 5, cw = tall ? 100 : 80, ch = tall ? 90 : 100;
  svg.setAttribute('viewBox', `0 0 ${cols * cw} ${(15 / cols) * ch}`);
  svg.innerHTML = '';
  shuffle([...Array(15).keys()]).slice(0, n).forEach(cell => {
    const x = cw / 2 + (cell % cols) * cw + (Math.random() - 0.5) * 16, y = ch / 2 + Math.floor(cell / cols) * ch + (Math.random() - 0.5) * 16;
    const g = document.createElementNS(SVGNS, 'g');
    g.setAttribute('class', 'cnt-obj');
    g.innerHTML = `<circle cx="${x}" cy="${y}" r="38" class="cnt-ring"/>` +
      `<text x="${x}" y="${y + 2}" font-size="56" text-anchor="middle" dominant-baseline="central">${thing.e}</text>` +
      `<g class="cnt-badge"><circle cx="${x + 26}" cy="${y - 26}" r="16"/><text x="${x + 26}" y="${y - 25}" font-size="20" text-anchor="middle" dominant-baseline="central"></text></g>`;
    g.onclick = () => cntMark(g);
    svg.appendChild(g);
  });

  // tres respuestas ordenadas: la correcta y dos cercanas
  const opts = new Set([n]);
  for (const d of shuffle([-2, -1, 1, 2])) { if (opts.size === 3) break; if (n + d >= 1 && n + d <= cnt.max) opts.add(n + d); }
  for (let k = 1; opts.size < 3 && k <= 10; k++) opts.add(k);
  const box = $('#cnt-answers');
  box.innerHTML = '';
  [...opts].sort((a, b) => a - b).forEach(v => {
    const b = document.createElement('button');
    b.className = 'cnt-ans'; b.textContent = v;
    b.onclick = () => cntAnswer(v, b);
    box.appendChild(b);
  });
  $('#cnt-question').textContent = cntQuestion();
  say(cntQuestion());
}

// tocar un objeto lo marca con su número (ayuda a no contar dos veces); tocarlo otra vez lo desmarca
function cntMark(g) {
  const i = cnt.marked.indexOf(g);
  if (i >= 0) cnt.marked.splice(i, 1); else cnt.marked.push(g);
  $$('#cnt-field .cnt-obj').forEach(o => o.classList.toggle('marked', cnt.marked.includes(o)));
  cnt.marked.forEach((o, k) => { o.querySelector('.cnt-badge text').textContent = k + 1; });
  if (i < 0) say(String(cnt.marked.length));
}

function cntAnswer(v, b) {
  if (cnt.busy || b.disabled) return;
  if (v === cnt.n) {
    cnt.busy = true;
    b.classList.add('right');
    cnt.stars++;
    cntStars();
    say(t('countYes', v));
    if (cnt.stars % 5 === 0) setTimeout(() => celebrate(cntNew), 1400);
    else setTimeout(cntNew, 2200);
  } else {
    b.classList.add('wrong'); b.disabled = true;
    say(t('tryAgain'));
  }
}
function cntStars() { $('#cnt-stars').textContent = '⭐ ' + cnt.stars; }
function cntRangeBtns() { $$('.cnt-range').forEach(b => b.classList.toggle('active', +b.dataset.max === cnt.max)); }

function openCount() { show('#screen-count'); soundIcons(); cntStars(); cntRangeBtns(); cntNew(); }
$$('.cnt-range').forEach(b => b.onclick = () => { cnt.max = +b.dataset.max; localStorage.setItem('countMax', cnt.max); cntRangeBtns(); cntNew(); });
$('#cnt-hear').onclick = () => say(cntQuestion());

// ---------- navegación ----------
$('#btn-games').onclick = openGames;
$('#games-back').onclick = () => show('#screen-home');
$('#games-memory').onclick = openMemory;
$('#games-count').onclick = openCount;
$('#mem-back').onclick = $('#cnt-back').onclick = () => {
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('#game-win').classList.add('hidden');
  openGames();
};
window.addEventListener('resize', memLayout);
// al cambiar de idioma: la pregunta de contar cambia; en memoria se rearma (la Ñ entra o sale)
function gamesOnLang() {
  soundIcons();
  if (!$('#screen-count').classList.contains('hidden')) $('#cnt-question').textContent = cntQuestion();
  if (!$('#screen-memory').classList.contains('hidden') && mem.mode === 'case') memNew();
}
