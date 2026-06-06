const CACHE = "mbpp-v2";
const STATIC_CACHE = "mbpp-static-v2";

const STATIC_EXTENSIONS = [".js", ".css", ".woff2", ".woff", ".png", ".jpg", ".svg", ".ico", ".webp"];

self.addEventListener("install", (e) => {
  e.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== STATIC_CACHE).map((k) => caches.delete(k))))
  );
  e.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  const isStatic = STATIC_EXTENSIONS.some((ext) => url.pathname.endsWith(ext));

  if (isStatic) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request).then((res) => {
        const clone = res.clone();
        caches.open(STATIC_CACHE).then((c) => c.put(e.request, clone));
        return res;
      }))
    );
  } else {
    // Never cache HTML — always fetch from network
    e.respondWith(fetch(e.request).catch(() => caches.match("/offline")));
  }
});
