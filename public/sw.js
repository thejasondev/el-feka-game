// Service Worker con estrategia Stale-While-Revalidate
// Se actualiza automáticamente sin intervención del usuario

const CACHE_NAME = "el-feka-cache";

// Assets estáticos que raramente cambian
const STATIC_ASSETS = [
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/manifest.json",
  "/og-image.png",
  "/splash-logo.png",
  "/web-app-manifest-192x192.png",
  "/web-app-manifest-512x512.png",
];

// Install: cachear assets estáticos
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activar inmediatamente sin esperar
  self.skipWaiting();
});

// Activate: limpiar caches viejos y tomar control
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // Tomar control de todas las páginas inmediatamente
  self.clients.claim();
});

// Fetch: Stale-While-Revalidate para HTML/JS, Cache-First para assets
self.addEventListener("fetch", (event) => {
  // Ignorar requests que no son GET
  if (event.request.method !== "GET") return;

  // Ignorar requests externos
  if (!event.request.url.startsWith(self.location.origin)) return;

  const url = new URL(event.request.url);

  // Para Next.js _next/static - estos tienen hash único, cache-first es OK
  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Para assets estáticos (imágenes, iconos) - cache-first
  if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Para HTML y otros recursos dinámicos: NETWORK-FIRST con fallback a cache
  // Esto asegura que siempre obtengan la versión más reciente
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es válida, guardarla en cache
        if (response.ok) {
          const clone = response.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Si falla la red, usar cache (modo offline)
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Si es la página principal y no hay nada en cache, mostrar página offline
          if (event.request.mode === "navigate") {
            return caches.match("/");
          }
          return new Response("Offline", { status: 503 });
        });
      })
  );
});

// Escuchar mensajes para actualizar manualmente si es necesario
self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
