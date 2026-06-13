/* sw.js - Service Worker 离线缓存
   Cache-First: 静态资源 (CSS/JS)
   Network-First: 数据文件 (JSON) 与 HTML
*/

const CACHE_STATIC = "dailysong-static-v2";
const CACHE_DATA = "dailysong-data-v2";

const STATIC_ASSETS = [
  "/",
  "index.html",
  "assets/css/base.css",
  "assets/css/card.css",
  "assets/css/player.css",
  "assets/css/theme.css",
  "assets/js/utils.js",
  "assets/js/main.js",
  "assets/js/render.js",
  "assets/js/audioPlayer.js",
  "assets/js/embedPlayer.js",
  "assets/js/activeSongLoader.js",
  "assets/js/songSelector.js",
  "assets/js/dataLoader.js",
  "assets/js/config.js",
  "manifest.json",
];

// 安装
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// 激活: 清理旧缓存
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_STATIC && k !== CACHE_DATA)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// 请求拦截
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET") return;
  if (url.origin !== self.location.origin) return;

  // Google Fonts: Network-First
  if (
    url.hostname === "fonts.googleapis.com" ||
    url.hostname === "fonts.gstatic.com"
  ) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 数据文件: Network-First
  if (url.pathname.startsWith("/data/")) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 静态资源: Cache-First
  event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_STATIC);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    return new Response("", { status: 503 });
  }
}

async function networkFirst(request) {
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response.ok) {
      const cache = await caches.open(CACHE_DATA);
      cache.put(request, response.clone());
    }
    return response;
  } catch (_) {
    const cached = await caches.match(request);
    return (
      cached ||
      new Response(JSON.stringify({ error: "offline" }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      })
    );
  }
}
