/* ===== Wolfsegg 2026 – Stabiler Service Worker v2.1.0 ===== */

const CACHE_NAME = "wolfsegg-openmeteo-v2.1.0";

// Diese Dateien werden offline gespeichert
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-512.png"
];

// Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Aktivierung: Löscht alle alten GeoSphere-Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Netzwerk-Anfragen bearbeiten
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Gibt Datei aus Cache zurück oder lädt sie aus dem Netz
      return response || fetch(event.request);
    })
  );
});
