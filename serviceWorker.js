// Console logs for debugging
console.log("log from service worker");

addEventListener("install", () => {
  console.log("Service worker is installing...");
});

addEventListener("activate", () => {
  console.log("Service worker is activated...");
});

addEventListener("fetch", (fetchEvent) => {
  const request = fetchEvent.request;
  console.log(request);

  if (fetchEvent) {
    fetchEvent.respondWith(
      fetch(request)
        .then((fetchResponse) => fetchResponse)
        .catch((error) => {
          return new Response("<h1>Oops!</h1><p>Failure to fetch data</p>", {
            headers: {
              "Content-type": "text/html; charset=utf-8",
            },
          });
        })
    );
  }
});
