const CACHE_NAME = 'travel-places-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/logo-192x192.png',
  '/images/logo-512x512.png'
];

// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return the response from cached version
        if (response) {
          return response;
        }

        // Not in cache - fetch and cache the result
        return fetch(event.request)
          .then((res) => {
            // Check if we received a valid response
            if (!res || res.status !== 200 || res.type !== 'basic') {
              return res;
            }

            // Clone the response
            const responseToCache = res.clone();

            // Only cache GET requests for assets (not API calls)
            if (event.request.method === 'GET' && 
                (event.request.url.includes('/images/') || 
                 event.request.url.includes('/static/') ||
                 event.request.destination === 'style' ||
                 event.request.destination === 'script' ||
                 event.request.destination === 'font')) {
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return res;
          })
          .catch(() => {
            // If both cache and network fail, serve offline fallback
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' },
            });
          });
      })
  );
});

// Update caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
}); 