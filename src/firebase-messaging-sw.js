importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

// Tu configuración de Firebase
firebase.initializeApp({
    projectId: "dale-futbol",
    appId: "1:259286345543:web:1e7f1fe628480f6fe14e62",
    databaseURL: "https://dale-futbol-default-rtdb.firebaseio.com",
    storageBucket: "dale-futbol.firebasestorage.app",
    apiKey: "AIzaSyAKPbzFospdPnLWEHmlw4lQg6ZKWghdwEE",
    authDomain: "dale-futbol.firebaseapp.com",
    messagingSenderId: "259286345543",
    measurementId: "G-XVDWBT7J3L" 
});

// Inicializar messaging
const messaging = firebase.messaging();