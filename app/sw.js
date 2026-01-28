// Service Worker for ScriptO Studio PWA
const CACHE_NAME = 'scripto-studio-v11';
const RUNTIME_CACHE = 'scripto-studio-runtime-v11';

// Install event - skip pre-caching, activate immediately
// We'll cache assets dynamically as they're requested to avoid stale content
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  // Skip waiting to activate immediately
  event.waitUntil(self.skipWaiting());
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // Don't claim clients immediately - let pages load naturally first
      // This prevents interference with initial page load
      return Promise.resolve();
    })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Handle registry and GitHub raw URLs (cross-origin)
  const isRegistryUrl = url.hostname === 'jetpax.github.io' && url.pathname.includes('/scripto-studio-registry/')
  const isGitHubRaw = url.hostname === 'raw.githubusercontent.com'
  
  // For registry index.json, use stale-while-revalidate
  if (isRegistryUrl && url.pathname.endsWith('index.json')) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          // Always try to fetch fresh version in background
          const fetchPromise = fetch(request)
            .then((response) => {
              if (response && response.ok) {
                const responseClone = response.clone()
                caches.open(RUNTIME_CACHE).then((cache) => {
                  cache.put(request, responseClone)
                }).catch(() => {})
              }
              return response
            })
            .catch(() => null)
          
          // If we have cached version, return it immediately
          if (cachedResponse) {
            fetchPromise.catch(() => {}) // Don't wait for background update
            return cachedResponse
          }
          
          // No cache, wait for network
          return fetchPromise.then((networkResponse) => {
            if (networkResponse && networkResponse.ok) {
              return networkResponse
            }
            return new Response('Offline', { status: 503 })
          })
        })
    )
    return
  }
  
  // For ScriptO .py files from GitHub raw, cache with network-first
  if (isGitHubRaw && url.pathname.endsWith('.py')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          if (response && response.ok) {
            const responseClone = response.clone()
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone)
            }).catch(() => {})
          }
          return response
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse
            }
            return new Response('Offline', { status: 503 })
          })
        })
    )
    return
  }
  
  // Skip other cross-origin requests
  if (url.origin !== location.origin) {
    return
  }
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // For HTML/navigation requests, always fetch from network, never from cache
  // This ensures the app always loads fresh HTML
  if (request.mode === 'navigate' || (request.headers.get('accept') && request.headers.get('accept').includes('text/html'))) {
    // Don't intercept - let browser handle it naturally, or fetch with bypass
    event.respondWith(
      fetch(request, {
        cache: 'no-store',
        redirect: 'follow'
      })
        .then((response) => {
          // Return fresh response, don't cache HTML
          return response;
        })
        .catch((error) => {
          // Only if completely offline, try cache as last resort
          console.warn('[SW] Network failed for HTML, trying cache:', error);
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // Last resort fallback
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('Offline', { 
              status: 503,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
        })
    );
    return;
  }
  
  // For JavaScript files, use network-first to ensure fresh code loads
  // This prevents stale JS from breaking the app
  if (request.destination === 'script' || url.pathname.endsWith('.js')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          // Cache successful responses for offline use
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            }).catch(() => {
              // Ignore cache errors
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }
  
  // Network-first strategy for CSS files, JSON files (translations), and sprite SVG to ensure changes are visible immediately
  if (request.destination === 'style' || url.pathname.endsWith('.css') || url.pathname.endsWith('.json') || url.pathname.includes('tabler-sprite.svg')) {
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          // Cache successful responses for offline use
          if (response && response.ok) {
            const responseClone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(request, responseClone);
            }).catch(() => {
              // Ignore cache errors
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return new Response('Offline', { status: 503 });
          });
        })
    );
    return;
  }
  
  // Stale-while-revalidate strategy for other static assets (fonts, images)
  // This serves from cache immediately, then updates cache in background
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Always try to fetch fresh version in background (for cache update)
        const fetchPromise = fetch(request, { cache: 'no-cache' })
          .then((response) => {
            // Only cache successful responses
            if (response && response.ok) {
              const responseClone = response.clone();
              caches.open(RUNTIME_CACHE).then((cache) => {
                cache.put(request, responseClone);
              }).catch(() => {
                // Ignore cache errors
              });
            }
            return response;
          })
          .catch(() => {
            // Network failed - that's okay, we'll use cache if available
            return null;
          });
        
        // If we have cached version, return it immediately (stale-while-revalidate)
        if (cachedResponse) {
          // Update cache in background, but don't wait
          fetchPromise.catch(() => {
            // Ignore errors
          });
          return cachedResponse;
        }
        
        // No cache, wait for network
        return fetchPromise.then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            return networkResponse;
          }
          // Network failed and no cache
          if (request.destination === 'image') {
            return new Response('', { status: 404 });
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});
