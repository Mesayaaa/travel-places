// Service Worker untuk Optimasi Mobile Low-End
const CACHE_NAME = 'travel-places-cache-v2';
const IMG_CACHE_NAME = 'travel-places-images-v2';
const STATIC_CACHE_NAME = 'travel-places-static-v2';

// Resources that need to be cached for offline use
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/fonts/inter-var.woff2'
];

// Images that will be cached separately
const CRITICAL_IMAGES = [
  '/images/mobile/borobudur-mobile.jpg',
  '/images/mobile/breeze-mobile.jpg',
  '/images/mobile/karaoke-mobile.jpg',
  '/images/mobile/makan-mobile.jpg',
  '/images/mobile/nako-mobile.jpg'
];

// Installation event handler
self.addEventListener('install', event => {
  event.waitUntil(
    Promise.all([
      // Cache critical assets
      caches.open(CACHE_NAME)
        .then(cache => {
          console.log('Opening main cache');
          return cache.addAll(CRITICAL_ASSETS);
        }),
      
      // Cache critical images separately
      caches.open(IMG_CACHE_NAME)
        .then(cache => {
          console.log('Opening image cache');
          return cache.addAll(CRITICAL_IMAGES);
        })
    ])
    .then(() => self.skipWaiting())
  );
});

// Activation event handler (clean old caches)
self.addEventListener('activate', event => {
  const validCaches = [CACHE_NAME, IMG_CACHE_NAME, STATIC_CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!validCaches.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network detection
const isOnSlowConnection = () => {
  return !navigator.onLine || 
    (navigator.connection && 
     (navigator.connection.effectiveType === 'slow-2g' || 
      navigator.connection.effectiveType === '2g' || 
      navigator.connection.effectiveType === '3g' || 
      navigator.connection.saveData));
};

// Helper to determine if a URL is an image
const isImageRequest = (url) => {
  return url.match(/\.(jpg|jpeg|png|gif|webp|avif|svg)/i);
};

// Helper to determine if a URL is a static asset (CSS, JS, font)
const isStaticAsset = (url) => {
  return url.match(/\.(css|js|woff2?|ttf|otf|eot)/i);
};

// Fetch event handler with optimized caching strategies
self.addEventListener('fetch', event => {
  // Don't cache API requests
  if (event.request.url.includes('/api/')) {
    return;
  }

  const url = new URL(event.request.url);
  
  // Handle image requests
  if (isImageRequest(url.pathname) || event.request.destination === 'image') {
    handleImageRequest(event);
    return;
  }
  
  // Handle static assets (CSS, JS, Fonts)
  if (isStaticAsset(url.pathname) || 
      ['style', 'script', 'font'].includes(event.request.destination)) {
    handleStaticAssetRequest(event);
    return;
  }
  
  // Handle HTML/Navigation requests
  handleNavigationRequest(event);
});

// Specifically optimized for images
function handleImageRequest(event) {
  const strategy = isOnSlowConnection() ? 
    'cache-first-aggressive' : 'stale-while-revalidate';
  
  if (strategy === 'cache-first-aggressive') {
    // For slow connections, use cache first with limited network fallback
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // For slow connections, we may want to use low-res versions
          // Check for a low-quality placeholder version
          const lowResUrl = new URL(event.request.url);
          if (lowResUrl.pathname.includes('/images/') && !lowResUrl.pathname.includes('-low.')) {
            const lowResPath = lowResUrl.pathname.replace(/(\.\w+)$/, '-low$1');
            const lowResRequest = new Request(new URL(lowResPath, lowResUrl.origin).toString());
            
            return caches.match(lowResRequest)
              .then(lowResResponse => {
                if (lowResResponse) {
                  return lowResResponse;
                }
                
                // If no cached version, try network but with a shorter timeout
                return Promise.race([
                  fetch(event.request.clone(), { cache: 'no-store' }),
                  new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 3000))
                ])
                .then(response => {
                  if (!response || response.status !== 200) {
                    throw new Error('Bad response');
                  }
                  
                  // Cache the response
                  const responseToCache = response.clone();
                  caches.open(IMG_CACHE_NAME)
                    .then(cache => cache.put(event.request, responseToCache));
                  
                  return response;
                })
                .catch(() => {
                  // Return a placeholder image as last resort
                  return caches.match('/images/placeholder.jpg');
                });
              });
          }
          
          // Fallback to network with a short timeout
          return fetch(event.request.clone(), { cache: 'no-store' })
            .catch(() => caches.match('/images/placeholder.jpg'));
        })
    );
  } else {
    // For good connections, use stale-while-revalidate pattern
    event.respondWith(
      caches.open(IMG_CACHE_NAME)
        .then(cache => {
          return cache.match(event.request)
            .then(cachedResponse => {
              const fetchPromise = fetch(event.request)
                .then(networkResponse => {
                  if (networkResponse && networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  return cachedResponse || caches.match('/images/placeholder.jpg');
                });
                
              return cachedResponse || fetchPromise;
            });
        })
    );
  }
}

// For CSS, JS, and fonts
function handleStaticAssetRequest(event) {
  event.respondWith(
    caches.open(STATIC_CACHE_NAME)
      .then(cache => {
        return cache.match(event.request)
          .then(cachedResponse => {
            // Always try to update the cache in the background
            const fetchPromise = fetch(event.request)
              .then(networkResponse => {
                if (networkResponse && networkResponse.status === 200) {
                  cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
              })
              .catch(() => cachedResponse);
              
            // Return cached response immediately if available, otherwise wait for network
            return cachedResponse || fetchPromise;
          });
      })
  );
}

// For HTML pages
function handleNavigationRequest(event) {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        const responseToCache = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseToCache);
          });
          
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // Fallback for offline navigation
            if (event.request.mode === 'navigate') {
              return caches.match('/');
            }
            
            return new Response('Network error happened', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
}

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Handle clearing image cache
  if (event.data && event.data.type === 'CLEAR_IMAGES_CACHE') {
    caches.open(IMG_CACHE_NAME)
      .then(cache => {
        return cache.keys()
          .then(requests => {
            return Promise.all(
              requests.map(request => cache.delete(request))
            );
          });
      });
  }
  
  // Handle connection changes
  if (event.data && event.data.type === 'CONNECTION_CHANGED') {
    // We could adapt caching strategies based on connection quality
    console.log('Connection changed:', event.data.effectiveType);
  }
}); 