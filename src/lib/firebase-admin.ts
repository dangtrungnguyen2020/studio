import fs from "node:fs";
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { App } from "firebase-admin/app";

const filePath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

const serviceAccount = filePath
  ? JSON.parse(fs.readFileSync(filePath, "utf8"))
  : {};

const app: App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // Add your databaseURL here if needed
  // databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});

const db = getFirestore(app);

export { admin, db };
