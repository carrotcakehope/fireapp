const CACHE = 'fireapp-v33';

// 설치 시 캐시할 핵심 파일 (작고 빠른 것만)
const PRECACHE_FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// 항상 최신버전을 가져와야 하는 파일 (network-first)
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
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => {
        // 새 SW 활성화되면 모든 창에 새로고침 신호 전송
        clients.forEach(c => c.postMessage({ type: 'SW_UPDATED' }));
      })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);
  const filename = url.pathname.split('/').pop();

  // 핵심 앱 파일: 항상 네트워크에서 최신본 가져오기 (오프라인 시 캐시 사용)
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

  // 나머지 (이미지, PDF, 라이브러리 등): 캐시 우선, 없으면 네트워크에서 받아 캐시
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
