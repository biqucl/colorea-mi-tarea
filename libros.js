/* Colorea Mi Tarea – libros por nivel (Pre A y A): una página a la vez, dibujo grande y texto grande en inglés */
'use strict';

// cada página: [dibujo, texto, cuántas veces se repite el dibujo]
const BOOKS = [
  // Pre A: una palabra por página, el dibujo cuenta la historia
  { id: 'colors', level: 'preA', title: 'Colors', cover: '🌈', pages: [
    ['🍎', 'red'], ['🐳', 'blue'], ['🍌', 'yellow'], ['🐸', 'green'], ['🍊', 'orange'], ['🍇', 'purple']] },
  { id: 'pets', level: 'preA', title: 'Pets', cover: '🐶', pages: [
    ['🐶', 'dog'], ['🐱', 'cat'], ['🐟', 'fish'], ['🐦', 'bird'], ['🐰', 'bunny'], ['🐢', 'turtle']] },
  { id: 'farm', level: 'preA', title: 'The Farm', cover: '🚜', pages: [
    ['🐮', 'cow'], ['🐷', 'pig'], ['🐔', 'hen'], ['🐴', 'horse'], ['🐑', 'sheep'], ['🦆', 'duck']] },
  { id: 'food', level: 'preA', title: 'Yum!', cover: '😋', pages: [
    ['🍎', 'apple'], ['🍌', 'banana'], ['🍕', 'pizza'], ['🥛', 'milk'], ['🥚', 'egg'], ['🍰', 'cake']] },
  { id: 'go', level: 'preA', title: 'Go!', cover: '🚦', pages: [
    ['🚗', 'car'], ['🚌', 'bus'], ['🚲', 'bike'], ['🚂', 'train'], ['⛵', 'boat'], ['✈️', 'plane']] },
  { id: 'body', level: 'preA', title: 'Me', cover: '🧒', pages: [
    ['👀', 'eyes'], ['👃', 'nose'], ['👂', 'ear'], ['👄', 'mouth'], ['✋', 'hand'], ['🦶', 'foot']] },

  // A: una frase corta que se repite; cambia una palabra y el dibujo la muestra
  // libro real (African Storybook, CC BY 3.0): texto e ilustraciones originales (imgs: 01 = tapa, 02… = páginas)
  { id: 'iliketoread', level: 'A', title: 'I like to read!', cover: '📚', real: true, imgs: 'books/iliketoread/',
    credit: 'Letta Machoga · Wiehan de Jager (ill.) · African Storybook · CC BY 3.0', pages: [
    ['📖', 'I like to read.'], ['🤔', 'Who can I read to?'], ['😴', 'My sister is asleep.'],
    ['🤔', 'Who can I read to?'], ['👩🧺👵', 'My mother and grandmother are busy.'],
    ['🤔', 'Who can I read to?'], ['👨🪓👴', 'My father and grandfather are busy.'],
    ['🙋📖', 'Who can I read to? I can read to myself!']] },
  // libro real (African Storybook, CC BY-NC 3.0: solo uso no comercial)
  { id: 'whereismycat', level: 'A', title: 'Where is my cat?', cover: '🐱', real: true, imgs: 'books/whereismycat/',
    credit: 'Clare Verbeek, Thembani Dladla, Zanele Buthelezi · Bronwen Heath, Ingrid Schechter (ill.) · African Storybook · CC BY-NC 3.0', pages: [
    ['🐱', 'Where is my cat?'], ['🛏️', 'Is it under the bed?'], ['🗄️', 'Is it on top of the cupboard?'],
    ['🛋️', 'Is it behind the couch?'], ['🗑️', 'Is it next to the bin?'], ['🧺', 'Is it inside the basket?'],
    ['🏠', 'Is it outside the house?'], ['🐈', 'Here it is!']] },
  { id: 'isee', level: 'A', title: 'I See', cover: '👀', pages: [
    ['🐶', 'I see a dog.'], ['🐱', 'I see a cat.'], ['🐟', 'I see a fish.'], ['🐦', 'I see a bird.'],
    ['🐸', 'I see a frog.'], ['🫵', 'I see you!']] },
  { id: 'ilike', level: 'A', title: 'I Like', cover: '❤️', pages: [
    ['🍎', 'I like apples.'], ['🍌', 'I like bananas.'], ['🍕', 'I like pizza.'], ['🥛', 'I like milk.'],
    ['🍰', 'I like cake.'], ['🤗', 'I like my mom!']] },
  { id: 'count', level: 'A', title: 'One, Two, Three', cover: '🔢', pages: [
    ['⚽', 'I have one ball.', 1], ['🐱', 'I have two cats.', 2], ['🦆', 'I have three ducks.', 3],
    ['🐟', 'I have four fish.', 4], ['⭐', 'I have five stars.', 5]] },
  { id: 'wego', level: 'A', title: 'We Go', cover: '🗺️', pages: [
    ['🚗', 'We go in the car.'], ['🚌', 'We go on the bus.'], ['🚂', 'We go on the train.'],
    ['⛵', 'We go in the boat.'], ['✈️', 'We go in the plane.'], ['🏠', 'We go home!']] },
  { id: 'hereis', level: 'A', title: 'Here Is', cover: '🎒', pages: [
    ['👒', 'Here is my hat.'], ['🎒', 'Here is my bag.'], ['📕', 'Here is my book.'], ['🧸', 'Here is my bear.'],
    ['🛏️', 'Here is my bed.'], ['🙋', 'Here I am!']] },
  { id: 'ican', level: 'A', title: 'I Can', cover: '💪', pages: [
    ['🏃', 'I can run.'], ['🏊', 'I can swim.'], ['🚴', 'I can ride.'], ['🧗', 'I can climb.'],
    ['💃', 'I can dance.'], ['📖', 'I can read!']] },
];
const BK_LEVELS = [['preA', 'Pre A'], ['A', 'A']];

const bk = { book: null, i: 0, readTok: 0, swipe: null,
  hidePics: localStorage.getItem('booksHidePics') !== '0' };   // primero leer la palabra, después ver el dibujo
function bkReadSet() { try { return new Set(JSON.parse(localStorage.getItem('booksRead')) || []); } catch (_) { return new Set(); } }

function bkShelf() {
  bkStopVoice();
  bk.book = null;
  $('#bk-shelf').classList.remove('hidden');
  $('#bk-read').classList.add('hidden');
  $('#bk-title').textContent = t('books');
  $('#bk-num').textContent = '';
  $('#bk-back').textContent = t('backHome');
  bkHideBtn();
  const box = $('#bk-shelf'), read = bkReadSet();
  box.innerHTML = '';
  BK_LEVELS.forEach(([lv, name]) => {
    const h = document.createElement('h2');
    h.className = 'bk-level';
    h.innerHTML = `<span class="bk-badge">${name}</span><span>${t('bkLevelDesc_' + lv)}</span>`;
    box.appendChild(h);
    const row = document.createElement('div');
    row.className = 'bk-row';
    BOOKS.filter(b => b.level === lv).forEach(b => {
      const c = document.createElement('button');
      c.className = 'bk-cover-card';
      const icon = b.imgs ? `<img class="bk-thumb" src="${b.imgs}01.jpg" alt="">` : b.cover;
      c.innerHTML = (b.real ? `<span class="bk-real">${t('bkReal')}</span>` : '') + `<span class="icon">${icon}</span><b>${b.title}</b>` +
        `<span class="bk-meta">${read.has(b.id) ? '✅ ' + t('bkDone') : t('bkPages', b.pages.length)}</span>`;
      c.onclick = () => bkOpen(b);
      row.appendChild(c);
    });
    box.appendChild(row);
  });
}

function bkHideBtn() {
  const b = $('#bk-hide');
  b.classList.toggle('hidden', !bk.book);
  b.textContent = bk.hidePics ? '🙈' : '👁️';
  b.title = t(bk.hidePics ? 'bkPicsHidden' : 'bkPicsShown');
  b.classList.toggle('active', bk.hidePics);
}

function bkOpen(book) {
  bk.book = book; bk.i = 0;
  $('#bk-shelf').classList.add('hidden');
  $('#bk-read').classList.remove('hidden');
  $('#bk-title').textContent = book.title;
  $('#bk-back').textContent = t('bkBackShelf');
  const dots = $('#bk-dots');
  dots.innerHTML = '';
  for (let k = 0; k < book.pages.length + 2; k++) dots.appendChild(document.createElement('i'));
  bkHideBtn();
  bkRender('in');
}

// texto con cada palabra en su propia caja, para tocarla y oírla
function bkWords(text) {
  return text.split(' ').map(w => `<span class="bk-w" data-w="${w.replace(/[^A-Za-z']/g, '')}">${w}</span>`).join(' ');
}

function bkRender(anim) {
  bkStopVoice();
  const b = bk.book, n = b.pages.length, page = $('#bk-page');
  const last = n + 1;
  page.className = 'bk-page' + (bk.i === 0 ? ' cover' : bk.i === last ? ' end' : '') + (b.level === 'preA' ? ' preA' : '') + (anim ? ' ' + anim : '');
  let pic, text, count = 1;
  if (bk.i === 0) { pic = b.cover; text = b.title; }
  else if (bk.i === last) { pic = '🎉'; text = 'The End'; }
  else [pic, text, count = 1] = b.pages[bk.i - 1];
  $('#bk-pic').innerHTML = b.imgs && bk.i !== last
    ? `<img class="bk-img" src="${b.imgs}${String(bk.i + 1).padStart(2, '0')}.jpg" alt="">`
    : Array(count).fill(`<span>${pic}</span>`).join('');
  $('#bk-pic').dataset.n = count;
  // en las páginas del cuento el dibujo queda tapado hasta que se toca (para leer sin adivinar por el dibujo)
  const pageWithText = bk.i !== 0 && bk.i !== last;
  $('#bk-pic').classList.toggle('covered', bk.hidePics && pageWithText);
  if (bk.hidePics && pageWithText) {
    const c = document.createElement('button');
    c.className = 'bk-curtain';
    c.innerHTML = `<span class="q">❓</span><span>${t('bkTapToSee')}</span>`;
    c.onclick = e => { e.stopPropagation(); $('#bk-pic').classList.remove('covered'); $('#bk-pic').classList.add('reveal'); c.remove(); };
    $('#bk-pic').appendChild(c);
  }
  $('#bk-pic').classList.remove('reveal');
  $('#bk-text').innerHTML = bkWords(text);
  $('#bk-text').querySelectorAll('.bk-w').forEach(el => el.onclick = e => {
    e.stopPropagation();
    bkStopVoice();
    el.classList.add('hl');
    bkSpeak(el.dataset.w, () => el.classList.remove('hl'));
  });
  $('#bk-credit').textContent = bk.i === 0 && b.credit ? b.credit : '';
  $('#bk-end-actions').classList.toggle('hidden', bk.i !== last);
  $('#bk-prev').disabled = bk.i === 0;
  $('#bk-next').disabled = bk.i === last;
  $('#bk-num').textContent = bk.i === 0 || bk.i === last ? '' : `${bk.i} / ${n}`;
  $$('#bk-dots i').forEach((d, k) => d.classList.toggle('on', k === bk.i));
  bkFit();
  if (bk.i === last) {
    const read = bkReadSet(); read.add(b.id);
    localStorage.setItem('booksRead', JSON.stringify([...read]));
    say(t('bkFinished'));
  }
}

// dibujo y texto del mayor tamaño que quepa en la página
function bkFit() {
  const page = $('#bk-page'), pic = $('#bk-pic'), txt = $('#bk-text');
  if (!page.offsetWidth) return;
  const W = page.clientWidth, H = page.clientHeight;
  const len = Math.max(3, txt.textContent.length);
  const fs = Math.floor(Math.min(H * (page.classList.contains('preA') ? 0.2 : 0.15), W * 0.9 / (len * 0.56)));
  txt.style.fontSize = Math.max(fs, Math.min(W / 9, 56)) + 'px';
  pic.style.fontSize = '10px';   // medir el espacio libre que le queda al dibujo
  const n = +pic.dataset.n || 1, picH = pic.clientHeight;
  const per = n === 1 ? 1 : n <= 3 ? 0.55 : 0.4;
  pic.style.fontSize = Math.floor(Math.max(40, Math.min(picH * 0.86 * per, W * 0.8 / Math.min(n, 3)))) + 'px';
}

function bkGo(d) {
  if (!bk.book) return;
  const ni = Math.max(0, Math.min(bk.book.pages.length + 1, bk.i + d));
  if (ni === bk.i) return;
  bk.i = ni;
  bkRender(d > 0 ? 'in-next' : 'in-prev');
}

// ---------- voz: lee palabra por palabra y marca la que va leyendo ----------
function bkSpeak(text, done) {
  if (!window.speechSynthesis) { done && done(); return; }
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'en-US';
  const v = speechSynthesis.getVoices().find(v => v.lang.replace('_', '-').toLowerCase().startsWith('en'));
  if (v) u.voice = v;
  u.rate = 0.8;
  let fired = false;
  const fin = () => { if (fired) return; fired = true; done && done(); };
  u.onend = fin; u.onerror = fin;
  setTimeout(fin, 900 + text.length * 160);   // por si el navegador no avisa que terminó
  speechSynthesis.speak(u);
}
function bkStopVoice() {
  bk.readTok++;
  if (window.speechSynthesis) speechSynthesis.cancel();
  $$('#bk-text .bk-w.hl').forEach(el => el.classList.remove('hl'));
}
function bkReadPage() {
  bkStopVoice();
  const tok = bk.readTok, words = [...$$('#bk-text .bk-w')];
  let k = 0;
  const step = () => {
    if (tok !== bk.readTok) return;
    words.forEach(el => el.classList.remove('hl'));
    if (k >= words.length) return;
    const el = words[k++];
    el.classList.add('hl');
    bkSpeak(el.dataset.w, () => setTimeout(step, 180));
  };
  step();
}

function openBooks() { show('#screen-books'); bkShelf(); }
function booksOnLang() {
  if ($('#screen-books').classList.contains('hidden')) return;
  if (bk.book) { $('#bk-back').textContent = t('bkBackShelf'); bkHideBtn(); bkRender(); } else bkShelf();
}

$('#btn-books').onclick = openBooks;
$('#bk-back').onclick = () => { if (bk.book) bkShelf(); else { bkStopVoice(); show('#screen-home'); } };
$('#bk-prev').onclick = () => bkGo(-1);
$('#bk-next').onclick = () => bkGo(1);
$('#bk-say').onclick = bkReadPage;
$('#bk-hide').onclick = () => {
  bk.hidePics = !bk.hidePics;
  localStorage.setItem('booksHidePics', bk.hidePics ? '1' : '0');
  bkHideBtn();
  bkRender();
};
$('#bk-again').onclick = () => { bk.i = 0; bkRender('in-prev'); };
$('#bk-other').onclick = bkShelf;
// deslizar el dedo para pasar la página
$('#bk-stage').addEventListener('pointerdown', e => { bk.swipe = { x: e.clientX, y: e.clientY }; });
$('#bk-stage').addEventListener('pointerup', e => {
  if (!bk.swipe) return;
  const dx = e.clientX - bk.swipe.x, dy = e.clientY - bk.swipe.y;
  bk.swipe = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) bkGo(dx < 0 ? 1 : -1);
});
document.addEventListener('keydown', e => {
  if ($('#screen-books').classList.contains('hidden') || !bk.book) return;
  if (e.key === 'ArrowRight') bkGo(1);
  else if (e.key === 'ArrowLeft') bkGo(-1);
  else if (e.key === ' ') { e.preventDefault(); bkReadPage(); }
});
window.addEventListener('resize', () => { if (bk.book && !$('#screen-books').classList.contains('hidden')) bkFit(); });
