/* Only this game's own cache namespace is managed. */
const CACHE = 'one-lane-escape-v1.0.0';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('one-lane-escape-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
 const url = new URL(event.request.url);
 if(event.request.method !== 'GET' || url.origin !== self.location.origin) return;
 if(event.request.mode === 'navigate') {
  event.respondWith(fetch(event.request).then(response => { if(response.ok) {const copy=response.clone();caches.open(CACHE).then(cache=>cache.put('./index.html',copy));} return response; }).catch(() => caches.match('./index.html')));
 } else {
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
 }
});
