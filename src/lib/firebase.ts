// src/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "keystroke-symphony-z6jrj",
  "appId": "1:316751782475:web:13fbef71d274766aa763ce",
  "storageBucket": "keystroke-symphony-z6jrj.firebasestorage.app",
  "apiKey": "AIzaSyD2ArQFn64gNDQMPcGtYTVQX9g-qurO9y4",
  "authDomain": "keystroke-symphony-z6jrj.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "316751782475"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
