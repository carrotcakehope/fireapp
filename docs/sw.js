const CACHE = 'fireapp-v44';

const PRECACHE_FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

const NETWORK_FIRST = ['index.html', 'app.js', 'styles.css', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
    // clients.claim() ?¤í–‰ ???˜ì´ì§€??controllerchange ?´ë²¤?¸ê? ë°œìƒ?˜ì—¬
    // index.html?ì„œ window.location.reload()ê°€ ?¸ì¶œ??  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const filename = url.pathname.split('/').pop();

  // ?µì‹¬ ???Œì¼: ??ƒ ?¤íŠ¸?Œí¬?ì„œ ìµœì‹ ë³?ê°€?¸ì˜¤ê¸?(?¤í”„?¼ì¸ ??ìºì‹œ ?¬ìš©)
  if (NETWORK_FIRST.includes(filename)) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          if (res && res.ok) {
            caches.open(CACHE).then(c => c.put(e.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // ?˜ë¨¸ì§€ (?´ë?ì§€, PDF, ?¼ì´ë¸ŒëŸ¬ë¦???: ìºì‹œ ?°ì„ , ?†ìœ¼ë©??¤íŠ¸?Œí¬?ì„œ ë°›ì•„ ìºì‹œ
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          caches.open(CACHE).then(c => c.put(e.request, res.clone()));
        }
        return res;
      });
    })
  );
});
