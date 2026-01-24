const CACHE_NAME = "onnews-cache-v1";
const ASSETS = [
  "/",
  "/index.html",
  "/write.html",
  "/css/style.css",
  "/js/news.js",
  "/js/view.js",
  "/js/write.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
