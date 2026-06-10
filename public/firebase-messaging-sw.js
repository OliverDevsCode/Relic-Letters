// public/firebase-messaging-sw.js

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyD64e2XOBz_U2eJwdnwjmAOEGNyjU0OEgE",
  authDomain: "relic-letters.firebaseapp.com",
  projectId: "relic-letters",
  messagingSenderId: "99159457479",
  appId: "1:99159457479:web:fefe9b04cc20f8e9f0c8e2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    // icon: '/firebase-logo.png'  // Optional: ADD Relic leter icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
