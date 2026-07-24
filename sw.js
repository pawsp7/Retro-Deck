const CACHE_NAME = 'master-control-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/shelf.html',
  '/discover.html',
  '/settings.html',
  '/manifest.json',
  '/css/mobile.css',
  '/js/app.js',
  '/js/nav.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  'https://cdn.tailwindcss.com?plugins=forms,container-queries',
  'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@700&family=Hanken+Grotesk:wght@500;800&family=Space+Mono:wght@700&family=Epilogue:wght@500&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const network = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.url.startsWith(self.location.origin)) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);

      return cached || network;
    })
  );
});
