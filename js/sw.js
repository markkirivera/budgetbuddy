const staticCacheName = 'site-static-v1';
const assets = [
    '/',
    '/index.html',
    '/css/index.css',
    '/css/jquery.mCustomScrollbar.min.css',
    '/css/loading-bar.css',
    '/css/materialize.min.css',
    '/css/slick.css',
    '/js/app.js',
    '/js/functions.js',
    '/js/script.js',
    '/js/swipe.js',
    '/js/loading-bar.js',
    '/js/slick.min.js',
    '/js/materialize.min.js',
    '/js/moment.min.js',
    '/js/chart.bundle.min.js',
    '/js/jquery-3.5.1.min.js',
    '/js/jquery.mCustomScrollbar.concat.min.js',
    '/img/markki.png',
    '/img/piggy.png',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://fonts.googleapis.com/css?family=Open+Sans:100,300,400,600'
];
// install event
self.addEventListener('install', evt => {
    evt.waitUntil(
        caches.open(staticCacheName).then((cache) => {
            console.log('caching shell assets');
            cache.addAll(assets);
        })
    );
});
// activate event
self.addEventListener('activate', evt => {
    evt.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== staticCacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});
// fetch event
self.addEventListener('fetch', evt => {
    evt.respondWith(
        caches.match(evt.request).then(cacheRes => {
            return cacheRes || fetch(evt.request);
        })
    );
});