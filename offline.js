const cacheName = 'kamakura-trip-9a9bdd67e7e704';
const rootPage = new URL('./', self.location.href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    await cache.add(new Request(rootPage, {cache:'reload'}));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const name of await caches.keys()) {
      if (name.startsWith('kamakura-trip-') && name !== cacheName) await caches.delete(name);
    }
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const requested = new URL(event.request.url);
  if (event.request.mode !== 'navigate' || requested.origin !== rootPage.origin ||
      (requested.pathname !== rootPage.pathname && requested.pathname !== rootPage.pathname + 'index.html')) return;

  event.respondWith((async () => {
    try { return await fetch(event.request); }
    catch {
      const cached = await caches.match(rootPage);
      return cached || new Response('離線中，請重新連線。', {
        status:503, headers:{'Content-Type':'text/plain; charset=utf-8'},
      });
    }
  })());
});
