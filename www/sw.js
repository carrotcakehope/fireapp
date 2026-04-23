const CACHE = 'fireapp-v32';

// ASCII ?Œì¼ëª…ë§Œ pre-cache (?œê? ?Œì¼ëª…ì? ?°í???ìºì‹œë¡?ì²˜ë¦¬)
const PRECACHE_FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './report-guide.pdf',
  './pdf.min.js',
  './pdf.worker.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE_FILES))
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
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(response) {
        // image ?´ë” ?Œì¼?€ ?°í???ìºì‹œ???€??        if (e.request.url.includes('/image/')) {
          var clone = response.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return response;
      });
    })
  );
});
