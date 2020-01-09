if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js").then(
      function(registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function(err) {
        console.log("ServiceWorker registration failed: ", err);
      }
    );
  });
}

var staticCacheName = "project-static-v2";
var urlsToCache = [
  "/",
  "/index.html",
  "/restaurant.html",
  "/css/styles.css",
  "/data/restaurants.json",
  "/js/",
  "/js/dbhelper.js",
  "/js/main.js",
  "/js/restaurant_info.js",
  "/img/",
  "/img/1.jpg",
  "/img/2.jpg",
  "/img/3.jpg",
  "/img/4.jpg",
  "/img/5.jpg",
  "/img/6.jpg",
  "/img/7.jpg",
  "/img/8.jpg",
  "/img/9.jpg",
  "/img/10.jpg"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith("project") && cacheName != staticCacheName
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("message", function(event) {
  if (event.data.action === "skipWaiting") {
    self.skipWaiting();
  }
});
