import fs from "node:fs";
import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { App, getApp, getApps, initializeApp } from "firebase-admin/app";

const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

const serviceAccount = filePath
  ? JSON.parse(fs.readFileSync(filePath, "utf8"))
  : {};

let app: App;

if (!getApps().length) {
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // Add your databaseURL here if needed
    // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  });
} else {
  app = getApp();
}

const auth = admin.auth();
const db = admin.firestore();

// A helper function to verify the user's ID token and get their claims
export async function getUserClaims(idToken: string) {
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    console.error("Error verifying ID token:", error);
    return null;
  }
}

export { auth, db };
