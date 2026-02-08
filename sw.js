const CACHE = 'tex-reports-v1';

const PRECACHE = [
  '/',
  '/style.css',
  '/icon.svg',
  '/app.webmanifest'
];

// Install: precache app shell
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Fetch handler
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

  const url = new URL(e.request.url);

  // Network-first for navigation (HTML pages) and content manifest
  if (e.request.mode === 'navigate' || url.pathname === '/manifest.json') {
    e.respondWith(networkFirst(e.request));
    return;
  }

  // Cache-first for everything else (CSS, fonts, icons, images)
  e.respondWith(cacheFirst(e.request));
});

function networkFirst(req) {
  return fetch(req)
    .then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(req, clone));
      return res;
    })
    .catch(() => caches.match(req));
}

function cacheFirst(req) {
  return caches.match(req).then(cached => {
    if (cached) return cached;
    return fetch(req).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(req, clone));
      return res;
    });
  });
}
