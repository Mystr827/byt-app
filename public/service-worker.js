self.addEventListener('install', evt => {
  evt.waitUntil(
    caches.open('byt-cache').then(cache => cache.addAll(['/','/style.css','/app.js','/manifest.json']))
  );
});

self.addEventListener('fetch', evt => {
  evt.respondWith(
    caches.match(evt.request).then(res => res || fetch(evt.request))
  );
});
