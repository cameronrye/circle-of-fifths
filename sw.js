/**
 * Service Worker for Circle of Fifths
 * Enhanced PWA functionality with improved caching strategies and offline support
 */

const CACHE_VERSION = '2.0.2';
const STATIC_CACHE_NAME = `circle-of-fifths-static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `circle-of-fifths-dynamic-v${CACHE_VERSION}`;
const _OFFLINE_PAGE = '/offline.html';

// Static resources that should be cached immediately
const STATIC_ASSETS = [
    './',
    './index.html',
    './css/styles.css',
    './js/polyfills.js',
    './js/logger.js',
    './js/musicTheory.js',
    './js/audioEngine.js',
    './js/circleRenderer.js',
    './js/interactions.js',
    './js/themeManager.js',
    './js/themeToggle.js',
    './js/app.js',
    './assets/logo.svg',
    './assets/favicon.svg',
    './assets/favicon.png',
    './assets/icon-192x192.png',
    './assets/icon-512x512.png',
    './assets/apple-touch-icon.png',
    './manifest.json'
];

// Network-first resources (always try network first)
const NETWORK_FIRST_PATTERNS = [/\/api\//, /\.json$/];

// Cache-first resources (serve from cache if available)
const CACHE_FIRST_PATTERNS = [
    /\.css$/,
    /\.js$/,
    /\.svg$/,
    /\.png$/,
    /\.jpg$/,
    /\.jpeg$/,
    /\.gif$/,
    /\.webp$/
];

// Maximum age for dynamic cache (7 days)
const _DYNAMIC_CACHE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
const DYNAMIC_CACHE_MAX_ITEMS = 50;

/**
 * Install event - cache static resources
 */
self.addEventListener('install', event => {
    console.log('Service Worker installing...');

    event.waitUntil(
        caches
            .open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('Static assets cached successfully');
                // Force the waiting service worker to become the active service worker
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Failed to cache static assets:', error);
                throw error;
            })
    );
});

/**
 * Activate event - clean up old caches and take control
 */
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');

    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            }),
            // Take control of all clients
            self.clients.claim()
        ]).then(() => {
            console.log('Service Worker activated successfully');
        })
    );
});

/**
 * Fetch event - enhanced caching strategies
 */
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        return;
    }

    event.respondWith(handleFetch(request));
});

/**
 * Handle fetch requests with appropriate caching strategy
 */
async function handleFetch(request) {
    const url = new URL(request.url);

    try {
        // Check if this is a navigation request
        if (request.mode === 'navigate') {
            return await handleNavigationRequest(request);
        }

        // Apply caching strategy based on resource type
        if (isNetworkFirst(url.pathname)) {
            return await networkFirstStrategy(request);
        } else if (isCacheFirst(url.pathname)) {
            return await cacheFirstStrategy(request);
        } else {
            return await staleWhileRevalidateStrategy(request);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        return await handleFetchError(request);
    }
}

/**
 * Handle navigation requests (HTML pages)
 */
async function handleNavigationRequest(request) {
    try {
        // Try network first for navigation
        const networkResponse = await fetch(request);

        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch {
        // If network fails, try cache
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }

        // If no cache, return offline page
        return (await caches.match('./index.html')) || new Response('Offline', { status: 503 });
    }
}

/**
 * Network-first strategy: try network, fallback to cache
 */
async function networkFirstStrategy(request) {
    try {
        const networkResponse = await fetch(request);

        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            cache.put(request, networkResponse.clone());
        }

        return networkResponse;
    } catch (error) {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        throw error;
    }
}

/**
 * Cache-first strategy: try cache, fallback to network
 */
async function cacheFirstStrategy(request) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        return cachedResponse;
    }

    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
        // Cleanup cache periodically
        maybeCleanupCache();
    }

    return networkResponse;
}

/**
 * Stale-while-revalidate strategy: serve from cache, update in background
 */
async function staleWhileRevalidateStrategy(request) {
    const cachedResponse = await caches.match(request);

    // Start network request in background
    const networkPromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                const cache = caches.open(DYNAMIC_CACHE_NAME);
                cache.then(c => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
        })
        .catch(() => null);

    // Return cached response immediately if available
    if (cachedResponse) {
        return cachedResponse;
    }

    // If no cache, wait for network
    return (await networkPromise) || new Response('Network error', { status: 503 });
}

/**
 * Handle fetch errors
 */
async function handleFetchError(request) {
    // For navigation requests, return the main page
    if (request.mode === 'navigate') {
        const cachedIndex = await caches.match('./index.html');
        if (cachedIndex) {
            return cachedIndex;
        }
    }

    // For other requests, return a generic error response
    return new Response('Resource not available offline', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

/**
 * Check if URL should use network-first strategy
 */
function isNetworkFirst(pathname) {
    return NETWORK_FIRST_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * Check if URL should use cache-first strategy
 */
function isCacheFirst(pathname) {
    return CACHE_FIRST_PATTERNS.some(pattern => pattern.test(pathname));
}

/**
 * Clean up old cache entries
 * Called during fetch to keep cache size manageable
 */
async function cleanupDynamicCache() {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const keys = await cache.keys();

    if (keys.length > DYNAMIC_CACHE_MAX_ITEMS) {
        const sortedKeys = keys.sort((a, b) => {
            // Sort by last modified (if available) or URL
            return a.url.localeCompare(b.url);
        });

        const keysToDelete = sortedKeys.slice(0, keys.length - DYNAMIC_CACHE_MAX_ITEMS);
        await Promise.all(keysToDelete.map(key => cache.delete(key)));
    }
}

/**
 * Track cache cleanup to avoid running too frequently
 */
let lastCleanupTime = 0;
const CLEANUP_INTERVAL = 60000; // 1 minute

/**
 * Conditionally clean up cache if enough time has passed
 */
async function maybeCleanupCache() {
    const now = Date.now();
    if (now - lastCleanupTime > CLEANUP_INTERVAL) {
        lastCleanupTime = now;
        await cleanupDynamicCache();
    }
}
