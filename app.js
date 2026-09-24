/* Colorea Mi Tarea – app.js */
'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const MAX_SIDE = 2400, MIN_SIDE = 2000;

const I18N = {
  es: {
    appTitle: 'Colorea Mi Tarea',
    lead: 'Toma una foto de la hoja o elige una imagen. La convertimos en un dibujo con líneas gruesas para colorear.',
    takePhoto: 'Tomar foto',
    chooseImage: 'Elegir imagen',
    tryDemo: 'Probar con ejemplo',
    blankPage: 'Página en blanco',
    sampleSheets: 'Hojas de ejemplo:',
    lesson10: 'Lección 10',
    lesson11: 'Lección 11',
    lesson12: 'Lección 12',
    myNotebooks: 'Mis cuadernos',
    backHome: '← Inicio',
    rename: 'Cambiar nombre',
    deleteNotebook: 'Borrar cuaderno',
    addWithCamera: 'Agregar hoja con la cámara',
    addFromImages: 'Agregar desde imágenes',
    pickNotebookTitle: '¿En qué cuaderno lo guardamos?',
    newNotebook: 'Nuevo cuaderno',
    cancel: 'Cancelar',
    back: '← Volver',
    adjustImage: 'Ajustar imagen',
    colorIt: 'Colorear →',
    lineThickness: 'Grosor de líneas',
    sensitivity: 'Sensibilidad',
    cleanDots: 'Limpiar puntos',
    rotate: 'Girar',
    straighten: 'Enderezar',
    centerZero: 'Centrar 0°',
    darkBg: 'Fondo oscuro, líneas claras',
    backAdjust: '← Ajustar',
    paint: 'Colorear',
    undo: 'Deshacer',
    bucket: 'Cubo',
    brush: 'Pincel',
    eraser: 'Borrador',
    pan: 'Mover',
    size: 'Tamaño',
    langLabel: 'Idioma',
    processing: 'Procesando…',
    nothingToUndo: 'Nada que deshacer',
    notebookNamePrompt: 'Nombre del cuaderno (por ejemplo: Matemáticas)',
    defaultNotebook: 'Mis tareas',
    sheet: 'Hoja',
    saved: 'Guardado ✔',
    myDrawing: 'Mi dibujo',
    drawingFile: 'dibujo.png',
    sheetCount: n => n === 1 ? '1 hoja' : n + ' hojas',
    emptyNotebook: 'Este cuaderno está vacío. Agrega una hoja con la cámara.',
    savedDrawing: 'dibujo guardado',
    open: 'Abrir',
    sheetNamePrompt: 'Nombre de la hoja',
    deleteSheetConfirm: '¿Borrar esta hoja?',
    renameNotebookPrompt: 'Nuevo nombre del cuaderno',
    deleteNotebookConfirm: (name, n) => `¿Borrar el cuaderno "${name}" y sus ${n} hojas?`,
    couldNotOpen: 'No se pudo abrir la imagen',
    couldNotLoad: 'No se pudo cargar',
    backNotebook: '← Cuaderno',
    demoText: 'Cuenta cuántos hay. Colorea 1 de cada grupo.',
    deleteLabel: 'borrar',
  },
  en: {
    appTitle: 'Color My Homework',
    lead: 'Take a photo of the worksheet or pick an image. We turn it into a drawing with thick lines you can color.',
    takePhoto: 'Take photo',
    chooseImage: 'Choose image',
    tryDemo: 'Try a sample',
    blankPage: 'Blank page',
    sampleSheets: 'Sample sheets:',
    lesson10: 'Lesson 10',
    lesson11: 'Lesson 11',
    lesson12: 'Lesson 12',
    myNotebooks: 'My notebooks',
    backHome: '← Home',
    rename: 'Rename',
    deleteNotebook: 'Delete notebook',
    addWithCamera: 'Add page with camera',
    addFromImages: 'Add from photos',
    pickNotebookTitle: 'Which notebook should we save it in?',
    newNotebook: 'New notebook',
    cancel: 'Cancel',
    back: '← Back',
    adjustImage: 'Adjust image',
    colorIt: 'Color →',
    lineThickness: 'Line thickness',
    sensitivity: 'Sensitivity',
    cleanDots: 'Clean specks',
    rotate: 'Rotate',
    straighten: 'Straighten',
    centerZero: 'Center 0°',
    darkBg: 'Dark background, light lines',
    backAdjust: '← Adjust',
    paint: 'Color',
    undo: 'Undo',
    bucket: 'Fill',
    brush: 'Brush',
    eraser: 'Eraser',
    pan: 'Move',
    size: 'Size',
    langLabel: 'Language',
    processing: 'Processing…',
    nothingToUndo: 'Nothing to undo',
    notebookNamePrompt: 'Notebook name (for example: Math)',
    defaultNotebook: 'My homework',
    sheet: 'Page',
    saved: 'Saved ✔',
    myDrawing: 'My drawing',
    drawingFile: 'drawing.png',
    sheetCount: n => n === 1 ? '1 page' : n + ' pages',
    emptyNotebook: 'This notebook is empty. Add a page with the camera.',
    savedDrawing: 'saved drawing',
    open: 'Open',
    sheetNamePrompt: 'Page name',
    deleteSheetConfirm: 'Delete this page?',
    renameNotebookPrompt: 'New notebook name',
    deleteNotebookConfirm: (name, n) => `Delete the notebook "${name}" and its ${n} pages?`,
    couldNotOpen: 'Could not open the image',
    couldNotLoad: 'Could not load',
    backNotebook: '← Notebook',
    demoText: 'Count how many. Color 1 in each group.',
    deleteLabel: 'delete',
  },
};
let lang = localStorage.getItem('lang');
if (lang !== 'es' && lang !== 'en') lang = (navigator.language || '').toLowerCase().startsWith('en') ? 'en' : 'es';
function t(key, ...args) {
  const v = (I18N[lang] && I18N[lang][key]) ?? I18N.es[key] ?? key;
  return typeof v === 'function' ? v(...args) : v;
}
function paintBackLabel() {
  if (state.gray) return t('backAdjust');
  if (state.notebookId) return t('backNotebook');
  return t('backHome');
}
function applyI18n() {
  document.documentElement.lang = lang;
  document.title = t('appTitle');
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-title]').forEach(el => { el.title = t(el.dataset.i18nTitle); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  $$('.lang-btn').forEach(b => {
    const on = b.dataset.lang === lang;
    b.classList.toggle('active', on);
    b.setAttribute('aria-pressed', on);
  });
  $('#paint-back').textContent = paintBackLabel();
}
async function setLang(next) {
  if (next !== 'es' && next !== 'en') return;
  lang = next;
  localStorage.setItem('lang', lang);
  applyI18n();
  await renderHome();
  if (!$('#screen-notebook').classList.contains('hidden') && currentNb) await openNotebook(currentNb.id);
}

// ---------- estado ----------
const state = {
  src: null,          // HTMLCanvasElement con la foto (ya girada)
  rotation: 0,      // giro en múltiplos de 90°
  fine: 0,          // enderezado fino en grados
  gray: null,         // Uint8ClampedArray gris
  w: 0, h: 0,
  mask: null,         // Uint8Array 1 = línea
  invert: false,
  tool: 'fill', color: '#e53935', size: 24,
  scale: 1, tx: 0, ty: 0,
  undo: [],
  projectId: null,
};

// ---------- utilidades ----------
function show(id) { $$('.screen').forEach(s => s.classList.add('hidden')); $(id).classList.remove('hidden'); }
let toastT;
function toast(msg, ms = 1800) {
  const t = $('#toast'); t.textContent = msg; t.classList.remove('hidden');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), ms);
}
function loadImage(file) {
  return new Promise((res, rej) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => { URL.revokeObjectURL(url); res(img); };
    img.onerror = rej; img.src = url;
  });
}
function avgColor(img) {
  const t = document.createElement('canvas'); t.width = t.height = 1;
  const x = t.getContext('2d'); x.drawImage(img, 0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})`;
}
function imgToCanvas(img, rotation, fine = 0) {
  let w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
  const side = Math.max(w, h);
  const k = side > MAX_SIDE ? MAX_SIDE / side : side < MIN_SIDE ? MIN_SIDE / side : 1;
  w = Math.round(w * k); h = Math.round(h * k);
  const rot = ((rotation % 360) + 360) % 360;
  const c = document.createElement('canvas');
  const swap = rot === 90 || rot === 270;
  c.width = swap ? h : w; c.height = swap ? w : h;
  const ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
  if (fine) { ctx.fillStyle = avgColor(img); ctx.fillRect(0, 0, c.width, c.height); }
  ctx.translate(c.width / 2, c.height / 2);
  ctx.rotate((rot + fine) * Math.PI / 180);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  return c;
}

// ---------- procesamiento de imagen ----------
function toGray(canvas) {
  const { width: w, height: h } = canvas;
  const d = canvas.getContext('2d').getImageData(0, 0, w, h).data;
  const g = new Uint8ClampedArray(w * h);
  for (let i = 0, j = 0; i < d.length; i += 4, j++) g[j] = (d[i] * 77 + d[i + 1] * 151 + d[i + 2] * 28) >> 8;
  return g;
}
// Umbral adaptativo con imagen integral. Devuelve alfa 0..255 con borde suave
// (línea si gris < media_local - sens; transición de ±SOFT niveles de gris)
const SOFT = 5;
function adaptiveThreshold(g, w, h, sens) {
  const win = Math.max(15, Math.round(Math.max(w, h) / 40)) | 1;
  const r = win >> 1;
  const W = w + 1;
  const integ = new Float64Array(W * (h + 1));
  for (let y = 1; y <= h; y++) {
    let row = 0;
    for (let x = 1; x <= w; x++) {
      row += g[(y - 1) * w + (x - 1)];
      integ[y * W + x] = integ[(y - 1) * W + x] + row;
    }
  }
  const mask = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h, y + r + 1);
    for (let x = 0; x < w; x++) {
      const x0 = Math.max(0, x - r), x1 = Math.min(w, x + r + 1);
      const area = (x1 - x0) * (y1 - y0);
      const sum = integ[y1 * W + x1] - integ[y0 * W + x1] - integ[y1 * W + x0] + integ[y0 * W + x0];
      const d = sum / area - sens - g[y * w + x];
      if (d >= SOFT) mask[y * w + x] = 255;
      else if (d > -SOFT) mask[y * w + x] = ((d + SOFT) / (2 * SOFT) * 255) | 0;
    }
  }
  return mask;
}
// Elimina componentes pequeños (ruido)
function removeSmall(mask, w, h, minArea) {
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  for (let s = 0; s < w * h; s++) {
    if (mask[s] < 128 || seen[s]) continue;
    let sp = 0, n = 0; stack[sp++] = s; seen[s] = 1;
    const comp = [];
    while (sp) {
      const p = stack[--sp]; comp.push(p); n++;
      const x = p % w, y = (p / w) | 0;
      if (x > 0 && mask[p - 1] > 127 && !seen[p - 1]) { seen[p - 1] = 1; stack[sp++] = p - 1; }
      if (x < w - 1 && mask[p + 1] > 127 && !seen[p + 1]) { seen[p + 1] = 1; stack[sp++] = p + 1; }
      if (y > 0 && mask[p - w] > 127 && !seen[p - w]) { seen[p - w] = 1; stack[sp++] = p - w; }
      if (y < h - 1 && mask[p + w] > 127 && !seen[p + w]) { seen[p + w] = 1; stack[sp++] = p + w; }
    }
    if (n < minArea) for (const p of comp) mask[p] = 0;
  }
  // borra el gris tenue que no toca una línea firme (manchas del reverso de la hoja)
  const out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const p = y * w + x, v = mask[p];
    if (!v) continue;
    if (v > 127) { out[p] = v; continue; }
    let keep = false;
    for (let dy = -1; dy <= 1 && !keep; dy++) for (let dx = -1; dx <= 1; dx++) {
      const yy = y + dy, xx = x + dx;
      if (yy >= 0 && yy < h && xx >= 0 && xx < w && mask[yy * w + xx] > 127) { keep = true; break; }
    }
    if (keep) out[p] = v;
  }
  return out;
}
// Dilatación separable (engrosar líneas): filtro de máximo, conserva el borde suave
function dilate(mask, w, h, r) {
  if (r <= 0) return mask;
  const tmp = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    const o = y * w;
    for (let x = 0; x < w; x++) {
      let m = 0; const x0 = Math.max(0, x - r), x1 = Math.min(w - 1, x + r);
      for (let i = x0; i <= x1; i++) if (mask[o + i] > m) m = mask[o + i];
      tmp[o + x] = m;
    }
  }
  for (let y = 0; y < h; y++) {
    const y0 = Math.max(0, y - r), y1 = Math.min(h - 1, y + r);
    for (let x = 0; x < w; x++) {
      let m = 0;
      for (let j = y0; j <= y1; j++) if (tmp[j * w + x] > m) m = tmp[j * w + x];
      out[y * w + x] = m;
    }
  }
  return out;
}
function buildMask() {
  const { gray, w, h } = state;
  const sens = +$('#ctl-sens').value, thick = +$('#ctl-thick').value, clean = +$('#ctl-clean').value;
  let m = adaptiveThreshold(gray, w, h, sens);
  m = removeSmall(m, w, h, Math.round(clean * 40 * (w * h) / 2e6));
  m = dilate(m, w, h, thick);
  state.mask = m;
}
function maskToCanvas(mask, w, h, canvas, invert) {
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  const id = ctx.createImageData(w, h), d = id.data;
  const v = invert ? 255 : 0;
  for (let i = 0, j = 0; i < mask.length; i++, j += 4) {
    d[j] = d[j + 1] = d[j + 2] = v; d[j + 3] = mask[i];
  }
  ctx.putImageData(id, 0, 0);
}
function bgColor() { return state.invert ? '#000000' : '#ffffff'; }

// ---------- pantalla ajustar ----------
let previewTimer;
function schedulePreview() { clearTimeout(previewTimer); previewTimer = setTimeout(renderPreview, 60); }
function renderPreview() {
  $('#out-thick').value = $('#ctl-thick').value;
  $('#out-sens').value = $('#ctl-sens').value;
  $('#out-clean').value = $('#ctl-clean').value;
  state.invert = $('#ctl-invert').checked;
  buildMask();
  const p = $('#preview');
  maskToCanvas(state.mask, state.w, state.h, p, state.invert);
  p.style.background = bgColor();
}
async function openImage(img) {
  state.rotation = 0; state.fine = 0;
  $('#ctl-fine').value = 0; $('#out-fine').value = '0°';
  state.img = img;
  prepareSource();
  state.projectId = null; state.notebookId = null; state.projectName = null;
  show('#screen-adjust');
  toast(t('processing'), 1000);
  await new Promise(r => setTimeout(r, 30));
  renderPreview();
}
function prepareSource() {
  state.src = imgToCanvas(state.img, state.rotation, state.fine);
  state.w = state.src.width; state.h = state.src.height;
  state.gray = toGray(state.src);
}
['#ctl-thick', '#ctl-sens', '#ctl-clean', '#ctl-invert'].forEach(s => $(s).addEventListener('input', schedulePreview));
let fineTimer;
$('#ctl-fine').addEventListener('input', e => {
  state.fine = +e.target.value; $('#out-fine').value = state.fine + '°';
  clearTimeout(fineTimer); fineTimer = setTimeout(() => { prepareSource(); renderPreview(); }, 150);
});
$('#fine-reset').onclick = () => { $('#ctl-fine').value = 0; $('#ctl-fine').dispatchEvent(new Event('input')); };
$('#rot-l').onclick = () => { state.rotation -= 90; prepareSource(); renderPreview(); };
$('#rot-r').onclick = () => { state.rotation += 90; prepareSource(); renderPreview(); };
$('#adjust-back').onclick = () => show('#screen-home');
$('#adjust-ok').onclick = () => startPainting(true);

// ---------- pantalla colorear ----------
const cColor = $('#c-color'), cLines = $('#c-lines'), stage = $('#stage'), viewport = $('#viewport');
const ctxC = cColor.getContext('2d', { willReadFrequently: true });

function startPainting(fresh) {
  const { w, h } = state;
  maskToCanvas(state.mask, w, h, cLines, state.invert);
  if (fresh) {
    cColor.width = w; cColor.height = h;
    ctxC.fillStyle = bgColor(); ctxC.fillRect(0, 0, w, h);
    state.undo = [];
  }
  stage.style.width = w + 'px'; stage.style.height = h + 'px';
  $('#paint-back').textContent = paintBackLabel();
  show('#screen-paint');
  fitView();
}
// hoja en blanco (tamaño carta, vertical) para dibujar libremente
function openBlank(notebookId) {
  state.h = MIN_SIDE; state.w = Math.round(MIN_SIDE * 8.5 / 11);
  state.mask = new Uint8Array(state.w * state.h);
  state.gray = null; state.invert = false;
  state.projectId = null; state.projectName = null; state.notebookId = notebookId || null;
  startPainting(true);
}
$('#paint-back').onclick = () => { if (state.gray) show('#screen-adjust'); else if (state.notebookId) openNotebook(state.notebookId); else show('#screen-home'); };

// paleta
const COLORS = ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#f06292', '#8d6e63', '#000000', '#ffffff'];
const pal = $('#palette');
COLORS.forEach((c, i) => {
  const b = document.createElement('button');
  b.className = 'swatch' + (i === 0 ? ' active' : ''); b.style.background = c; b.dataset.color = c;
  b.setAttribute('aria-label', 'color ' + c);
  b.onclick = () => { state.color = c; $$('.swatch').forEach(s => s.classList.toggle('active', s === b)); if (state.tool === 'eraser') setTool('brush'); };
  pal.appendChild(b);
});
function setTool(t) { state.tool = t; $$('.tool').forEach(b => b.classList.toggle('active', b.dataset.tool === t)); }
$$('.tool').forEach(b => b.onclick = () => setTool(b.dataset.tool));
$('#ctl-size').oninput = e => state.size = +e.target.value;

// zoom / pan
function applyView() { stage.style.transform = `translate(${state.tx}px,${state.ty}px) scale(${state.scale})`; }
function fitView() {
  const vw = viewport.clientWidth, vh = viewport.clientHeight;
  state.scale = Math.min(vw / state.w, vh / state.h) * 0.96;
  state.tx = (vw - state.w * state.scale) / 2; state.ty = (vh - state.h * state.scale) / 2;
  applyView();
}
function zoomAt(f, cx, cy) {
  const ns = Math.min(8, Math.max(0.1, state.scale * f));
  const k = ns / state.scale;
  state.tx = cx - (cx - state.tx) * k; state.ty = cy - (cy - state.ty) * k; state.scale = ns;
  applyView();
}
$('#zoom-in').onclick = () => zoomAt(1.5, viewport.clientWidth / 2, viewport.clientHeight / 2);
$('#zoom-out').onclick = () => zoomAt(1 / 1.5, viewport.clientWidth / 2, viewport.clientHeight / 2);
$('#zoom-fit').onclick = fitView;
window.addEventListener('resize', () => { if (!$('#screen-paint').classList.contains('hidden')) fitView(); });

// deshacer
function pushUndo() {
  state.undo.push(ctxC.getImageData(0, 0, state.w, state.h));
  if (state.undo.length > 12) state.undo.shift();
}
function undo() { const s = state.undo.pop(); if (s) ctxC.putImageData(s, 0, 0); else toast(t('nothingToUndo')); }
$('#btn-undo').onclick = undo;

// relleno (cubo) limitado por la máscara de líneas
function floodFill(x, y, hex) {
  const { w, h, mask } = state;
  x |= 0; y |= 0;
  if (x < 0 || y < 0 || x >= w || y >= h || mask[y * w + x] > 100) return false;
  const id = ctxC.getImageData(0, 0, w, h), d = new Uint32Array(id.data.buffer);
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  const fill = (255 << 24 | b << 16 | g << 8 | r) >>> 0;
  const target = d[y * w + x];
  if (target === fill) return false;
  const stack = new Int32Array(w * h); let sp = 0;
  stack[sp++] = y * w + x;
  while (sp) {
    const p = stack[--sp];
    const py = (p / w) | 0;
    let x0 = p % w;
    while (x0 > 0 && mask[py * w + x0 - 1] <= 100 && d[py * w + x0 - 1] === target) x0--;
    let x1 = p % w;
    while (x1 < w - 1 && mask[py * w + x1 + 1] <= 100 && d[py * w + x1 + 1] === target) x1++;
    let up = false, down = false;
    for (let xx = x0; xx <= x1; xx++) {
      const q = py * w + xx; d[q] = fill;
      if (py > 0) { const u = q - w; const ok = mask[u] <= 100 && d[u] === target; if (ok && !up) { stack[sp++] = u; up = true; } else if (!ok) up = false; }
      if (py < h - 1) { const v = q + w; const ok = mask[v] <= 100 && d[v] === target; if (ok && !down) { stack[sp++] = v; down = true; } else if (!ok) down = false; }
    }
  }
  ctxC.putImageData(id, 0, 0);
  return true;
}

// punteros: dibujo, pan y pellizco
const pointers = new Map();
let stroke = null, pinch = null;
function canvasPoint(e) {
  const r = viewport.getBoundingClientRect();
  return { x: (e.clientX - r.left - state.tx) / state.scale, y: (e.clientY - r.top - state.ty) / state.scale };
}
function drawSeg(a, b) {
  ctxC.globalCompositeOperation = 'source-over';
  ctxC.strokeStyle = state.tool === 'eraser' ? bgColor() : state.color;
  ctxC.lineWidth = state.size; ctxC.lineCap = ctxC.lineJoin = 'round';
  ctxC.beginPath(); ctxC.moveTo(a.x, a.y); ctxC.lineTo(b.x, b.y); ctxC.stroke();
}
viewport.addEventListener('pointerdown', e => {
  if (e.target.closest('.zoom-ctl')) return;
  viewport.setPointerCapture(e.pointerId);
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pointers.size === 2) {
    if (stroke) { ctxC.putImageData(stroke.snap, 0, 0); state.undo.pop(); stroke = null; }
    const [a, b] = [...pointers.values()];
    pinch = { d: Math.hypot(a.x - b.x, a.y - b.y), cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2, scale: state.scale, tx: state.tx, ty: state.ty };
    return;
  }
  if (pointers.size > 2) return;
  const p = canvasPoint(e);
  if (state.tool === 'pan') { stroke = { pan: true, lx: e.clientX, ly: e.clientY }; return; }
  if (state.tool === 'fill') {
    pushUndo();
    if (!floodFill(p.x, p.y, state.color)) state.undo.pop();
    return;
  }
  pushUndo();
  stroke = { snap: state.undo[state.undo.length - 1], last: p };
  drawSeg(p, { x: p.x + 0.01, y: p.y });
});
viewport.addEventListener('pointermove', e => {
  if (!pointers.has(e.pointerId)) return;
  pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
  if (pinch && pointers.size >= 2) {
    const [a, b] = [...pointers.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2;
    const r = viewport.getBoundingClientRect();
    const k = Math.min(8, Math.max(0.1, pinch.scale * d / pinch.d)) / pinch.scale;
    const ox = pinch.cx - r.left, oy = pinch.cy - r.top;
    state.scale = pinch.scale * k;
    state.tx = ox - (ox - pinch.tx) * k + (cx - pinch.cx);
    state.ty = oy - (oy - pinch.ty) * k + (cy - pinch.cy);
    applyView(); return;
  }
  if (!stroke) return;
  if (stroke.pan) {
    state.tx += e.clientX - stroke.lx; state.ty += e.clientY - stroke.ly;
    stroke.lx = e.clientX; stroke.ly = e.clientY; applyView(); return;
  }
  const p = canvasPoint(e);
  drawSeg(stroke.last, p); stroke.last = p;
});
function endPointer(e) {
  pointers.delete(e.pointerId);
  if (pointers.size < 2) pinch = null;
  if (pointers.size === 0) stroke = null;
}
viewport.addEventListener('pointerup', endPointer);
viewport.addEventListener('pointercancel', endPointer);
viewport.addEventListener('wheel', e => { e.preventDefault(); const r = viewport.getBoundingClientRect(); zoomAt(e.deltaY < 0 ? 1.1 : 1 / 1.1, e.clientX - r.left, e.clientY - r.top); }, { passive: false });

// ---------- guardar / exportar ----------
function openDB() {
  return new Promise((res, rej) => {
    const rq = indexedDB.open('colorea', 2);
    rq.onupgradeneeded = e => {
      const db = rq.result;
      if (!db.objectStoreNames.contains('projects')) db.createObjectStore('projects', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('notebooks')) db.createObjectStore('notebooks', { keyPath: 'id' });
    };
    rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error);
  });
}
async function dbAll(store) { const db = await openDB(); return new Promise(r => { const q = db.transaction(store).objectStore(store).getAll(); q.onsuccess = () => r(q.result); }); }
async function dbPut(store, p) { const db = await openDB(); return new Promise(r => { db.transaction(store, 'readwrite').objectStore(store).put(p).onsuccess = r; }); }
async function dbDel(store, id) { const db = await openDB(); return new Promise(r => { db.transaction(store, 'readwrite').objectStore(store).delete(id).onsuccess = r; }); }

const NB_ICONS = ['📘', '📗', '📕', '📙', '📓', '📔'];
async function ensureDefaultNotebook() {
  const nbs = await dbAll('notebooks');
  if (nbs.length) return nbs;
  const nb = { id: Date.now(), name: t('defaultNotebook'), icon: '📘', created: Date.now() };
  await dbPut('notebooks', nb);
  for (const p of await dbAll('projects')) if (!p.notebookId) { p.notebookId = nb.id; await dbPut('projects', p); }
  return [nb];
}
async function createNotebook() {
  const name = (prompt(t('notebookNamePrompt')) || '').trim();
  if (!name) return null;
  const nbs = await dbAll('notebooks');
  const nb = { id: Date.now(), name, icon: NB_ICONS[nbs.length % NB_ICONS.length], created: Date.now() };
  await dbPut('notebooks', nb); return nb;
}
function pickNotebook() {
  return new Promise(async resolve => {
    const nbs = await ensureDefaultNotebook();
    const list = $('#picker-list'); list.innerHTML = '';
    const close = v => { $('#picker').classList.add('hidden'); resolve(v); };
    for (const nb of nbs) {
      const b = document.createElement('button'); b.className = 'btn'; b.textContent = nb.icon + ' ' + nb.name;
      b.onclick = () => close(nb.id); list.appendChild(b);
    }
    $('#picker-new').onclick = async () => { const nb = await createNotebook(); if (nb) close(nb.id); };
    $('#picker-cancel').onclick = () => close(null);
    $('#picker').classList.remove('hidden');
  });
}
function composite() {
  const c = document.createElement('canvas'); c.width = state.w; c.height = state.h;
  const x = c.getContext('2d'); x.drawImage(cColor, 0, 0); x.drawImage(cLines, 0, 0); return c;
}
function thumbOf(c) {
  const t = document.createElement('canvas'); const k = 200 / Math.max(c.width, c.height);
  t.width = Math.round(c.width * k); t.height = Math.round(c.height * k);
  t.getContext('2d').drawImage(c, 0, 0, t.width, t.height); return t.toDataURL('image/jpeg', 0.7);
}
$('#btn-save').onclick = async () => {
  if (!state.notebookId) { state.notebookId = await pickNotebook(); if (!state.notebookId) return; }
  if (!state.projectId) {
    state.projectId = Date.now();
    const n = (await dbAll('projects')).filter(p => p.notebookId === state.notebookId).length + 1;
    state.projectName = t('sheet') + ' ' + n;
  }
  await dbPut('projects', { id: state.projectId, notebookId: state.notebookId, name: state.projectName || t('sheet'), date: Date.now(),
    w: state.w, h: state.h, invert: state.invert,
    lines: cLines.toDataURL('image/png'), color: cColor.toDataURL('image/png'), thumb: thumbOf(composite()) });
  $('#paint-back').textContent = paintBackLabel();
  toast(t('saved')); renderHome();
};
$('#btn-export').onclick = () => {
  composite().toBlob(async blob => {
    const file = new File([blob], t('drawingFile'), { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: t('myDrawing') }); return; } catch (_) { }
    }
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = t('drawingFile'); a.click();
  }, 'image/png');
};
async function loadProject(p) {
  const li = new Image(), ci = new Image();
  await Promise.all([new Promise(r => { li.onload = r; li.src = p.lines; }), new Promise(r => { ci.onload = r; ci.src = p.color; })]);
  state.w = p.w; state.h = p.h; state.invert = p.invert; state.projectId = p.id; state.notebookId = p.notebookId; state.projectName = p.name; state.gray = null;
  cLines.width = cColor.width = p.w; cLines.height = cColor.height = p.h;
  cLines.getContext('2d').drawImage(li, 0, 0); ctxC.drawImage(ci, 0, 0);
  const md = cLines.getContext('2d').getImageData(0, 0, p.w, p.h).data;
  state.mask = new Uint8Array(p.w * p.h);
  for (let i = 0; i < state.mask.length; i++) state.mask[i] = md[i * 4 + 3];
  state.undo = [];
  stage.style.width = p.w + 'px'; stage.style.height = p.h + 'px';
  $('#paint-back').textContent = t('backNotebook');
  show('#screen-paint'); fitView();
}
async function renderHome() {
  const nbs = await ensureDefaultNotebook();
  const projects = await dbAll('projects');
  const list = $('#notebook-list'); list.innerHTML = '';
  for (const nb of nbs.sort((a, b) => a.created - b.created)) {
    const n = projects.filter(p => p.notebookId === nb.id).length;
    const b = document.createElement('button'); b.className = 'notebook';
    b.innerHTML = `<span class="icon"></span><span class="name"></span><span class="count"></span>`;
    b.querySelector('.icon').textContent = nb.icon; b.querySelector('.name').textContent = nb.name;
    b.querySelector('.count').textContent = t('sheetCount', n);
    b.onclick = () => openNotebook(nb.id); list.appendChild(b);
  }
  const add = document.createElement('button'); add.className = 'notebook new';
  add.innerHTML = '<span class="icon">➕</span><span></span>';
  add.querySelector('span:last-child').textContent = t('newNotebook');
  add.onclick = async () => { if (await createNotebook()) renderHome(); };
  list.appendChild(add);
}
let currentNb = null;
async function openNotebook(id) {
  const nb = (await dbAll('notebooks')).find(n => n.id === id);
  if (!nb) return show('#screen-home');
  currentNb = nb;
  $('#nb-title').textContent = nb.icon + ' ' + nb.name;
  const list = $('#saved-list'); list.innerHTML = '';
  const all = (await dbAll('projects')).filter(p => p.notebookId === id).sort((a, b) => a.date - b.date);
  if (!all.length) { const p = document.createElement('p'); p.className = 'lead'; p.textContent = t('emptyNotebook'); list.appendChild(p); }
  for (const p of all) {
    const d = document.createElement('div'); d.className = 'thumb';
    d.innerHTML = `<img><div class="name"></div><div class="row"><button></button><button>🗑</button></div>`;
    d.querySelector('img').src = p.thumb; d.querySelector('img').alt = t('savedDrawing');
    d.querySelector('.name').textContent = p.name || t('sheet');
    const [open, del] = d.querySelectorAll('button');
    open.textContent = t('open');
    del.setAttribute('aria-label', t('deleteLabel'));
    open.onclick = () => loadProject(p);
    d.querySelector('.name').onclick = async () => { const n = prompt(t('sheetNamePrompt'), p.name || ''); if (n && n.trim()) { p.name = n.trim(); await dbPut('projects', p); openNotebook(id); } };
    del.onclick = async () => { if (confirm(t('deleteSheetConfirm'))) { await dbDel('projects', p.id); openNotebook(id); } };
    list.appendChild(d);
  }
  show('#screen-notebook');
}
$('#nb-back').onclick = () => { currentNb = null; renderHome(); show('#screen-home'); };
$('#nb-rename').onclick = async () => {
  const n = prompt(t('renameNotebookPrompt'), currentNb.name); if (!n || !n.trim()) return;
  currentNb.name = n.trim(); await dbPut('notebooks', currentNb); openNotebook(currentNb.id);
};
$('#nb-delete').onclick = async () => {
  const hojas = (await dbAll('projects')).filter(p => p.notebookId === currentNb.id);
  if (!confirm(t('deleteNotebookConfirm', currentNb.name, hojas.length))) return;
  for (const p of hojas) await dbDel('projects', p.id);
  await dbDel('notebooks', currentNb.id);
  currentNb = null; renderHome(); show('#screen-home');
};

// ---------- entrada ----------
async function handleFile(input, notebookId) {
  const f = input.files && input.files[0]; if (!f) return;
  try { await openImage(await loadImage(f)); state.notebookId = notebookId || null; } catch (e) { toast(t('couldNotOpen')); }
  input.value = '';
}
$('#file-camera').onchange = e => handleFile(e.target);
$('#file-gallery').onchange = e => handleFile(e.target);
$('#nb-file-camera').onchange = e => handleFile(e.target, currentNb && currentNb.id);
$('#nb-file-gallery').onchange = e => handleFile(e.target, currentNb && currentNb.id);

// imagen de ejemplo: simula una foto de tarea con circulos y numeros
function demoImage() {
  const c = document.createElement('canvas'); c.width = 1000; c.height = 1300;
  const x = c.getContext('2d');
  const gr = x.createLinearGradient(0, 0, 1000, 1300); gr.addColorStop(0, '#e8e6e0'); gr.addColorStop(1, '#b9b5ad');
  x.fillStyle = gr; x.fillRect(0, 0, 1000, 1300);
  x.strokeStyle = '#333'; x.lineWidth = 3;
  x.strokeRect(80, 200, 840, 900); x.beginPath(); x.moveTo(500, 200); x.lineTo(500, 1100); x.moveTo(80, 500); x.lineTo(920, 500); x.moveTo(80, 800); x.lineTo(920, 800); x.stroke();
  x.font = 'bold 44px sans-serif'; x.fillStyle = '#222'; x.fillText(t('demoText'), 80, 150);
  const groups = [[3, 290, 350], [4, 710, 350], [5, 290, 650], [5, 710, 650], [4, 290, 950], [5, 710, 950]];
  for (const [n, cx, cy] of groups) {
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, px = cx + Math.cos(a) * 90 + (Math.random() - 0.5) * 20, py = cy + Math.sin(a) * 90 + (Math.random() - 0.5) * 20;
      x.beginPath(); x.arc(px, py, 34, 0, Math.PI * 2); x.stroke();
    }
    x.font = '40px sans-serif'; x.fillText('3   4   5', cx - 80, cy + 190);
  }
  const d = x.getImageData(0, 0, 1000, 1300); // ruido leve
  for (let i = 0; i < d.data.length; i += 4) { const n = (Math.random() - 0.5) * 16; d.data[i] += n; d.data[i + 1] += n; d.data[i + 2] += n; }
  x.putImageData(d, 0, 0);
  return c;
}
$('#btn-demo').onclick = () => openImage(demoImage());
$('#btn-blank').onclick = () => openBlank();
$('#nb-blank').onclick = () => openBlank(currentNb && currentNb.id);

$$('.lang-btn').forEach(b => b.onclick = () => setLang(b.dataset.lang));
applyI18n();
renderHome();
// ?img=ruta  → abre una imagen directamente (útil para pruebas y ejemplos)
const qImg = new URLSearchParams(location.search).get('img');
if (qImg) { const im = new Image(); im.onload = () => openImage(im); im.onerror = () => toast(t('couldNotLoad') + ' ' + qImg); im.src = qImg; }
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => { });
