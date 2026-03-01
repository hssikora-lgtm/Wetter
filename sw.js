/* ===== Wolfsegg 2026 – Service Worker v1.1.0 ===== */

// Durch das Ändern dieser Version erkennt der Browser das Update
const CACHE_NAME = "wolfsegg-2026-v1.1.0";

const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Installieren: Dateien in den Cache laden
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Cache wird befüllt");
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  // Sofort aktivieren, nicht auf Schließen des Browsers warten
  self.skipWaiting();
});

// Aktivieren: Alten Cache löschen
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Service Worker: Alter Cache wird gelöscht", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch: Dateien aus dem Cache servieren (für Offline-Modus & Speed)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Entweder aus dem Cache oder neu vom Server laden
      return response || fetch(event.request);
    })
  );
});
