/** Requesting permission from a user.
  * The API recently changed from taking a callback to returning a Promise. The  problem with this, is that we can't tell what version of the API is implemented by the current browser, so you have to implement both and handle both.
  * @return {null} No return.
*/
const askPermission = () =>
  new Promise(((resolve, reject) => {
    const permissionResult = Notification.requestPermission(result => resolve(result));
    if (permissionResult) permissionResult.then(resolve, reject);
  })).then((permissionResult) => {
    if (permissionResult !== 'granted') throw new Error('We weren\'t granted permission.');
  });

/** The method that start to subscript a user to push notification.
  * @return {Promise} Return a promise when the user granted the permission.
*/
const subscriptNotification = () => new Promise((resolve, reject) => {
  // Making sure the browser supports the PushManager.
  if ('PushManager' in window) askPermission().then(_ => {
    // Sending a message to call the serviceWorker to subscribe a user with PushManager.
    navigator.serviceWorker.controller.postMessage({ subscribeUser: '' });
    resolve(true);
  }).catch(err => reject(err));
  else throw new Error('The browser does not support Push Notification Feature.');
});
export default subscriptNotification;
