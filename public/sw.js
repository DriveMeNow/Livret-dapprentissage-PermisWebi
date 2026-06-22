// Service Worker — Livret Permis Webi
// Cache-first pour les assets statiques, network-first pour le reste

const CACHE_NAME = 'livret-pw-v6'

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
]

// Installation : mise en cache initiale
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

// Activation : nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch : cache-first pour les assets, network-first pour le reste
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Assets statiques (JS, CSS, images) → cache-first
  if (
    url.origin === self.location.origin ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'd1yei2z3i6k35z.cloudfront.net'
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone()
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
          }
          return response
        }).catch(() => cached)
      })
    )
    return
  }

  // Google Fonts CSS → network-first avec fallback cache
  if (url.hostname === 'fonts.googleapis.com') {
    event.respondWith(
      fetch(request).then((response) => {
        const clone = response.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone))
        return response
      }).catch(() => caches.match(request))
    )
  }
})
