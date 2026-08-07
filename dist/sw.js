const CACHE_NAME = 'geoatlas-offline-v1';
const TILE_CACHE_NAME = 'geoatlas-tiles-v1';

// Install event - cache core shell assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/src/main.jsx',
                '/src/app.js',
                '/assets/style.css',
                'https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap',
                'https://unpkg.com/lucide@latest'
            ]).catch(err => console.warn('Pre-cache warning:', err));
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME && key !== TILE_CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Helper to check if a request can be cached
function isCacheable(response, request) {
    if (!response || response.status !== 200 || response.type !== 'basic' && response.type !== 'cors') {
        return false;
    }
    const url = new URL(request.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return false;
    }
    // Don't cache hot-reload modules in Vite development
    if (url.searchParams.has('t') || url.pathname.includes('@vite') || url.pathname.includes('__vite_ping')) {
        return false;
    }
    return true;
}

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);

    // 1. Map Tiles Caching (Cache-First with Subdomain Normalization)
    if (url.hostname.includes('basemaps.cartocdn.com')) {
        const normalizedUrl = e.request.url.replace(/\/\/[a-d]\.basemaps/, '//a.basemaps');
        
        e.respondWith(
            caches.open(TILE_CACHE_NAME).then((cache) => {
                return cache.match(normalizedUrl).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(e.request).then((networkResponse) => {
                        if (networkResponse.status === 200) {
                            cache.put(normalizedUrl, networkResponse.clone());
                        }
                        return networkResponse;
                    }).catch(() => {
                        // Empty tile response for missing tiles when offline
                        return new Response('', { status: 404 });
                    });
                });
            })
        );
        return;
    }

    // 2. Application Assets Caching (Network-First with Cache Fallback)
    // Always fetch from network to support HMR during dev, fallback to cache if offline
    e.respondWith(
        fetch(e.request)
            .then((response) => {
                if (isCacheable(response, e.request)) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(e.request, responseClone);
                    });
                }
                return response;
            })
            .catch(() => {
                return caches.match(e.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // If offline and request is HTML navigation, fallback to root
                    if (e.request.headers.get('accept')?.includes('text/html')) {
                        return caches.match('/');
                    }
                    return new Response('Network error occurred', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});
