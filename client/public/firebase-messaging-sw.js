// Import and configure Firebase
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

// Initialize Firebase
firebase.initializeApp({
  projectId: "f1project-736d3",
  messagingSenderId: "110595743295575269585",
  apiKey: "AIzaSyBXF5HHj6SB_YYJkGXjyaB3nEVpGHw6Yl8", // You'll need to provide this from your Firebase Console
  authDomain: "f1project-736d3.firebaseapp.com",
  appId: "1:110595743295575269585:web:YOUR_APP_ID" // You'll need to provide this from your Firebase Console
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
}); 