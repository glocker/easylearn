// Console logs for debugging
console.log("log from service worker");

addEventListener("install", () => {
  console.log("Service worker is installing...");
});

addEventListener("activate", () => {
  console.log("Service worker is activated...");
});

addEventListener("fetch", () => {
  console.log("Service worker is fetching...");
});
