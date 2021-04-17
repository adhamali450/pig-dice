const cacheName = "v1";
const cacheAssets = [
  //html
  "index.html",
  "game.html",
  //css
  "css/index.css",
  "css/game.css",
  //js
  "js/animations.js",
  "js/characters.js",
  "js/flex-slider.js",
  "js/game.js",
  "js/generic.js",
  "js/index.js",
  "js/lottie.min.js",
  "js/utils.js",
  "js/vue.min.js",
  //web manifest
  "manifest.webmanifest",
  //icons
  "assets/absurd-pale.webp",
  "assets/absurd.webp",
  "assets/adventure-time.webp",
  "assets/adventure-time/bmo.svg",
  "assets/adventure-time/bubble-gum.svg",
  "assets/adventure-time/finn.svg",
  "assets/adventure-time/ice-king.svg",
  "assets/adventure-time/jake.svg",
  "assets/adventure-time/lumpy-space.svg",
  "assets/adventure-time/marceline.svg",
  "assets/arrow.svg",
  "assets/lock.svg",
  "assets/favicon.svg",
  "assets/Frame.svg",
  "assets/heart.png",
  "assets/pig.svg",
  "assets/pig-pale.svg",
  "assets/star-medal.svg",
  "assets/steven-universe.webp",
  "assets/steven-universe/amethyst.svg",
  "assets/steven-universe/dark.svg",
  "assets/steven-universe/grant.svg",
  "assets/steven-universe/greg.svg",
  "assets/steven-universe/light.svg",
  "assets/steven-universe/pearl.svg",
  "assets/steven-universe/rose-quartz.svg",
  "assets/steven-universe/ruby.svg",
  "assets/steven-universe/sapphire.svg",
  "assets/steven-universe/steven.svg",
  "assets/swords-fluent.svg",
  "assets/swords-plumpy.svg",
  //icons
  "assets/icons/apple-splash-2048-2732.jpg",
  "assets/icons/apple-splash-2048-1536.jpg",
  "assets/icons/apple-splash-2778-1284.jpg",
  "assets/icons/apple-splash-1536-2048.jpg",
  "assets/icons/apple-splash-2388-1668.jpg",
  "assets/icons/apple-splash-1668-2388.jpg",
  "assets/icons/apple-splash-1620-2160.jpg",
  "assets/icons/apple-splash-640-1136.jpg",
  "assets/icons/apple-splash-750-1334.jpg",
  "assets/icons/apple-splash-1136-640.jpg",
  "assets/icons/apple-splash-1242-2688.jpg",
  "assets/icons/apple-splash-1125-2436.jpg",
  "assets/icons/apple-splash-1242-2208.jpg",
  "assets/icons/apple-splash-2208-1242.jpg",
  "assets/icons/apple-splash-1792-828.jpg",
  "assets/icons/apple-splash-828-1792.jpg",
  "assets/icons/apple-splash-1170-2532.jpg",
  "assets/icons/apple-splash-2436-1125.jpg",
  "assets/icons/apple-splash-1284-2778.jpg",
  "assets/icons/apple-splash-1334-750.jpg",
  "assets/icons/apple-splash-2532-1170.jpg",
  "assets/icons/apple-splash-2160-1620.jpg",
  "assets/icons/apple-splash-2732-2048.jpg",
  "assets/icons/apple-splash-1668-2224.jpg",
  "assets/icons/apple-splash-2224-1668.jpg",
  "assets/icons/apple-splash-2688-1242.jpg",
  "assets/icons/apple-icon-180.png",
  "assets/icons/manifest-icon-192.png",
  "assets/icons/manifest-icon-512.png",
];

//Call install event
self.addEventListener("install", (e) => {
  console.log("Service worker: installed");

  e.waitUntil(
    caches
      .open(cacheName)
      .then((cache) => {
        console.log("Caching files...");
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

//Call activate event
self.addEventListener("activate", (e) => {
  console.log("Service worker: activated");

  //remove unwanted old caches
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== cacheName) {
            console.log("Service worker: clearing old cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

//call fetch event
self.addEventListener("fetch", (e) => {
  e.respondWith(
    (async () => {
      const r = await caches.match(e.request);
      console.log(`[Service Worker] Fetching resource: ${e.request.url}`);
      if (r) {
        return r;
      }
      const response = await fetch(e.request);
      const cache = await caches.open(cacheName);
      console.log(`[Service Worker] Caching new resource: ${e.request.url}`);

      if (!(e.request.url.indexOf("http") === 0)) return;
      cache.put(e.request, response.clone());
      return response;
    })()
  );
});
