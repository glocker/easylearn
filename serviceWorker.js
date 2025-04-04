addEventListener("activate", (activateEvent) => {
  console.log("Service worker is activated...");

  activateEvent.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        // Delete old cache
        const freshCache = cacheNames.map((cacheName) => {
          if (cacheName != staticCacheName) {
            return caches.delete(cacheName);
          }
        });

        // Use new cache
        return Promise.all(freshCache);
      })
      .then(() => {
        return clients.claim();
      })
  );
});

// Triggers when service worker firstly downloads
addEventListener("install", (installEvent) => {
  console.log("Service worker is installing...");

  const cacheVersion = "v0.01";
  const staticCacheName = "staticFiles" + cacheVersion;

  // Old sw changes to new one
  // in  life cycle waiting stage: download, install, wait (here), activate
  // Same as "update on reload" checkbox in chrome dev tools
  skipWaiting();

  // Populate static cache
  installEvent.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      // Nice to have
      // fonts, pictures
      staticCache.addAll([]);

      // Must have
      // css, js
      return staticCache.addAll(["/src/main.tsx", "/src/offline.html"]);
    })
  );
});

// Triggers when browser needs recource
addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  console.log(request);

  if (fetchEvent) {
    fetchEvent.respondWith(
      caches.match(request).then((fetchResponse) => {
        // Use cached resource if it's exists
        if (fetchResponse) {
          return fetchResponse;
        }

        // No cache - use regular fetching
        return fetch(request)
          .then((fetchResponse) => fetchResponse)
          .catch((error) => {
            return caches.match("/src/offline.html");
          });
      })
    );
  }
});
