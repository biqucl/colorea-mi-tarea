/* Colorea Mi Tarea – gato (tres en línea): contra la compu (fácil, medio, difícil) o de a dos */
'use strict';

const GATO_LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
const GATO_MODES = ['easy', 'medium', 'hard', 'two'];
const gato = {
  mode: GATO_MODES.includes(localStorage.getItem('gatoMode')) ? localStorage.getItem('gatoMode') : 'easy',
  board: Array(9).fill(null), turn: 'X', starter: 'O', over: false, busy: false, timer: 0,
  score: { X: 0, O: 0, tie: 0 }, cells: [],
};
// contra la compu el niño siempre es X y la compu es O; quién parte se va turnando
const gatoVsPc = () => gato.mode !== 'two';

function gatoResult(b) {
  for (const l of GATO_LINES) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { p: b[l[0]], line: l };
  return b.every(Boolean) ? { p: 'tie' } : null;
}
const gatoEmpty = b => b.map((v, i) => v ? -1 : i).filter(i => i >= 0);
const gatoPick = a => a[Math.floor(Math.random() * a.length)];

// jugada que completa tres en línea para `p`, si la hay
function gatoFinisher(b, p) {
  for (const i of gatoEmpty(b)) { b[i] = p; const w = gatoResult(b); b[i] = null; if (w && w.p === p) return i; }
  return -1;
}
// minimax: O gana → positivo, X gana → negativo; ganar antes vale más
function gatoMinimax(b, turn, depth) {
  const r = gatoResult(b);
  if (r) return r.p === 'O' ? 10 - depth : r.p === 'X' ? depth - 10 : 0;
  let best = turn === 'O' ? -Infinity : Infinity;
  for (const i of gatoEmpty(b)) {
    b[i] = turn;
    const s = gatoMinimax(b, turn === 'O' ? 'X' : 'O', depth + 1);
    b[i] = null;
    best = turn === 'O' ? Math.max(best, s) : Math.min(best, s);
  }
  return best;
}
function gatoPcMove() {
  const b = gato.board.slice(), free = gatoEmpty(b);
  if (gato.mode === 'easy') return gatoPick(free);
  if (gato.mode === 'medium') {
    const win = gatoFinisher(b, 'O'); if (win >= 0) return win;
    const block = gatoFinisher(b, 'X'); if (block >= 0) return block;
    return gatoPick(free);
  }
  let best = -Infinity, moves = [];
  for (const i of free) {
    b[i] = 'O';
    const s = gatoMinimax(b, 'X', 1);
    b[i] = null;
    if (s > best) { best = s; moves = [i]; } else if (s === best) moves.push(i);
  }
  return gatoPick(moves);
}

function gatoMark(p) {
  const svg = document.createElementNS(SVGNS, 'svg');
  svg.setAttribute('viewBox', '0 0 100 100');
  svg.setAttribute('class', 'gato-mark ' + (p === 'X' ? 'x' : 'o'));
  svg.innerHTML = p === 'X'
    ? '<path d="M24 24 L76 76 M76 24 L24 76"/>'
    : '<circle cx="50" cy="50" r="28"/>';
  return svg;
}
const gatoTag = p => `<span class="gato-tag ${p === 'X' ? 'x' : 'o'}">${p}</span>`;

function gatoNew() {
  clearTimeout(gato.timer);
  gato.board = Array(9).fill(null);
  gato.starter = gato.starter === 'X' ? 'O' : 'X';
  gato.turn = gato.starter;
  gato.over = false; gato.busy = false;
  $('#game-win').classList.add('hidden');
  const grid = $('#gato-board');
  grid.innerHTML = '';
  gato.cells = [...Array(9)].map((_, i) => {
    const b = document.createElement('button');
    b.className = 'gato-cell';
    b.setAttribute('aria-label', t('gatoCell', i + 1));
    b.onclick = () => gatoTap(i);
    grid.appendChild(b);
    return b;
  });
  $('#gato-again').classList.add('hidden');
  gatoButtons(); gatoScore(); gatoLayout();
  gatoNext();
}

function gatoPlay(i, p) {
  gato.board[i] = p;
  const c = gato.cells[i];
  c.appendChild(gatoMark(p));
  c.classList.add('taken');
  const r = gatoResult(gato.board);
  if (r) return gatoEnd(r);
  gato.turn = p === 'X' ? 'O' : 'X';
  gatoNext();
}

function gatoNext() {
  if (gatoVsPc() && gato.turn === 'O') {
    gato.busy = true;
    gatoStatus(t('gatoPcTurn'));
    gato.timer = setTimeout(() => { gato.busy = false; gatoPlay(gatoPcMove(), 'O'); }, 750);
  } else {
    gatoStatus(gatoVsPc() ? t('gatoYourTurn') + ' ' + gatoTag('X') : t('gatoTurnOf', gatoTag(gato.turn)));
  }
}

function gatoTap(i) {
  if (gato.over || gato.busy || gato.board[i]) return;
  if (gatoVsPc() && gato.turn !== 'X') return;
  gatoPlay(i, gato.turn);
}

function gatoEnd(r) {
  gato.over = true;
  gato.score[r.p]++;
  gatoScore();
  if (r.line) r.line.forEach(i => gato.cells[i].classList.add('win'));
  gato.cells.forEach(c => c.classList.add('taken'));
  let msg;
  if (r.p === 'tie') msg = t('gatoTie');
  else if (gatoVsPc()) msg = r.p === 'X' ? t('gatoYouWin') : t('gatoPcWins');
  else msg = t('gatoWins', r.p);
  gatoStatus(r.p === 'tie' || gatoVsPc() ? msg : t('gatoWins', gatoTag(r.p)));
  say(msg);
  if (gatoVsPc() && r.p === 'X') gato.timer = setTimeout(() => celebrate(gatoNew), 1400);
  else $('#gato-again').classList.remove('hidden');
}

function gatoStatus(html) { $('#gato-status').innerHTML = html; }
function gatoScore() {
  const s = gato.score, el = $('#gato-score');
  el.innerHTML = gatoVsPc()
    ? `<span>${t('gatoYou')} ${gatoTag('X')} <b>${s.X}</b></span><span>${t('gatoPc')} ${gatoTag('O')} <b>${s.O}</b></span><span>${t('gatoTies')} <b>${s.tie}</b></span>`
    : `<span>${gatoTag('X')} <b>${s.X}</b></span><span>${gatoTag('O')} <b>${s.O}</b></span><span>${t('gatoTies')} <b>${s.tie}</b></span>`;
}
function gatoButtons() {
  $$('.gato-mode').forEach(b => {
    const m = b.dataset.mode;
    b.classList.toggle('active', m === gato.mode);
    b.textContent = m === 'two' ? '👫' : t({ easy: 'gatoEasy', medium: 'gatoMedium', hard: 'gatoHard' }[m]);
    b.title = m === 'two' ? t('gatoTwo') : '🤖 ' + b.textContent;
  });
}
// tablero cuadrado lo más grande posible
function gatoLayout() {
  if ($('#screen-gato').classList.contains('hidden')) return;
  const r = $('#gato-wrap').getBoundingClientRect();
  const s = Math.floor(Math.max(180, Math.min(r.width - 24, r.height - 24, 720)));
  const g = $('#gato-board');
  g.style.width = g.style.height = s + 'px';
}

function openGato() { show('#screen-gato'); soundIcons(); gatoNew(); }
function gatoOnLang() {
  if ($('#screen-gato').classList.contains('hidden')) return;
  gatoButtons(); gatoScore();
  gato.cells.forEach((c, i) => c.setAttribute('aria-label', t('gatoCell', i + 1)));
  if (!gato.over) { clearTimeout(gato.timer); gato.busy = false; gatoNext(); }
}
$$('.gato-mode').forEach(b => b.onclick = () => {
  if (b.dataset.mode === gato.mode) return;
  gato.mode = b.dataset.mode;
  localStorage.setItem('gatoMode', gato.mode);
  gato.score = { X: 0, O: 0, tie: 0 };
  gato.starter = 'O';   // al cambiar de modo parte el niño (X)
  gatoNew();
});
$('#gato-restart').onclick = gatoNew;
$('#gato-again').onclick = gatoNew;
$('#games-gato').onclick = openGato;
$('#gato-back').onclick = () => {
  clearTimeout(gato.timer);
  if (window.speechSynthesis) speechSynthesis.cancel();
  $('#game-win').classList.add('hidden');
  openGames();
};
window.addEventListener('resize', gatoLayout);
