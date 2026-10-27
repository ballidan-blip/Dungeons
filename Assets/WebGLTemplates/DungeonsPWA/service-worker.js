/* Dungeons PWA shell cache. Unity build payload is deliberately not cached here:
   Unity data/framework/wasm files must be versioned and cached as one matching release. */
const CACHE_NAME = "dungeons-shell-v1";
const SHELL_FILES = ["./", "./manifest.webmanifest", "./icons/icon.svg"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  const url = new URL(request.url);
  // Cache only the app shell; always use network for Unity's version-coupled build files.
  if (url.pathname.endsWith("/manifest.webmanifest") || url.pathname.endsWith("/icons/icon.svg") || url.pathname.endsWith("/service-worker.js") || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/")) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
      }
      return response;
    }).catch(() => caches.match(request).then(cached => cached || caches.match("./"))));
  }
});
