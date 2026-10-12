/* Colorea Mi Tarea – caligrafía: trazos animados de letras y números */
'use strict';

// Cada glifo es la lista de sus trazos (path SVG) en el orden en que se escriben.
// Cuadrícula: ancho 0–100. Mayúsculas y números van de y=0 a y=100.
// Minúsculas: cuerpo de y=50 a y=100, ascendentes desde y=0, descendentes hasta y=140.
// área visible: las minúsculas necesitan espacio abajo para las colas (g, j, p, q, y)
const CAL_VIEWS = { upper: { x: -8, y: -30, w: 116, h: 142 }, digits: { x: -8, y: -24, w: 116, h: 136 }, lower: { x: -8, y: -22, w: 116, h: 172 } };
let CAL_VIEW = CAL_VIEWS.upper;
const TILDE_UP = 'M30 -14 C38 -24 45 -22 50 -16 C55 -10 62 -8 70 -18';
const TILDE_LOW = 'M30 36 C38 26 45 28 50 34 C55 40 62 42 70 32';
const RING = 'M75 75 A25 25 0 0 0 25 75 A25 25 0 0 0 75 75';   // círculo de a, d, g, q (empieza a la derecha, va por arriba)
const BOWL = 'M25 75 A25 25 0 0 1 75 75 A25 25 0 0 1 25 75';   // panza de b, p (sale del palo, va por arriba)
const GLYPHS = {
  upper: {
    A: ['M50 0 L15 100', 'M50 0 L85 100', 'M28 65 H72'],
    B: ['M20 0 V100', 'M20 0 H55 A25 25 0 0 1 55 50 H20', 'M20 50 H58 A25 25 0 0 1 58 100 H20'],
    C: ['M82 22 A38 50 0 1 0 82 78'],
    D: ['M20 0 V100', 'M20 0 H45 A40 50 0 0 1 45 100 H20'],
    E: ['M22 0 V100', 'M22 0 H80', 'M22 50 H70', 'M22 100 H80'],
    F: ['M22 0 V100', 'M22 0 H80', 'M22 50 H70'],
    G: ['M82 22 A38 50 0 1 0 88.3 55', 'M88.3 55 H58'],
    H: ['M18 0 V100', 'M82 0 V100', 'M18 50 H82'],
    I: ['M50 0 V100', 'M30 0 H70', 'M30 100 H70'],
    J: ['M70 0 V72 A22 28 0 0 1 26 72', 'M50 0 H88'],
    K: ['M22 0 V100', 'M80 0 L22 58', 'M42 40 L82 100'],
    L: ['M25 0 V100', 'M25 100 H80'],
    M: ['M15 0 V100', 'M15 0 L50 65 L85 0 V100'],
    N: ['M20 0 V100', 'M20 0 L80 100 V0'],
    Ñ: ['M20 0 V100', 'M20 0 L80 100 V0', TILDE_UP],
    O: ['M50 0 A35 50 0 0 0 50 100 A35 50 0 0 0 50 0'],
    P: ['M22 0 V100', 'M22 0 H55 A25 25 0 0 1 55 50 H22'],
    Q: ['M50 0 A35 50 0 0 0 50 100 A35 50 0 0 0 50 0', 'M58 72 L88 104'],
    R: ['M22 0 V100', 'M22 0 H55 A25 25 0 0 1 55 50 H22', 'M50 50 L82 100'],
    S: ['M80 15 C70 -5 22 -5 22 25 C22 52 80 45 80 75 C80 105 25 105 18 85'],
    T: ['M50 0 V100', 'M15 0 H85'],
    U: ['M20 0 V65 A30 35 0 0 0 80 65 V0'],
    V: ['M15 0 L50 100 L85 0'],
    W: ['M10 0 L30 100 L50 30 L70 100 L90 0'],
    X: ['M18 0 L82 100', 'M82 0 L18 100'],
    Y: ['M18 0 L50 50', 'M82 0 L50 50 V100'],
    Z: ['M18 0 H82 L18 100 H82'],
  },
  lower: {
    a: [RING, 'M75 50 V100'],
    b: ['M25 0 V100', BOWL],
    c: ['M69 59 A25 25 0 1 0 69 91'],
    d: [RING, 'M75 0 V100'],
    e: ['M25 75 H75 A25 25 0 1 0 68 93'],
    f: ['M72 10 C64 -2 40 -2 40 22 V100', 'M24 50 H62'],
    g: [RING, 'M75 50 V125 A23.5 18 0 0 1 28 125'],
    h: ['M25 0 V100', 'M25 75 A25 25 0 0 1 75 75 V100'],
    i: ['M50 50 V100', 'M50 28 V32'],
    j: ['M55 50 V125 A20 18 0 0 1 15 125', 'M55 28 V32'],
    k: ['M25 0 V100', 'M70 50 L25 80', 'M42 70 L75 100'],
    l: ['M50 0 V100'],
    m: ['M15 50 V100', 'M15 70 A17.5 20 0 0 1 50 70 V100', 'M50 70 A17.5 20 0 0 1 85 70 V100'],
    n: ['M25 50 V100', 'M25 75 A25 25 0 0 1 75 75 V100'],
    ñ: ['M25 50 V100', 'M25 75 A25 25 0 0 1 75 75 V100', TILDE_LOW],
    o: ['M50 50 A25 25 0 0 0 50 100 A25 25 0 0 0 50 50'],
    p: ['M25 50 V140', BOWL],
    q: [RING, 'M75 50 V140'],
    r: ['M30 50 V100', 'M30 72 C38 52 58 48 74 55'],
    s: ['M72 58 C66 47 30 47 30 62 C30 76 72 72 72 88 C72 104 32 104 26 92'],
    t: ['M45 15 V100', 'M25 50 H68'],
    u: ['M25 50 V75 A25 25 0 0 0 75 75', 'M75 50 V100'],
    v: ['M20 50 L50 100 L80 50'],
    w: ['M10 50 L30 100 L50 60 L70 100 L90 50'],
    x: ['M22 50 L78 100', 'M78 50 L22 100'],
    y: ['M22 50 L50 100', 'M78 50 L35 140'],
    z: ['M25 50 H75 L25 100 H75'],
  },
  digits: {
    0: ['M50 0 A30 50 0 0 0 50 100 A30 50 0 0 0 50 0'],
    1: ['M32 20 L52 0 V100'],
    2: ['M22 25 C22 -5 78 -5 78 25 C78 50 40 70 20 100 H80'],
    3: ['M22 12 C35 -4 78 -4 78 24 C78 42 62 48 45 48 C68 48 82 58 82 75 C82 104 35 106 20 88'],
    4: ['M50 0 L15 70 H85', 'M65 30 V100'],
    5: ['M30 0 L26 45 C45 32 80 38 80 70 C80 105 30 105 20 88', 'M30 0 H76'],
    6: ['M72 6 C40 -8 20 30 20 65 C20 90 35 100 50 100 C70 100 80 88 80 72 C80 55 68 45 50 45 C35 45 22 55 20 68'],
    7: ['M20 0 H80 L40 100'],
    8: ['M72 14 C66 3 58 0 50 0 C36 0 26 9 26 24 C26 52 80 46 80 76 C80 92 67 100 50 100 C33 100 20 92 20 76 C20 46 74 52 74 24 C74 18 73 16 72 14'],
    9: ['M78 25 C78 10 66 0 50 0 C34 0 22 12 22 25 C22 40 34 50 50 50 C66 50 78 40 78 25', 'M78 25 V100'],
  },
};
const CAL_SPEED = 90;     // unidades por segundo
const CAL_PAUSE = 350;    // pausa entre trazos (ms)
const CAL_WIDTH = 9;      // grosor del trazo, en unidades

const cal = { set: 'upper', ch: 'A', model: null, practice: null, raf: 0, ink: [], cur: null, pen: 0 };

const SVGNS = 'http://www.w3.org/2000/svg';
function svgEl(tag, attrs, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
}
// la Ñ solo aparece en español
function calChars() { return Object.keys(GLYPHS[cal.set]).filter(c => lang === 'es' || !/[Ññ]/.test(c)); }
function calStroke(d, color, w, parent, extra = {}) {
  return svgEl('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...extra }, parent);
}
// renglones de cuaderno: línea superior, media punteada, base y (minúsculas) descendente
function calGuides(svg) {
  const line = (y, color, w, dash) => svgEl('line', { x1: -1000, x2: 1100, y1: y, y2: y, stroke: color, 'stroke-width': w, ...(dash ? { 'stroke-dasharray': dash } : {}) }, svg);
  line(0, '#90caf9', 1.5);
  line(50, '#90caf9', 1.5, '5 5');
  line(100, '#e57373', 2);
  if (cal.set === 'lower') line(140, '#90caf9', 1.2, '3 6');
}
// un color distinto por trazo, para diferenciarlos fácilmente
const CAL_COLORS = ['#e53935', '#1e88e5', '#43a047', '#fb8c00', '#8e24aa'];
const calColor = i => CAL_COLORS[i % CAL_COLORS.length];
// número del trazo, un poco antes de donde empieza; si choca con otro número se corre hacia un lado
function calBadge(svg, path, n, color, placed) {
  const p0 = path.getPointAtLength(0), p1 = path.getPointAtLength(Math.min(3, path.getTotalLength()));
  const back = Math.atan2(p0.y - p1.y, p0.x - p1.x);
  let best = null;
  for (const da of [0, -0.9, 0.9, -1.6, 1.6]) {
    const x = p0.x + Math.cos(back + da) * 12, y = p0.y + Math.sin(back + da) * 12;
    const gap = Math.min(99, ...placed.map(q => Math.hypot(q.x - x, q.y - y)));
    if (!best || gap > best.gap + 0.5) best = { x, y, gap };
    if (gap >= 17) break;
  }
  const { x, y } = best; placed.push({ x, y });
  const g = svgEl('g', {}, svg);
  svgEl('circle', { cx: x, cy: y, r: 7.5, fill: color, stroke: '#fff', 'stroke-width': 1.5 }, g);
  const tx = svgEl('text', { x, y: y + 3.6, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 700, fill: '#fff', 'font-family': 'Arial, sans-serif' }, g);
  tx.textContent = n;
  return g;
}
// punta de flecha que apunta hacia donde avanza el trazo
function calArrow(svg, color) {
  return svgEl('polygon', { points: '9,0 -6,-7.5 -3,0 -6,7.5', fill: color, stroke: '#fff', 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, svg);
}
function calPlaceArrow(arrow, path, len, ahead = 0) {
  const L = path.getTotalLength();
  const a = path.getPointAtLength(Math.max(0, Math.min(L, len - 2))), b = path.getPointAtLength(Math.min(L, Math.max(len, 2)));
  let ang = Math.atan2(b.y - a.y, b.x - a.x);
  if (L < 6) ang = Math.PI / 2;   // los puntos de la i y la j
  const x = b.x + Math.cos(ang) * ahead, y = b.y + Math.sin(ang) * ahead;
  arrow.setAttribute('transform', `translate(${x} ${y}) rotate(${ang * 180 / Math.PI})`);
}
function calBuildPanel(svg, practice) {
  svg.replaceChildren();
  svg.setAttribute('viewBox', `${CAL_VIEW.x} ${CAL_VIEW.y} ${CAL_VIEW.w} ${CAL_VIEW.h}`);
  calGuides(svg);
  const strokes = GLYPHS[cal.set][cal.ch];
  strokes.forEach((d, i) => {
    if (practice) calStroke(d, calColor(i), 3.5, svg, { 'stroke-dasharray': '1 7' });
    else calStroke(d, '#e6e6e6', CAL_WIDTH, svg);
  });
  const inks = strokes.map((d, i) => calStroke(d, calColor(i), CAL_WIDTH, svg, practice ? { opacity: 0.4 } : {}));
  // flecha fija al final de cada trazo (como en las hojas de caligrafía)
  const ends = inks.map((p, i) => { const a = calArrow(svg, calColor(i)); calPlaceArrow(a, p, p.getTotalLength(), 7); return a; });
  const placed = [];
  const badges = inks.map((p, i) => calBadge(svg, p, i + 1, calColor(i), placed));
  const pen = calArrow(svg, '#000');
  return { inks, ends, badges, pen, practice };
}

// animación: los dos paneles escriben la letra al mismo tiempo, con una flecha que avanza
function calPlay() {
  cancelAnimationFrame(cal.raf);
  const panels = [cal.model, cal.practice];
  const lens = cal.model.inks.map(p => p.getTotalLength());
  const plan = []; let t = 400;
  for (const L of lens) { const dur = Math.max(400, L / CAL_SPEED * 1000); plan.push({ start: t, dur, L }); t += dur + CAL_PAUSE; }
  for (const pn of panels) {
    pn.inks.forEach((p, i) => { p.style.strokeDasharray = `${lens[i] + 1} ${lens[i] + 1}`; p.style.strokeDashoffset = lens[i] + 1; p.style.visibility = 'hidden'; });
    pn.badges.forEach(b => { b.style.visibility = pn.practice ? 'visible' : 'hidden'; });
    pn.ends.forEach(a => { a.style.visibility = 'hidden'; });
    pn.pen.style.visibility = 'hidden';
  }
  const t0 = performance.now();
  const step = now => {
    const el = now - t0;
    for (const pn of panels) {
      let penAt = null;
      plan.forEach((s, i) => {
        if (el < s.start) return;
        const k = Math.min(1, (el - s.start) / s.dur);
        const p = pn.inks[i];
        p.style.visibility = 'visible';
        p.style.strokeDashoffset = (s.L + 1) * (1 - k);
        pn.badges[i].style.visibility = 'visible';
        pn.ends[i].style.visibility = k < 1 ? 'hidden' : 'visible';
        if (k < 1) penAt = { i, len: s.L * k };
      });
      if (penAt) {
        calPlaceArrow(pn.pen, pn.inks[penAt.i], penAt.len, 4);
        pn.pen.setAttribute('fill', calColor(penAt.i));
        pn.pen.style.visibility = 'visible';
      } else pn.pen.style.visibility = 'hidden';
    }
    if (el < t) cal.raf = requestAnimationFrame(step);
  };
  cal.raf = requestAnimationFrame(step);
}

// ---------- hoja de práctica (el niño escribe con el dedo) ----------
const calCanvas = $('#cal-canvas'), calCtx = calCanvas.getContext('2d');
function calMetrics() {
  const r = calCanvas.getBoundingClientRect();
  const s = Math.min(r.width / CAL_VIEW.w, r.height / CAL_VIEW.h);
  return { r, s, ox: (r.width - CAL_VIEW.w * s) / 2 - CAL_VIEW.x * s, oy: (r.height - CAL_VIEW.h * s) / 2 - CAL_VIEW.y * s };
}
function calPen(color) {
  const m = calMetrics(), dpr = window.devicePixelRatio || 1;
  calCtx.setTransform(dpr * m.s, 0, 0, dpr * m.s, dpr * m.ox, dpr * m.oy);
  calCtx.strokeStyle = color; calCtx.lineWidth = CAL_WIDTH; calCtx.lineCap = calCtx.lineJoin = 'round';
}
function calRedraw() {
  calCtx.setTransform(1, 0, 0, 1, 0, 0);
  calCtx.clearRect(0, 0, calCanvas.width, calCanvas.height);
  for (const { color, pts } of cal.ink) {
    calPen(color);
    calCtx.beginPath(); calCtx.moveTo(pts[0].x, pts[0].y);
    if (pts.length === 1) calCtx.lineTo(pts[0].x + 0.01, pts[0].y);
    for (const p of pts) calCtx.lineTo(p.x, p.y);
    calCtx.stroke();
  }
}
function calResize() {
  const r = calCanvas.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
  calCanvas.width = Math.round(r.width * dpr); calCanvas.height = Math.round(r.height * dpr);
  calRedraw();
}
function calPoint(e) {
  const m = calMetrics();
  return { x: (e.clientX - m.r.left - m.ox) / m.s, y: (e.clientY - m.r.top - m.oy) / m.s };
}
calCanvas.addEventListener('pointerdown', e => {
  if (cal.cur) return;   // un solo dedo a la vez
  calCanvas.setPointerCapture(e.pointerId);
  const p = calPoint(e);
  cal.cur = { id: e.pointerId, color: calColor(cal.pen), pts: [p] }; cal.ink.push(cal.cur);
  calPen(cal.cur.color); calCtx.beginPath(); calCtx.moveTo(p.x, p.y); calCtx.lineTo(p.x + 0.01, p.y); calCtx.stroke();
});
calCanvas.addEventListener('pointermove', e => {
  if (!cal.cur || cal.cur.id !== e.pointerId) return;
  const p = calPoint(e), pts = cal.cur.pts, last = pts[pts.length - 1];
  pts.push(p);
  calPen(cal.cur.color); calCtx.beginPath(); calCtx.moveTo(last.x, last.y); calCtx.lineTo(p.x, p.y); calCtx.stroke();
});
function calEnd(e) { if (cal.cur && cal.cur.id === e.pointerId) cal.cur = null; }
calCanvas.addEventListener('pointerup', calEnd);
calCanvas.addEventListener('pointercancel', calEnd);

// botones de color: uno por trazo, para escribir cada trazo del mismo color que en el modelo
function calRenderPens() {
  const box = $('#cal-pens'), n = GLYPHS[cal.set][cal.ch].length;
  box.replaceChildren();
  box.classList.toggle('hidden', n < 2);
  for (let i = 0; i < n; i++) {
    const b = document.createElement('button');
    b.className = 'cal-pen' + (i === cal.pen ? ' active' : '');
    b.style.background = calColor(i); b.textContent = i + 1;
    b.setAttribute('aria-label', t('calStroke', i + 1));
    b.onclick = () => { cal.pen = i; $$('.cal-pen').forEach((x, j) => x.classList.toggle('active', j === i)); };
    box.appendChild(b);
  }
}

// ---------- pantalla ----------
function calRenderChips() {
  const box = $('#cal-chips'); box.replaceChildren();
  for (const c of calChars()) {
    const b = document.createElement('button');
    b.className = 'cal-chip' + (c === cal.ch ? ' active' : '');
    b.setAttribute('aria-label', c);
    const svg = svgEl('svg', { viewBox: cal.set === 'lower' ? '-10 -15 120 165' : '-10 -15 120 130', 'aria-hidden': 'true' }, b);
    for (const d of GLYPHS[cal.set][c]) calStroke(d, 'currentColor', 12, svg);
    b.onclick = () => calSelect(c);
    box.appendChild(b);
  }
  $$('.cal-set').forEach(b => b.classList.toggle('active', b.dataset.set === cal.set));
}
function calSelect(ch) {
  cal.ch = ch;
  CAL_VIEW = CAL_VIEWS[cal.set];
  $$('.cal-chip').forEach(b => b.classList.toggle('active', b.getAttribute('aria-label') === ch));
  const chip = $$('.cal-chip').find(b => b.classList.contains('active'));
  if (chip) chip.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  cal.model = calBuildPanel($('#cal-model svg'), false);
  cal.practice = calBuildPanel($('#cal-practice svg'), true);
  cal.ink = []; cal.cur = null; cal.pen = 0; calRenderPens(); calResize();
  calPlay();
}
function calSetSet(set) {
  cal.set = set;
  calRenderChips();
  calSelect(calChars()[0]);
}
function calStep(dir) {
  const cs = calChars(), i = cs.indexOf(cal.ch);
  calSelect(cs[(i + dir + cs.length) % cs.length]);
}
function openCalligraphy() {
  show('#screen-callig');
  calResize();
  calRenderChips();
  calSelect(calChars().includes(cal.ch) ? cal.ch : calChars()[0]);
}
// al cambiar de idioma se agrega o quita la Ñ
function calOnLang() {
  if ($('#screen-callig').classList.contains('hidden')) return;
  calRenderChips();
  if (!calChars().includes(cal.ch)) calSelect(calChars()[0]);
}

$('#btn-callig').onclick = openCalligraphy;
$('#cal-back').onclick = () => { cancelAnimationFrame(cal.raf); show('#screen-home'); };
$$('.cal-set').forEach(b => b.onclick = () => calSetSet(b.dataset.set));
$('#cal-play').onclick = calPlay;
$('#cal-model').onclick = calPlay;
$('#cal-prev').onclick = () => calStep(-1);
$('#cal-next').onclick = () => calStep(1);
$('#cal-clear').onclick = () => { cal.ink = []; cal.cur = null; calRedraw(); };
$('#cal-undo').onclick = () => { if (cal.ink.pop()) calRedraw(); else toast(t('nothingToUndo')); };
window.addEventListener('resize', () => { if (!$('#screen-callig').classList.contains('hidden')) calResize(); });
