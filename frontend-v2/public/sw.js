const CACHE_NAME = 'quotesnap-v1';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/quotesnap-logo-icon-192.png',
  '/quotesnap-logo-icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return new Response('<html><body style="font-family:Inter,sans-serif;text-align:center;padding:40px;"><h1>QuoteSnap</h1><p>You are offline. Your saved quotes are still available.</p><a href="/dashboard">Go to Dashboard</a></body></html>', {
            headers: { 'Content-Type': 'text/html' }
          });
        }
      });
    })
  );
});
