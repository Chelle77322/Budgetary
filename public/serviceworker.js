//const PREFIX_APP = 'Budgetary';
//const APP_VERSION = 'version_01';
const CACHE_NAME = "standard-cache-v19";
const DATA_CACHE_NAME = "cached-data-v19";
const FILES_TO_CACHE = [
    
    "./favicon.ico",
    "./index.html", 
    "./index.js", 
    "./dbindexed.js",
    "./manifest.webmanifest",
     "./styles.css",
    "./images/background.jpg",
    "./icons/icons-192x192.png",
    "./icons/icons-512x512.png"
]

//Installation of cache
self.addEventListener("install", function(event){
event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache){
        console.log('Cache is being installed:' + CACHE_NAME)
        return cache.addAll(FILES_TO_CACHE);
    })
)
})
//Commenting out as may not be needed
self.addEventListener('activate', function(event){
    //Getting all static cache files
    event.waitUntil(
       caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
    console.log(caches.open(CACHE_NAME));
    //Tells the browser to activate this service worker after installation
    self.skipWaiting();
  });
    
//Section activates 
self.addEventListener("activate", function (event) {
event.waitUntil(
    caches.keys().then(function(keyList){
        let cacheStore = keyList.filter(function(key){
            return key.indexOf(PREFIX_APP);
        })
        cacheStore.push(CACHE_NAME);
        return Promise.all(keyList.map(function(key,i){
            if(cacheStore.indexOf(key) === -1){
                console.log('Cache is being deleted'+ keyList[i]);
            }
        }))
    })
)
})
self.addEventListener('fetch', function(event){
    console.log('fetch request:'+ event.request.url)
    event.respondWith(
        caches.match(event.request).then(function(request){
            if(request){
                console.log('Returning cached files:' + event.request.url)
                return request
            //If not found in cache the information should be found and returned online instead of offline
            } else {
                console.log("File is being returned online, fetching it now:" + event.request.url)
                return fetch(event.request)
            }
        })
    )
})
//Might be useful
self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
event.respondWith(
   caches.open(DATA_CACHE_NAME).then(cache => {
        return fetch(event.request).then(response => {
// If the response was good, clone it and store it in the cache.
         if (response.status === 200)
          { cache.put(event.request.url,response.clone());
        } 
        return response;
}).catch(error => {
// Network request failed, try to get it from the cache.
 return cache.match(event.request);
});
}).catch(error => console.log(error))
 );
return;
    }
    event.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(event.request).then(response => {
                return response || fetch(event.request);
            });
        })
    );
});