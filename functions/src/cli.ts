#!/usr/bin/env ts-node

import { Command } from "commander";
import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const program = new Command();

// 🔑 Load service account
const serviceAccountPath = path.resolve(
  "../../credential/keystroke-symphony-z6jrj-firebase-adminsdk-fbsvc-22ee04d16a.json"
);
if (!fs.existsSync(serviceAccountPath)) {
  console.error("❌ serviceAccountKey.json not found at project root");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(require(serviceAccountPath)),
});

const auth = admin.auth();

program
  .name("firebase-admin-cli")
  .description("CLI tool to manage Firebase admin roles")
  .version("1.0.0");

program
  .command("checkRole")
  .argument("<email>", "Email of the user")
  .action(async (email: string) => {
    try {
      const user = await auth.getUserByEmail(email);
      console.log("Custom claims:", user.customClaims);
      if (user.customClaims?.admin) {
        console.log(`✅ ${email} is an admin`);
      } else {
        console.log(`❌ ${email} is NOT an admin`);
      }
    } catch (err) {
      console.error("❌ Error checking role:", err);
    }
  });

program
  .command("makeAdmin")
  .argument("<email>", "Email of the user to promote")
  .action(async (email: string) => {
    try {
      const user = await auth.getUserByEmail(email);
      await auth.setCustomUserClaims(user.uid, {
        ...(user.customClaims || {}),
        admin: true,
      });
      console.log(`✅ ${email} is now an admin`);
    } catch (err) {
      console.error("❌ Error making admin:", err);
    }
  });

program
  .command("removeAdmin")
  .argument("<email>", "Email of the user to demote")
  .action(async (email: string) => {
    try {
      const user = await auth.getUserByEmail(email);
      const claims = { ...(user.customClaims || {}) };
      delete claims.admin;
      await auth.setCustomUserClaims(user.uid, claims);
      console.log(`✅ ${email} is no longer an admin`);
    } catch (err) {
      console.error("❌ Error removing admin:", err);
    }
  });

program.parse(process.argv);

// firebase-admin-cli checkRole user@example.com
// firebase-admin-cli makeAdmin user@example.com
// firebase-admin-cli removeAdmin user@example.com
