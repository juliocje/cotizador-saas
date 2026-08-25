// Service Worker básico para Cotizador Express PWA
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Petición estándar a la red
  event.respondWith(fetch(event.request));
});