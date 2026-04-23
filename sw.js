const CACHE = 'fireapp-v28';
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
  './image/page 1/page1-full.png',
  './image/page 1/page1-?ê?ì¢…ë¥˜.png',
  './image/page 1/page1-?€?ë¬¼?¤ëª….png',
  './image/page 1/page1-?ê?ê¸°ê°„.png',
  './image/page 1/page1-?ê???png',
  './image/page 1/page1-?ê??¸ë ¥.png',
  './image/page 1/page1-? ì§œ?œëª….png',
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
