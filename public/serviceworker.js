const PREFIX_APP = "Budgetary-";
const APP_VERSION = "version_01";
const CACHE_NAME = "standard-cache-v35";

const FILES_TO_CACHE = [
    "./index.html", 
    "./index.js", 
    "./serviceworker.js",
    "./manifest.webmanifest",
     "./styles.css",
    "./dbindexed.js",
    "./images/background.jpg",
    "./icons/icon-192x192.png",
    ".icons/icon-512x512.png"

];

//Installation of cache

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!" + CACHE_NAME);
            return cache.addAll(FILES_TO_CACHE);
        })
    )
})
self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(keyList){
            let cacheStore = keyList.filter(function(key){
                return key.indexOf(PREFIX_APP);
            })
            cacheStore.push(CACHE_NAME);
            return Promise.all(keyList.map(function(key, i){
                if(cacheStore.indexOf(key)=== -1){
                    console.log('Cache is being deleted:' +keyList[i]);
                }
            }))
        })
    )
})
self.addEventListener('fetch', function(event){
    console.log('fetch request:' + event.request.url)
    event.respondWith(
        caches.match(event.request).then(function(request){
            if (request){
                console.log('Cache response is:' + event.request.url)
                return request
            } else{
                
            }
        })
    )
})