import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  StaleWhileRevalidate,
  CacheFirst,
  NetworkFirst,
} from "workbox-strategies";

// Precache static resources
precacheAndRoute(self.__WB_MANIFEST);

// Cache API
registerRoute(
  ({ url }) => url.pathname.startsWith("/api"),
  new NetworkFirst({
    cacheName: "api-cache",
  })
);

// Caching images
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
  })
);

// Caching /courses/* pages
registerRoute(
  ({ url }) => url.pathname.startsWith("/courses"),
  new StaleWhileRevalidate({
    cacheName: "courses-pages",
  })
);
