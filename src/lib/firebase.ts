// src/lib/firebase.ts
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  "projectId": "keystroke-symphony-z6jrj",
  "appId": "1:316751782475:web:13fbef71d274766aa763ce",
  "storageBucket": "keystroke-symphony-z6jrj.firebasestorage.app",
  "apiKey": "AIzaSyD2ArQFn64gNDQMPcGtYTVQX9g-qurO9y4",
  "authDomain": "keystroke-symphony-z6jrj.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "316751782475"
};


let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    // Enable analytics only on the client side
    getAnalytics(app);
  }
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const functions = getFunctions(app);
const storage = getStorage(app);


// Set persistence on the client side
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence);
}

export { app, auth, db, functions, storage };
