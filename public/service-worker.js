// Service Worker untuk Optimasi Mobile Low-End
const CACHE_NAME = 'travel-places-cache-v1';

// Aset yang perlu di-cache untuk penggunaan offline
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/images/mobile/borobudur-mobile.jpg',
  '/images/mobile/breeze-mobile.jpg',
  '/images/mobile/karaoke-mobile.jpg',
  '/images/mobile/makan-mobile.jpg',
  '/images/mobile/nako-mobile.jpg',
  '/fonts/inter-var.woff2'
];

// Event listener untuk instalasi service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Membuka cache');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Event listener untuk aktivasi service worker (membersihkan cache lama)
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Menghapus cache lama:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Strategi cache: Network first with cache fallback untuk halaman utama
// dan Cache first with network fallback untuk aset statis
self.addEventListener('fetch', event => {
  // Jangan cache permintaan ke API atau beban berat
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Cek apakah request adalah gambar
  const isImage = event.request.destination === 'image';
  
  // Cek apakah request adalah font atau CSS
  const isStaticAsset = 
    event.request.destination === 'font' || 
    event.request.destination === 'style' ||
    event.request.url.endsWith('.js') ||
    event.request.url.includes('fonts');

  // Strategi caching berbeda berdasarkan jenis request
  if (isImage || isStaticAsset) {
    // Untuk gambar dan aset statis: Cache first, network fallback
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then(response => {
              // Jangan cache response yang bukan success
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // PENTING: Clone response karena body hanya bisa digunakan sekali
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
                
              return response;
            })
            .catch(() => {
              // Berikan fallback image jika ini adalah gambar
              if (isImage) {
                return caches.match('/images/placeholder.jpg');
              }
            });
        })
    );
  } else {
    // Untuk konten HTML: Network first, cache fallback
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Jangan cache response yang bukan success
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // PENTING: Clone response
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
              
              // Fallback untuk halaman HTML: tampilkan halaman offline
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
});

// Menangani pesan dari client (main thread)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  // Menangani pesan untuk membersihkan cache
  if (event.data && event.data.type === 'CLEAR_IMAGES_CACHE') {
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.keys()
          .then(requests => {
            return Promise.all(
              requests
                .filter(request => request.url.match(/\.(jpg|jpeg|png|gif|webp)/i))
                .map(request => cache.delete(request))
            );
          });
      });
  }
}); 