/* sw.js - Service Worker for offline caching
   Cache-First: Static assets (CSS/JS) — versioned, rarely change
   Network-First: Data files (JSON), HTML, and media files
   Media files are NEVER cached to avoid truncated/partial playback issues
*/

const CACHE_STATIC = "dailysong-static-v7";
const CACHE_DATA = "dailysong-data-v7";

const STATIC_ASSETS = [
  "../../",
  "../../index.html",
  "../../assets/css/base.css",
  "../../assets/css/card.css",
  "../../assets/css/player.css",
  "../../assets/js/utils.js",
  "../../assets/js/main.js",
  "../../assets/js/render.js",
  "../../assets/js/audioPlayer.js",
  "../../assets/js/embedPlayer.js",
  "../../assets/js/activeSongLoader.js",
  "../../assets/js/songSelector.js",
  "../../assets/js/config.js",
  "../../assets/js/normalizer.js",
  "../../assets/js/themeSwitch.js",
  "../../assets/pwa/manifest.json",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE_STATIC && k !== CACHE_DATA).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;

  // Allow same-origin and Google Fonts cross-origin requests
  const isGoogleFonts = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (url.origin !== self.location.origin && !isGoogleFonts) return;

  // --- Routing strategy ---

  // 1. Google Fonts → network-first (fonts may update)
  if (isGoogleFonts) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 2. Range requests (audio/video seeking) → pass through to network
  //    Caching partial (206) responses breaks playback on subsequent visits
  if (event.request.headers.has("range")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Data files (JSON) → network-first (song list changes frequently)
  if (url.pathname.includes("/data/")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 4. Media files (audio/covers) → network-first, no caching
  //    Audio files are large; cached versions may be truncated causing
  //    playback to stop prematurely (e.g. at ~70%)
  if (url.pathname.includes("/media/")) {
    event.respondWith(networkOnly(event.request));
    return;
  }

  // 5. Everything else (CSS/JS/images) → cache-first (static, versioned)
  event.respondWith(cacheFirst(event.request));
});

/** Cache-first: serve from cache, fall back to network. Only caches complete 200 responses. */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    // Only cache successful complete responses (not 206 partial, not redirects)
    if (response.ok && response.status === 200) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return new Response("", { status: 503 });
  }
}

/** Network-first: try network, fall back to cache. Only caches complete 200 responses. */
async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok && response.status === 200) {
      const cache = await caches.open(CACHE_DATA);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    return cached || new Response(JSON.stringify({ error: "offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/** Network-only: always fetch from network, never cache. Used for media files. */
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (_) {
    return new Response("", { status: 503 });
  }
}
