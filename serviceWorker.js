// Console logs for debugging
console.log("log from service worker");

addEventListener("install", () => {
  console.log("Service worker is installing...");
});

addEventListener("activate", () => {
  console.log("Service worker is activated...");
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
            return new Response("<h1>Oops!</h1><p>Failure to fetch data</p>", {
              headers: {
                "Content-type": "text/html; charset=utf-8",
              },
            });
          });
      })
    );
  }
});

// Triggers when service worker firstly downloads
addEventListener("install", (installEvent) => {
  // Populate static cache
  installEvent.waitUntil(
    caches.open(staticCacheName).then((staticCache) => {
      // Nice to have
      // fonts, pictures
      staticCache.addAll([]);

      // Must have
      // css, js
      return staticCache.addAll([]);
    })
  );
});
