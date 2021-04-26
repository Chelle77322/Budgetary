const CACHE_NAME = "standard-cache-v35";
const DATA_CACHE_NAME = "cached-data-v35";
const FILES_TO_CACHE = [
    "/", 
    "/index.html", 
    "/index.js", 
    "/serviceworker.js",
    "/manifest.webmanifest",
     "/styles.css",
    "/models/transaction.js",
    "/routes/api.js", 
    "/server.js", 
    "/images/background.jpg",
    "/icons/icon-192x192.png",
    "icons/icon-512x512.png"

];

//Installation of cache

self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(DATA_CACHE_NAME).then(cache => {
            console.log("Your files were pre-cached successfully!");
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    //Getting all static cache files
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
    );
//Tells the browser to activate this service worker after installation
    self.skipWaiting();
});

self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );

    self.clients.claim();
});

self.addEventListener("fetch", function (event) {
    if (event.request.url.includes("/api/")) {
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        // If the response was good, clone it and store it in the cache.
                        if (response.status === 200) {
                            cache.put(event.request.url, response.clone());
                        }
                        return response;
                    })
                    .catch(error => {
                        // Network request failed, try to get it from the cache.
                        return cache.match(event.request);
                    });
            }).catch(error => {
                console.log(error)
            })
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