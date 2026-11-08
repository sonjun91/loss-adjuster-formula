const CACHE_NAME='loss-adjuster-formulas-d9636dca667e';
const FILES=['./index.html','./manifest.webmanifest','./app-icon.svg','./app-icon-192.png','./app-icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(
  caches.open(CACHE_NAME).then(cache=>cache.addAll(FILES.map(file=>new Request(new URL(file,self.location.href),{cache:'reload'})))).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
  caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('loss-adjuster-formulas-')&&key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const base=new URL('./',self.location.href);
  if(url.origin!==base.origin)return;
  if(event.request.mode==='navigate'&&(url.pathname===base.pathname||url.pathname===new URL('./index.html',base).pathname)){
    event.respondWith(caches.open(CACHE_NAME).then(cache=>cache.match(new URL('./index.html',base).href)).then(cached=>cached||fetch(event.request)));
    return;
  }
  const canonical=FILES.find(file=>new URL(file,base).pathname===url.pathname);
  if(canonical)event.respondWith(caches.open(CACHE_NAME).then(cache=>cache.match(new URL(canonical,base).href)).then(cached=>cached||fetch(event.request)));
});
