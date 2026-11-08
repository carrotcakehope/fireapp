const CACHE = 'fireapp-v471';

const PRECACHE_FILES = [
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './assets/pets/mailpup/spritesheet.webp',
  './assets/pets/mailpup/references/running.png',
  './assets/pets/mailpup/references/saluting.png',
  './assets/pets/mailpup/references/eating.png',
  './assets/pets/mailpup/references/studying.png',
  './assets/pets/mailpup/references/wating.png',
  './assets/pets/mailpup/references/dancing.png',
  './assets/pets/mailpup/references/pushup.png',
  './assets/pets/mailpup/references/sleeping.png',
  './assets/pets/mailpup/pet.json',
  './assets/pets/mailpup/summon.png',
  './assets/pets/mailpup/summon-face.png',
];

const NETWORK_FIRST = ['index.html', 'app.js', 'styles.css', 'manifest.json', 'facilities-data-v2.js', 'facilities.js', 'holidays.json', 'chat streaming.html', 'intro.html', 'intro-mobile.html'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE_FILES))
  );
  // skipWaiting 하지 않음: 새 버전은 대기(waiting) 상태로 두고,
  // 사용자가 업데이트 띠의 [새로고침]을 누르면 SKIP_WAITING 메시지로 교체한다.
  // (이전 SW가 없는 첫 설치는 대기 없이 바로 활성화됨)
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(c => c.postMessage({ type: 'CACHE_UPDATED' })))
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // 오디오(배경음악)는 SW를 거치지 않게 한다. 구간(Range) 요청이라 어차피 캐시에 안 들어가고,
  // SW가 이 긴 다운로드를 붙잡고 있으면 새 버전 교체(activate)가 다운로드가 끝날 때까지 밀린다.
  if (e.request.destination === 'audio') return;

  const url = new URL(e.request.url);
  const filename = decodeURIComponent(url.pathname.split('/').pop() || '');

  // NETWORK_FIRST 목록: 항상 네트워크에서 최신본을 받아오고, 실패 시에만 캐시로 폴백
  // 페이지 이동(navigate) 요청도 네트워크 우선: 주소가 /app/ 처럼 파일명 없이 끝나면
  // 목록에 안 걸려 옛 index.html이 캐시에서 나오고 새 app.js와 섞이는 걸 막는다.
  if (NETWORK_FIRST.includes(filename) || e.request.mode === 'navigate') {
    e.respondWith(
      fetch(new Request(e.request.url, { cache: 'no-store' }))
        .then(res => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then(c => c.put(e.request, copy));
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // 그 외(이미지, PDF, 정적 자산 등): 캐시 우선, 없으면 네트워크에서 받아 캐시에 저장
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      });
    })
  );
});
