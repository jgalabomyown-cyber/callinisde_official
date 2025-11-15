const CACHE_NAME = 'gallery-cache-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/output.css',
  '/js/sidebar.js',
  '/offline.html',
  '/favicon.ico',
  '/images/art_sample_1.jpg',
  '/images/art_sample_2.jpg',
  '/images/art_sample_3.jpg',
  '/images/art_sample_4.jpg',
  '/images/logo.png',
  // Add other static assets as needed
];

// Install event: Cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: Serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', event => {
  // Only handle GET requests in the runtime cache
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) return cachedResponse;

  // Try network, but handle failures and opaque responses
  console.log('[SW] Fetching from network:', event.request.url);
  return fetch(event.request).then(networkResponse => {
          // If no response or not OK, return it (don't cache)
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // For same-origin requests we can cache the response
          const isSameOrigin = new URL(event.request.url).origin === self.location.origin;
          if (isSameOrigin) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
          }

          return networkResponse;
        }).catch(error => {
          // Network failed (offline or blocked). For navigation requests, show offline page.
          console.warn('[SW] Fetch failed for', event.request.url, error);
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }

          // If it's an image request, return a cached placeholder image
          if (event.request.destination === 'image') {
            return caches.match('/images/logo.png');
          }

          // For other requests, try to return a cached fallback or a generic response
          return caches.match(event.request).then(fallback => fallback || new Response(null, { status: 503, statusText: 'Service Unavailable' }));
        });
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
