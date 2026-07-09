const CACHE_NAME='project-fiesta-rc2-05-cache';
const ASSETS=['./','./index.html','./style.css','./app.js','./firebase.js','./auth.js','./firestore.js','./manifest.json','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE_NAME).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',event=>{event.respondWith(fetch(event.request).catch(()=>caches.match(event.request).then(response=>response||caches.match('./index.html'))));});
