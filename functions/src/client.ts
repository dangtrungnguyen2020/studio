// client-side code
import fs from "node:fs";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { MakeAdminRequest, MakeAdminResponse } from "./entity";
import { initializeApp } from "@firebase/app";
import admin from "firebase-admin";
import { cert } from "firebase-admin/app";

const firebaseConfig = {
  projectId: "keystroke-symphony-z6jrj",
  appId: "1:316751782475:web:13fbef71d274766aa763ce",
  storageBucket: "keystroke-symphony-z6jrj.firebasestorage.app",
  apiKey: "AIzaSyD2ArQFn64gNDQMPcGtYTVQX9g-qurO9y4",
  authDomain: "keystroke-symphony-z6jrj.firebaseapp.com",
  measurementId: "",
  messagingSenderId: "316751782475",
};

const filePath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  "../credential/keystroke-symphony-z6jrj-firebase-adminsdk-fbsvc-22ee04d16a.json";
const serviceAccount = filePath
  ? JSON.parse(fs.readFileSync(filePath, "utf8"))
  : {};

admin.initializeApp({
  credential: cert(serviceAccount),
});

const app = initializeApp(firebaseConfig);
getAuth(app);
const functions = getFunctions(app);

// Pass the types to httpsCallable
const makeAdmin = httpsCallable<MakeAdminRequest, MakeAdminResponse>(
  functions,
  "makeAdmin"
);

// Pass the types to httpsCallable
const removeAdmin = httpsCallable<MakeAdminRequest, MakeAdminResponse>(
  functions,
  "makeAdmin"
);

const args = process.argv.slice(2);

if (args.length < 2) {
  console.error("Usage: ts-node client.ts <command> <email>");
  console.error("Commands: makeAdmin, removeAdmin");
  process.exit(1);
}

const command = args[0];
const email = args[1];

(async () => {
  try {
    switch (command) {
      case "makeAdmin":
        // Call the function
        makeAdmin({ email })
          .then((result) => {
            console.log(result.data.message);
          })
          .catch((error) => {
            console.error(
              "Error calling the function makeAdmin:",
              error.code,
              error.message
            );
          });

        break;
      case "removeAdmin":
        // Call the function
        removeAdmin({ email })
          .then((result) => {
            console.log(result.data.message);
          })
          .catch((error) => {
            console.error(
              "Error calling the function removeAdmin:",
              error.code,
              error.message
            );
          });
        break;
      default:
        console.error(`❌ Unknown command: ${command}`);
        console.error("Available commands: makeAdmin, removeAdmin");
        process.exit(1);
    }
  } catch (err) {
    console.error("❌ Unexpected Error calling function: " + command, err);
  }
})();
