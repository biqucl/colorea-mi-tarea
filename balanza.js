/* Colorea Mi Tarea – balanza: arrastrar números al plato vacío hasta que pese lo mismo que el otro lado */
'use strict';

const bal = {
  max: +localStorage.getItem('balMax') === 20 ? 20 : 10,
  target: 0, tiles: [], seq: 0, stars: 0, busy: false, drag: null, timer: 0, angle: 0,
};
const BAL_COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#00acc1', '#6d4c41', '#d81b60'];

// reparte n en k números entre 1 y maxTile
function balSplit(n, maxTile) {
  let k = Math.max(Math.ceil(n / maxTile), 2 + (n >= 6 && Math.random() < 0.35 ? 1 : 0));
  k = Math.min(k, n, 3);
  const parts = [];
  let rem = n;
  for (let i = 0; i < k - 1; i++) {
    const left = k - 1 - i;
    const lo = Math.max(1, rem - maxTile * left), hi = Math.min(maxTile, rem - left);
    const v = lo + Math.floor(Math.random() * (hi - lo + 1));
    parts.push(v); rem -= v;
  }
  parts.push(rem);
  return parts;
}

function balNew() {
  clearTimeout(bal.timer);
  bal.busy = false;
  const lo = bal.max === 10 ? 3 : 8, maxTile = bal.max === 10 ? 5 : 9;
  let target;
  do target = lo + Math.floor(Math.random() * (bal.max - lo + 1)); while (target === bal.target);
  bal.target = target;
  const parts = balSplit(target, maxTile);
  const extra = [...Array(6 - parts.length)].map(() => 1 + Math.floor(Math.random() * maxTile));
  const values = shuffle(parts.concat(extra));

  const tray = $('#bal-tray');
  tray.innerHTML = '';
  bal.tiles = values.map(v => {
    const slot = document.createElement('div'); slot.className = 'bal-slot';
    const el = document.createElement('div');
    el.className = 'bal-tile';
    el.textContent = v;
    el.style.background = BAL_COLORS[(v - 1) % BAL_COLORS.length];
    if (v === 3) el.style.color = '#111';
    const tile = { v, el, slot, on: false };
    el.addEventListener('pointerdown', e => balDown(e, tile));
    slot.appendChild(el); tray.appendChild(slot);
    return tile;
  });
  // vaciar el plato: los números de la ronda anterior no siguen ahí
  $('#bal-right .bal-items').innerHTML = '';
  const left = $('#bal-left .bal-items');
  left.innerHTML = `<button class="bal-weight" aria-label="${target}"><span>${target}</span></button>`;
  // al tocar la pesa dice su número
  const w = left.firstChild;
  w.onclick = () => { say(String(target)); w.classList.remove('pop'); void w.offsetWidth; w.classList.add('pop'); };
  $('#bal-stage').classList.remove('even');
  $('#bal-question').textContent = t('balGo');
  balButtons(); balStars();
  balRender(false);
  say(t('balGo'));
}

const balOnPan = () => bal.tiles.filter(x => x.on).sort((a, b) => a.at - b.at);
const balSum = () => balOnPan().reduce((s, x) => s + x.v, 0);

function balRender(check = true) {
  const right = $('#bal-right .bal-items');
  bal.tiles.forEach(x => {
    const parent = x.on ? right : x.slot;
    if (x.el.parentNode !== parent) parent.appendChild(x.el);
    x.el.classList.toggle('on-pan', x.on);
  });
  const on = balOnPan(), sum = balSum(), d = sum - bal.target;
  // el lado que pesa más baja; con más diferencia se inclina más (hasta 14°)
  bal.angle = d === 0 ? 0 : Math.sign(d) * Math.min(14, 4 + Math.abs(d) * 1.5);
  $('#bal-sum').textContent = on.length ? on.map(x => x.v).join(' + ') + (d === 0 ? ' = ' + sum : '') : '';
  balLayout();
  if (!check || !on.length) return;
  if (d === 0) balWin(on);
  else if (d > 0) say(t('balTooMuch'));
}

function balWin(on) {
  bal.busy = true;
  bal.stars++;
  balStars();
  $('#bal-stage').classList.add('even');
  $('#bal-question').textContent = t('balEven');
  say(t('balYes', bal.target, on.map(x => x.v)));
  if (bal.stars % 5 === 0) bal.timer = setTimeout(() => celebrate(balNew), 2600);
  else bal.timer = setTimeout(balNew, 3600);
}

// posiciones: la barra gira en el centro; los platos cuelgan de sus puntas y siguen derechos
function balLayout() {
  if ($('#screen-balance').classList.contains('hidden')) return;
  const stage = $('#bal-stage'), r = stage.getBoundingClientRect();
  const w = r.width, h = r.height;
  // en pantallas angostas los platos son más anchos que el brazo para que quepan dos números por fila
  const narrow = w < 600;
  const L = narrow ? w * 0.27 : Math.min(w * 0.3, 380, h * 1.1), cx = w / 2, cy = Math.max(30, h * (narrow ? 0.1 : 0.2));
  const a = bal.angle * Math.PI / 180;
  const beam = $('#bal-beam');
  beam.style.width = 2 * L + 40 + 'px';
  beam.style.left = cx - L - 20 + 'px';
  beam.style.top = cy - 9 + 'px';
  beam.style.transform = `rotate(${bal.angle}deg)`;
  const post = $('#bal-post');
  post.style.left = cx - 14 + 'px';
  post.style.top = cy + 'px';
  post.style.height = h - cy + 'px';
  $('#bal-pivot').style.left = cx - 20 + 'px';
  $('#bal-pivot').style.top = cy - 20 + 'px';
  const pw = narrow ? w * 0.46 : Math.min(L * 1.05, 400, w * 0.44);
  [['#bal-left', -1], ['#bal-right', 1]].forEach(([sel, s]) => {
    const p = $(sel);
    p.style.width = pw + 'px';
    p.style.left = cx + s * L * Math.cos(a) + 'px';
    p.style.top = cy + s * L * Math.sin(a) + 'px';
  });
}

// ---- arrastrar (o tocar: del montón al plato y del plato al montón) ----
function balDown(e, tile) {
  if (bal.busy || bal.drag) return;
  e.preventDefault();
  const r = tile.el.getBoundingClientRect();
  bal.drag = { tile, id: e.pointerId, dx: e.clientX - r.left, dy: e.clientY - r.top, x0: e.clientX, y0: e.clientY, moved: false };
  const el = tile.el;
  el.classList.add('dragging');
  el.style.width = r.width + 'px'; el.style.height = r.height + 'px';
  el.style.left = r.left + 'px'; el.style.top = r.top + 'px';
  document.body.appendChild(el);
}
function balMove(e) {
  const d = bal.drag;
  if (!d || e.pointerId !== d.id) return;
  if (Math.hypot(e.clientX - d.x0, e.clientY - d.y0) > 10) d.moved = true;
  d.tile.el.style.left = e.clientX - d.dx + 'px';
  d.tile.el.style.top = e.clientY - d.dy + 'px';
  $('#bal-right').classList.toggle('hover', balOverPan(e));
}
function balOverPan(e) {
  const r = $('#bal-right').getBoundingClientRect(), m = 50;
  return e.clientX > r.left - m && e.clientX < r.right + m && e.clientY > r.top - 2 * m && e.clientY < r.bottom + m;
}
function balUp(e) {
  const d = bal.drag;
  if (!d || e.pointerId !== d.id) return;
  bal.drag = null;
  const tile = d.tile, el = tile.el, was = tile.on;
  el.classList.remove('dragging');
  el.style.width = el.style.height = el.style.left = el.style.top = '';
  $('#bal-right').classList.remove('hover');
  tile.on = d.moved ? (e.type !== 'pointercancel' && balOverPan(e)) : !tile.on;
  if (tile.on && !was) { tile.at = ++bal.seq; say(String(tile.v)); }
  balRender(tile.on !== was);
}
window.addEventListener('pointermove', balMove);
window.addEventListener('pointerup', balUp);
window.addEventListener('pointercancel', balUp);

function balStars() { $('#bal-stars').textContent = '⭐ ' + bal.stars; }
function balButtons() { $$('.bal-range').forEach(b => b.classList.toggle('active', +b.dataset.max === bal.max)); }

function openBalance() { show('#screen-balance'); soundIcons(); balNew(); }
function balOnLang() {
  if ($('#screen-balance').classList.contains('hidden')) return;
  $('#bal-question').textContent = t($('#bal-stage').classList.contains('even') ? 'balEven' : 'balGo');
}
$$('.bal-range').forEach(b => b.onclick = () => { bal.max = +b.dataset.max; localStorage.setItem('balMax', bal.max); balNew(); });
$('#bal-hear').onclick = () => say($('#bal-question').textContent);
$('#bal-restart').onclick = balNew;
$('#games-balance').onclick = openBalance;
$('#bal-back').onclick = () => {
  clearTimeout(bal.timer);
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('#game-win').classList.add('hidden');
  openGames();
};
window.addEventListener('resize', balLayout);
