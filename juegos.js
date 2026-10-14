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
  if (!$('#screen-catch').classList.contains('hidden')) { catPrompt(); catButtons(); $('#catch-hint').textContent = t(cat.phase === 'catch' ? 'catchHint' : 'countHint'); }
}

// ---------- atrapa y cuenta ----------
// los animalitos caminan por el campo; se atrapan dibujando un círculo a su alrededor y al final se cuentan
const CATCH_ANIMALS = [
  { e: '🐻', es: 'ositos', en: 'bears' }, { e: '🐵', es: 'monitos', en: 'monkeys' },
  { e: '🐸', es: 'sapitos', en: 'frogs' }, { e: '🦊', es: 'zorritos', en: 'foxes' },
  { e: '🐷', es: 'cerditos', en: 'piglets' }, { e: '🐱', es: 'gatitos', en: 'kittens' },
  { e: '🐶', es: 'perritos', en: 'puppies' }, { e: '🦆', es: 'patitos', en: 'ducks' },
];
const cat = {
  max: +localStorage.getItem('catchMax') === 10 ? 10 : 5, fast: localStorage.getItem('catchFast') === '1',
  kind: null, n: 0, animals: [], loops: [], ghosts: [], stroke: null, pid: null, phase: 'catch',
  marked: [], stars: 0, busy: false, w: 0, h: 0, s: 80, raf: 0, last: 0,
};
const catCanvas = $('#catch-canvas'), catCtx = catCanvas.getContext('2d');
const catName = () => cat.kind[lang] || cat.kind.es;

function catResize() {
  const r = catCanvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  if (!r.width || !r.height) return;
  // al cambiar el tamaño, los animalitos y sus círculos conservan su posición relativa
  if (cat.w) {
    const kx = r.width / cat.w, ky = r.height / cat.h;
    cat.animals.forEach(a => { a.x *= kx; a.y *= ky; });
    cat.loops.forEach(l => l.forEach(p => { p.x *= kx; p.y *= ky; }));
  }
  cat.w = r.width; cat.h = r.height;
  cat.s = Math.max(56, Math.min(110, Math.min(r.width, r.height) / 6));
  catCanvas.width = Math.round(r.width * dpr); catCanvas.height = Math.round(r.height * dpr);
  catCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function catNew() {
  catResize();
  let n;
  do n = 1 + Math.floor(Math.random() * cat.max); while (n === cat.n && cat.max > 1);
  let kind;
  do kind = CATCH_ANIMALS[Math.floor(Math.random() * CATCH_ANIMALS.length)]; while (kind === cat.kind);
  const s = cat.s, animals = [];
  for (let i = 0; i < n; i++) {
    let x, y, tries = 0;
    do { x = s / 2 + Math.random() * (cat.w - s); y = s / 2 + Math.random() * (cat.h - s); }
    while (tries++ < 60 && animals.some(a => Math.hypot(a.x - x, a.y - y) < s * 1.3));
    animals.push({ x, y, ang: Math.random() * Math.PI * 2, caught: false, rest: 0 });
  }
  Object.assign(cat, { n, kind, animals, loops: [], ghosts: [], stroke: null, pid: null, phase: 'catch', marked: [], busy: false });
  $('#catch-answers').innerHTML = '';
  $('#catch-answers').classList.add('hidden');
  $('#catch-hint').textContent = t('catchHint');
  catPrompt();
  say(catPromptText());
}
function catPromptText() { return cat.phase === 'catch' ? t('catchGo', catName()) : t('catchHowMany', catName()); }
function catPrompt() { $('#catch-question').textContent = catPromptText(); }

// movimiento: pasean cambiando de rumbo de a poco y rebotan en los bordes.
// Atraparlos es sólo la parte divertida (la misión es contar), así que mientras se dibuja van mucho más lento.
function catStep(dt) {
  const s = cat.s, base = s * (cat.fast ? 1 : 0.5) * (cat.stroke ? 0.3 : 1);
  cat.animals.forEach(a => {
    if (a.caught) return;
    if (a.rest > 0) { a.rest -= dt; return; }
    if (Math.random() < dt * 0.15) { a.rest = 0.6 + Math.random() * 1.2; return; }   // a veces se detienen un ratito
    a.ang += (Math.random() - 0.5) * dt * 3;
    a.x += Math.cos(a.ang) * base * dt; a.y += Math.sin(a.ang) * base * dt;
    const m = s / 2;
    if (a.x < m) { a.x = m; a.ang = Math.PI - a.ang; }
    if (a.x > cat.w - m) { a.x = cat.w - m; a.ang = Math.PI - a.ang; }
    if (a.y < m) { a.y = m; a.ang = -a.ang; }
    if (a.y > cat.h - m) { a.y = cat.h - m; a.ang = -a.ang; }
  });
}

function catPath(pts, close) {
  catCtx.beginPath();
  pts.forEach((p, i) => i ? catCtx.lineTo(p.x, p.y) : catCtx.moveTo(p.x, p.y));
  if (close) catCtx.closePath();
}
function catDraw(now) {
  const c = catCtx, s = cat.s;
  c.clearRect(0, 0, cat.w, cat.h);
  c.lineJoin = c.lineCap = 'round';
  cat.loops.forEach(l => { catPath(l, true); c.fillStyle = 'rgba(255,212,0,.12)'; c.fill(); c.strokeStyle = '#f9a825'; c.lineWidth = 7; c.stroke(); });
  cat.ghosts = cat.ghosts.filter(g => now - g.t < 700);
  cat.ghosts.forEach(g => { catPath(g.pts); c.strokeStyle = `rgba(120,120,120,${1 - (now - g.t) / 700})`; c.lineWidth = 7; c.stroke(); });
  c.textAlign = 'center'; c.textBaseline = 'middle';
  c.font = `${Math.round(s * 0.8)}px "Apple Color Emoji","Segoe UI Emoji",sans-serif`;
  // sombra oscura alrededor para que se distingan bien del fondo blanco
  c.shadowColor = 'rgba(0,0,0,.6)'; c.shadowBlur = s * 0.1;
  c.fillStyle = '#000';   // opaco: el emoji toma la transparencia del color de relleno
  cat.animals.forEach(a => {
    c.save(); c.translate(a.x, a.y);
    if (!a.caught && Math.cos(a.ang) > 0) c.scale(-1, 1);   // mira hacia donde camina
    if (!a.caught && a.rest <= 0) c.rotate(Math.sin(now / 90 + a.x) * 0.08);   // se bambolea al caminar
    c.fillText(cat.kind.e, 0, 0);
    c.restore();
  });
  c.shadowBlur = 0;
  cat.marked.forEach((a, k) => {
    c.beginPath(); c.arc(a.x + s * 0.36, a.y - s * 0.36, s * 0.2, 0, Math.PI * 2); c.fillStyle = '#111'; c.fill();
    c.fillStyle = '#fff'; c.font = `bold ${Math.round(s * 0.26)}px Arial,sans-serif`;
    c.fillText(k + 1, a.x + s * 0.36, a.y - s * 0.35);
  });
  if (cat.stroke) { catPath(cat.stroke); c.strokeStyle = '#1565c0'; c.lineWidth = 8; c.stroke(); }
}
function catLoop(now) {
  if ($('#screen-catch').classList.contains('hidden')) return;
  const dt = Math.min(0.05, (now - (cat.last || now)) / 1000);
  cat.last = now;
  if (cat.phase === 'catch') catStep(dt);
  catDraw(now);
  cat.raf = requestAnimationFrame(catLoop);
}

function inPoly(x, y, pts) {
  let inside = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) {
    const a = pts[i], b = pts[j];
    if ((a.y > y) !== (b.y > y) && x < (b.x - a.x) * (y - a.y) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
function catPoint(e) { const r = catCanvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }

catCanvas.addEventListener('pointerdown', e => {
  if (cat.pid !== null) return;
  const p = catPoint(e);
  if (cat.phase === 'count') {
    // contar: tocar un animalito lo marca con su número; tocarlo otra vez lo desmarca
    const a = cat.animals.find(a => Math.hypot(a.x - p.x, a.y - p.y) < cat.s * 0.6);
    if (!a) return;
    const i = cat.marked.indexOf(a);
    if (i >= 0) cat.marked.splice(i, 1); else { cat.marked.push(a); say(String(cat.marked.length)); }
    return;
  }
  cat.pid = e.pointerId;
  cat.stroke = [p];
  try { catCanvas.setPointerCapture(e.pointerId); } catch (_) { }
});
catCanvas.addEventListener('pointermove', e => {
  if (e.pointerId !== cat.pid || !cat.stroke) return;
  const p = catPoint(e), last = cat.stroke[cat.stroke.length - 1];
  if (Math.hypot(p.x - last.x, p.y - last.y) > 3) cat.stroke.push(p);
});
function catEnd(e) {
  if (e.pointerId !== cat.pid) return;
  cat.pid = null;
  const pts = cat.stroke; cat.stroke = null;
  if (!pts || pts.length < 8) return;
  const xs = pts.map(p => p.x), ys = pts.map(p => p.y);
  const size = Math.hypot(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const gap = Math.hypot(pts[0].x - pts[pts.length - 1].x, pts[0].y - pts[pts.length - 1].y);
  // se acepta un círculo "casi cerrado": los niños no siempre unen las puntas
  const closed = size > cat.s * 0.6 && gap < Math.max(cat.s * 1.2, size * 0.35);
  // basta con encerrar parte del animalito (el centro o algún borde)
  const r = cat.s * 0.3, probe = [[0, 0], [r, 0], [-r, 0], [0, r], [0, -r]];
  const got = closed ? cat.animals.filter(a => !a.caught && probe.some(([dx, dy]) => inPoly(a.x + dx, a.y + dy, pts))) : [];
  if (!got.length) {
    cat.ghosts.push({ pts, t: performance.now() });
    toast(closed ? t('catchMissed') : t('catchClose'));
    return;
  }
  got.forEach(a => { a.caught = true; });
  cat.loops.push(pts);
  say(t('catchGot'));
  if (cat.animals.every(a => a.caught)) setTimeout(catAsk, 900);
}
catCanvas.addEventListener('pointerup', catEnd);
catCanvas.addEventListener('pointercancel', catEnd);

function catAsk() {
  cat.phase = 'count';
  catPrompt();
  $('#catch-hint').textContent = t('countHint');
  const n = cat.n, opts = new Set([n]);
  for (const d of shuffle([-2, -1, 1, 2])) { if (opts.size === 3) break; if (n + d >= 1 && n + d <= cat.max) opts.add(n + d); }
  for (let k = 1; opts.size < 3 && k <= 10; k++) opts.add(k);
  const box = $('#catch-answers');
  box.innerHTML = '';
  [...opts].sort((a, b) => a - b).forEach(v => {
    const b = document.createElement('button');
    b.className = 'cnt-ans'; b.textContent = v;
    b.onclick = () => catAnswer(v, b);
    box.appendChild(b);
  });
  box.classList.remove('hidden');
  say(catPromptText());
}
function catAnswer(v, b) {
  if (cat.busy || b.disabled) return;
  if (v === cat.n) {
    cat.busy = true;
    b.classList.add('right');
    cat.stars++;
    catStars();
    say(t('catchYes', v, catName()));
    if (cat.stars % 5 === 0) setTimeout(() => celebrate(catNew), 1400);
    else setTimeout(catNew, 2400);
  } else {
    b.classList.add('wrong'); b.disabled = true;
    say(t('tryAgain'));
  }
}
function catStars() { $('#catch-stars').textContent = '⭐ ' + cat.stars; }
function catButtons() {
  $$('.catch-range').forEach(b => b.classList.toggle('active', +b.dataset.max === cat.max));
  const sp = $('#catch-speed');
  sp.textContent = cat.fast ? '🐇' : '🐢';
  sp.title = t(cat.fast ? 'catchFast' : 'catchSlow');
}

function openCatch() {
  show('#screen-catch'); soundIcons(); catStars(); catButtons();
  cat.w = 0; catNew();
  cancelAnimationFrame(cat.raf); cat.last = 0; cat.raf = requestAnimationFrame(catLoop);
}
$$('.catch-range').forEach(b => b.onclick = () => { cat.max = +b.dataset.max; localStorage.setItem('catchMax', cat.max); catButtons(); catNew(); });
$('#catch-speed').onclick = () => { cat.fast = !cat.fast; localStorage.setItem('catchFast', cat.fast ? '1' : '0'); catButtons(); };
$('#catch-hear').onclick = () => say(catPromptText());
$('#games-catch').onclick = openCatch;
$('#catch-back').onclick = () => {
  cancelAnimationFrame(cat.raf);
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('#game-win').classList.add('hidden');
  openGames();
};
window.addEventListener('resize', () => { if (!$('#screen-catch').classList.contains('hidden')) catResize(); });
