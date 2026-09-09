// Service worker : permet d'ouvrir l'app même sans connexion.
// Les données ne sont PAS ici (elles sont dans localStorage) ; ce fichier ne met en cache que l'interface.
const CACHE = "suivi-calories-v35";
const FILES = ["./", "./index.html", "./manifest.json", "./zxing.min.js", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
// La page peut demander l'activation immédiate d'une nouvelle version.
self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});
// Réseau d'abord (pour récupérer les mises à jour), cache en secours (hors-ligne).
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return; // ne pas intercepter Open Food Facts
  e.respondWith(
    fetch(e.request, { cache: "no-store" }).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(e.request, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match(e.request).then((r) => r || caches.match("./index.html")))
  );
});
