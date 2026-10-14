const CACHE = 'colorea-v16';
const FILES = ['./', './index.html', './styles.css', './app.js', './caligrafia.js', './juegos.js', './manifest.json', './icon.svg'];
// al instalar se piden los archivos a la red (sin la caché del navegador) para no guardar versiones viejas
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES.map(f => new Request(f, { cache: 'reload' })))));
});
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim())));
// primero la red (siempre la versión más nueva); sin conexión, lo guardado
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(new Request(req.url, { cache: 'no-cache' }))
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true })));
});
