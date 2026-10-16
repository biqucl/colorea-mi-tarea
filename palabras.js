/* Colorea Mi Tarea – palabras a la vista (sight words): tarjetas grandes; el adulto marca bien o mal */
'use strict';

// Kindergarten Savvas Sight Words
const SIGHT_UNITS = [
  ['I', 'am', 'the', 'like', 'to', 'a', 'have', 'is', 'he', 'my', 'we', 'make', 'for', 'me', 'with', 'she', 'see', 'look'],
  ['are', 'that', 'of', 'they', 'you', 'do', 'one', 'two', 'three', 'four', 'five', 'here', 'go', 'from', 'yellow', 'blue', 'green', 'what'],
  ['said', 'was', 'where', 'come', 'play', 'any', 'down', 'her', 'how', 'away', 'give', 'little', 'funny', 'were', 'some', 'going', 'know', 'live'],
];

const wd = {
  unit: 0, words: [], i: 0, results: [], busy: false,
  mixed: localStorage.getItem('wordsMixed') !== '0',
};
// último resultado de cada unidad: { ok, total, date, missed }
function wdHistory() { try { return JSON.parse(localStorage.getItem('wordsHistory')) || {}; } catch (_) { return {}; } }

function wdPickView() {
  wd.busy = false;
  $('#wd-pick').classList.remove('hidden');
  $('#wd-play').classList.add('hidden');
  $('#wd-count').textContent = '';
  const box = $('#wd-units'), hist = wdHistory();
  box.innerHTML = '';
  SIGHT_UNITS.forEach((words, u) => {
    const b = document.createElement('button');
    b.className = 'game-pick wd-unit';
    const h = hist[u];
    b.innerHTML = `<b>${t('wordsUnit', u + 1)}</b><span class="wd-preview">${words.slice(0, 6).join(' · ')} …</span>` +
      `<span class="wd-last">${h ? t('wordsLast', h.ok, h.total, h.date) : t('wordsCount', words.length)}</span>`;
    b.onclick = () => wdStart(u, words);
    box.appendChild(b);
  });
  wdMixBtn();
}

function wdStart(unit, words) {
  wd.unit = unit;
  wd.words = wd.mixed ? shuffle(words.slice()) : words.slice();
  wd.i = 0; wd.results = []; wd.busy = false;
  $('#wd-pick').classList.add('hidden');
  $('#wd-play').classList.remove('hidden');
  wdShow('in');
}

// el texto ocupa toda la tarjeta: más grande cuanto más corta la palabra
function wdFit() {
  const card = $('#wd-card'), w = $('#wd-word');
  if (!card.offsetWidth) return;
  const len = Math.max(2, w.textContent.length);
  w.style.fontSize = Math.floor(Math.min(card.clientHeight * 0.62, card.clientWidth * 0.9 / (len * 0.62))) + 'px';
}

function wdShow(anim) {
  const card = $('#wd-card');
  $('#wd-word').textContent = wd.words[wd.i];
  card.className = 'wd-card' + (anim ? ' ' + anim : '');
  wdFit();
  $('#wd-count').textContent = `${wd.i + 1} / ${wd.words.length}`;
  $('#wd-bar-fill').style.width = (wd.i / wd.words.length * 100) + '%';
  $('#wd-undo').disabled = wd.i === 0;
}

function wdMark(ok) {
  if (wd.busy || $('#wd-play').classList.contains('hidden')) return;
  wd.busy = true;
  wd.results[wd.i] = ok;
  $('#wd-card').className = 'wd-card ' + (ok ? 'out-ok' : 'out-no');
  setTimeout(() => {
    wd.busy = false;
    wd.i++;
    if (wd.i >= wd.words.length) wdFinish(); else wdShow('in');
  }, 420);
}

function wdUndo() {
  if (wd.busy || wd.i === 0) return;
  wd.i--;
  wd.results.length = wd.i;
  wdShow('in-back');
}

function wdFinish() {
  $('#wd-bar-fill').style.width = '100%';
  const total = wd.words.length, ok = wd.results.filter(Boolean).length;
  const missed = wd.words.filter((_, k) => !wd.results[k]);
  const pct = ok / total;
  const d = new Date();
  if (wd.words.length === SIGHT_UNITS[wd.unit].length) {   // solo una vuelta completa cuenta como resultado de la unidad
    const hist = wdHistory();
    hist[wd.unit] = { ok, total, date: `${d.getMonth() + 1}/${d.getDate()}`, missed };
    localStorage.setItem('wordsHistory', JSON.stringify(hist));
  }

  // nivel: 3 = todas, 2 = casi todas, 1 = la mitad o más, 0 = a seguir practicando
  const level = pct === 1 ? 3 : pct >= 0.75 ? 2 : pct >= 0.5 ? 1 : 0;
  const ICON = ['💪', '👍', '🎉', '🏆'];
  $('#wd-res-icon').textContent = ICON[level];
  $('#wd-res-icon').className = 'win-big wd-res-icon lvl' + level;
  $('#wd-res-title').textContent = t('wordsLevel' + level);
  $('#wd-res-score').textContent = t('wordsScore', ok, total);
  $('#wd-res-stars').innerHTML = [1, 2, 3].map(s => `<span class="${s <= level ? 'on' : 'off'}" style="animation-delay:${0.3 + s * 0.25}s">⭐</span>`).join('');
  const mb = $('#wd-res-missed');
  mb.innerHTML = '';
  missed.forEach(w => {
    const b = document.createElement('button');
    b.className = 'wd-chip'; b.textContent = w;
    b.onclick = () => say(w, 'en');
    mb.appendChild(b);
  });
  $('#wd-res-missed-wrap').classList.toggle('hidden', !missed.length);
  $('#wd-res-retry').classList.toggle('hidden', !missed.length);
  $('#wd-res-retry').onclick = () => { wdCloseResult(); wdStart(wd.unit, missed); };
  $('#wd-res-again').onclick = () => { wdCloseResult(); wdStart(wd.unit, SIGHT_UNITS[wd.unit]); };
  $('#wd-res-units').onclick = () => { wdCloseResult(); wdPickView(); };
  $('#wd-result').classList.remove('hidden');
  say(t('wordsLevel' + level));
  if (level >= 1) wdConfetti(level === 3 ? 160 : level === 2 ? 90 : 40);
}

function wdCloseResult() {
  $('#wd-result').classList.add('hidden');
  $('#wd-confetti').innerHTML = '';
}

// confeti con divs animados por CSS
function wdConfetti(n) {
  const box = $('#wd-confetti');
  box.innerHTML = '';
  const COLORS = ['#ffd400', '#e53935', '#43a047', '#1e88e5', '#8e24aa', '#fb8c00', '#ffffff'];
  for (let k = 0; k < n; k++) {
    const p = document.createElement('i');
    const size = 8 + Math.random() * 10;
    p.style.cssText = `left:${Math.random() * 100}%;width:${size}px;height:${size * (0.4 + Math.random())}px;` +
      `background:${COLORS[k % COLORS.length]};animation-delay:${Math.random() * 1.2}s;` +
      `animation-duration:${2.4 + Math.random() * 2}s;--dx:${(Math.random() - 0.5) * 200}px;--rot:${360 + Math.random() * 720}deg`;
    box.appendChild(p);
  }
  setTimeout(() => { if (box.childElementCount === n) box.innerHTML = ''; }, 5000);
}

function wdMixBtn() {
  const b = $('#wd-mix');
  b.textContent = wd.mixed ? '🔀' : '➡️';
  b.title = t(wd.mixed ? 'wordsMixed' : 'wordsInOrder');
  b.classList.toggle('active', wd.mixed);
}

function openWords() { show('#screen-words'); soundIcons(); wdCloseResult(); wdPickView(); }
function wordsOnLang() {
  if ($('#screen-words').classList.contains('hidden')) return;
  wdMixBtn();
  if (!$('#wd-pick').classList.contains('hidden')) wdPickView();
}

$('#games-words').onclick = openWords;
$('#wd-back').onclick = () => {
  if (window.speechSynthesis) speechSynthesis.cancel();
  wdCloseResult();
  if ($('#wd-pick').classList.contains('hidden')) wdPickView(); else openGames();
};
$('#wd-ok').onclick = () => wdMark(true);
$('#wd-no').onclick = () => wdMark(false);
$('#wd-undo').onclick = wdUndo;
$('#wd-hear').onclick = () => { if (!$('#wd-play').classList.contains('hidden')) say(wd.words[wd.i], 'en'); };
$('#wd-mix').onclick = () => { wd.mixed = !wd.mixed; localStorage.setItem('wordsMixed', wd.mixed ? '1' : '0'); wdMixBtn(); };
// con teclado: → o Enter = bien, ← = mal, Retroceso = deshacer
document.addEventListener('keydown', e => {
  if ($('#screen-words').classList.contains('hidden') || !$('#wd-result').classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === 'Enter') wdMark(true);
  else if (e.key === 'ArrowLeft') wdMark(false);
  else if (e.key === 'Backspace') wdUndo();
});
window.addEventListener('resize', () => { if (!$('#screen-words').classList.contains('hidden')) wdFit(); });
