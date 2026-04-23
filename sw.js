const CACHE = 'fireapp-v26';
const FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './report-guide.pdf',
  './pdf.min.js',
  './pdf.worker.min.js',
  './image/?¥ë‚´?Œí™”??png',
  './image/?¤í”„ë§í´?¬ì„¤ë¹?png',
  './image/?ë™?”ìž¬?ì??¤ë¹„.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
