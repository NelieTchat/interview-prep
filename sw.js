const CACHE="interview-prep-v11";
const FILES=["./","index.html","manifest.json","favicon.png","apple-touch-icon.png","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const isPage=e.request.mode==="navigate"||e.request.url.endsWith(".html");
  if(isPage){
    e.respondWith(fetch(e.request).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res;})
      .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(h=>h||caches.match("index.html"))));
    return;
  }
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(hit=>hit||fetch(e.request).then(res=>{
    const c=res.clone();caches.open(CACHE).then(x=>x.put(e.request,c));return res;}).catch(()=>caches.match("index.html"))));
});
