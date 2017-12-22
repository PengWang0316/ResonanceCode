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
workboxSW.router.registerRoute(/^https:\/\/use.fontawesome.com\/releases\/v5.0.1\/.*/, thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://fonts.googleapis.com/css?family=Quicksand:300', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://code.jquery.com/jquery-3.2.1.slim.min.js', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.11.0/umd/popper.min.js', thirdPartyLibraryStrategy);
workboxSW.router.registerRoute('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta/js/bootstrap.min.js', thirdPartyLibraryStrategy);
// workboxSW.router.registerRoute(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/4\.7\.0\/fonts\/.*/, thirdPartyLibraryStrategy);

/* 1 day cacheFirst strategy. */
const avatarPhotoStrategy = workboxSW.strategies.staleWhileRevalidate({
  cacheName: 'avatarPhotos',
  cacheableResponse: { statuses: [0, 200] },
});
workboxSW.router.registerRoute(/^https:\/\/graph\.facebook\.com\/.*/, avatarPhotoStrategy);
workboxSW.router.registerRoute(/^https:\/\/.*\.googleusercontent\.com\/.*/, avatarPhotoStrategy);

/* 365 days cacheFirst strategy for Cloudinary images. */
const cloudinaryStrategy = workboxSW.strategies.cacheFirst({
  cacheName: 'cloudinaryImages',
  cacheExpiration: {
    maxEntries: 30, // It depends on the number of average image will be used for each user.
    maxAgeSeconds: 365 * 24 * 60 * 60
  },
  cacheableResponse: { statuses: [0, 200] },
});
workboxSW.router.registerRoute(/^https:\/\/res.cloudinary.com\/kevinwang\/image\/upload\/.*/, cloudinaryStrategy);

/* NetworkFirst strategy for REST API call. */
const apiCallStrategy = workboxSW.strategies.networkFirst();
workboxSW.router.registerRoute(/^https:\/\/kairoscope\.resonance-code\.com:8080\/.*/, apiCallStrategy);
workboxSW.router.registerRoute(/^https:\/\/kairoscope\.resonance-code\.com/, apiCallStrategy);
workboxSW.router.registerRoute(/^http:\/\/kairoscope\.resonance-code\.com/, apiCallStrategy);

/* ******************** Start notification related code ********************** */

/** The method that uses to convert urlBase64 to Uint8Array.
  * The code gets from web-push https://www.npmjs.com/package/web-push
  * @param {string} base64String is a url base 64 string.
  * @return {Uint8Array} Return a Uint8Array object.
*/
const urlBase64ToUint8Array = base64String => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+').replace(/_/g, '/');
  const rawData = self.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  // console.log('uint8array:', outputArray);
  return outputArray;
};


/** The method that start to subscribe a user with PushManager.
  * @param {object} an object that contains user's id and jwt message value.
  * @param {object} port represents the port that will be used sending message back to react code.
  * @return {null} No return.
*/
const subscribeUser = ({ userId, jwtMessage }, port) => {
  // console.log(self);
  // Making sure the browser supports the PushManager.
  if ('PushManager' in self) {
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array('BCAjEL-OP1949tjluWWkRvLQsQ5eI_qkypEAuvixiwFFn1KPnBpT1KNyEopZg-WNANBR8GmM9pxAg2XhBotjtf0')
    };
    self.registration.pushManager.subscribe(subscribeOptions)
      .then(pushSubscription => port.postMessage(JSON.stringify(pushSubscription)));
  }
};

/* The listener that uses to listen the message that the client sends.
Will use this listener to call the function in the service worker file.
The style is evt.data = { methodName: method parameter}
  * TODO It seems like the message will be received twice in Chrome (The first one just has object key and the second one has the full object content.). But FireFox is fine. No sure whether it is a bug in Chrome.
*/
self.addEventListener('message', ({ data, ports }) => {
  const objectKeys = Object.keys(data);
  if (!data[objectKeys[0]]) return; // If the message does not have any body, do not fire the subscriptUser call and return.
  switch (objectKeys[0]) {
    case 'subscribeUser':
      subscribeUser(data[objectKeys[0]], ports[0]);
      break;
    default:
      break;
  }
});

/* notification listener method */
self.addEventListener('push', event => {
  if (event.data) {
    self.registration.showNotification('Resonance Code', {
      body: event.data.text(),
      icon: '/launcher-icon-web.png',
      badge: '/badge-128x128.png',
      // actions: [
      //   {
      //     action: 'view-reading-action',
      //     title: 'View the reading'
      //   }]
    });
  } else {
    console.log('This push event has no data.');
  }
});

/* Notification click listener */
self.addEventListener('notificationclick', event => {
  const clickedNotification = event.notification;
  clickedNotification.close();

  // Do something as the result of the notification click
  const urlToOpen = new URL('https://kairoscope.resonance-code.com/sharedReadings', self.location.origin).href;
  // If has already had a browser window open with the same url, use it instead of open a new one.
  const promiseChain = self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  }).then((windowClients) => {
    let matchingClient = null;

    for (let i = 0; i < windowClients.length; i++) {
      const windowClient = windowClients[i];
      if (windowClient.url === urlToOpen) {
        matchingClient = windowClient;
        break;
      }
    }
    if (matchingClient) return matchingClient.focus();
    return self.clients.openWindow(urlToOpen);
  });
  event.waitUntil(promiseChain);
});
