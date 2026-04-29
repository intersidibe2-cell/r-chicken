const CACHE_NAME = 'r-chicken-v8';
const URLS_TO_CACHE = ['/', '/index.html'];

// Install: cache core files
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(URLS_TO_CACHE)).then(() => self.skipWaiting())
  );
});

// Activate: DELETE all old caches, claim clients immediately
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch: network-first, fallback to cache, fallback to offline response
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Clone and cache successful responses
        const resClone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, resClone));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then(cached =>
          cached || new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
        )
      )
  );
});
