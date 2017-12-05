importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */

const workboxSW = new self.WorkboxSW({
  skipWaiting: true,
  clientsClaim: true
});
// The [] will be replaced:
workboxSW.precache([]);

// Custom code...
/* 365 days cacheFirst strategy. */
const thirdPartyLibraryStrategy = workboxSW.strategies.cacheFirst({
  cacheName: 'thirdPartyLibraries',
  cacheExpiration: {
    maxAgeSeconds: 365 * 24 * 60 * 60
  },
  cacheableResponse: { statuses: [0, 200] },
});
/* Setting up the router for some third party libraries. */
workboxSW.router.registerRoute('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/css/bootstrap.min.css', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://fonts.googleapis.com/css?family=Quicksand:300', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://code.jquery.com/jquery-3.2.1.slim.min.js', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/4\.7\.0\/fonts\/.*/, thirdPartyLibraryStrategy);

/* 1 day cacheFirst strategy. */
const avatarPhotoStrategy = workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'avatarPhotos',
  cacheableResponse: { statuses: [0, 200] },
});
workboxSW.router.registerRoute(/^https:\/\/graph\.facebook\.com\/.*/, avatarPhotoStrategy);
workboxSW.router.registerRoute(/^https:\/\/.*\.ggoogleusercontent\.com\/.*/, avatarPhotoStrategy);

/* NetworkFirst strategy for REST API call. */
const apiCallStrategy = workboxSW.strategies.networkFirst();
workboxSW.router.registerRoute(/^https:\/\/kairoscope\.resonance-code\.com:8080\/.*/, apiCallStrategy);
workboxSW.router.registerRoute(/^https:\/\/kairoscope\.resonance-code\.com/, apiCallStrategy);
workboxSW.router.registerRoute(/^http:\/\/kairoscope\.resonance-code\.com/, apiCallStrategy);
