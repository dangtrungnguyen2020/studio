import { HttpsError, onCall } from "firebase-functions/v2/https";
import admin from "firebase-admin";

import { MakeAdminRequest, MakeAdminResponse } from "./entity";

// Initialize the Firebase Admin SDK
admin.initializeApp();

// This is a callable function. It can be invoked from your client-side code.
export const makeAdmin = onCall<MakeAdminRequest, Promise<MakeAdminResponse>>(
  async (request): Promise<MakeAdminResponse> => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "Only authenticated users can call this function."
      );
    }
    if (request.auth.token.admin !== true) {
      throw new HttpsError(
        "permission-denied",
        "Only admins can assign admin role."
      );
    }

    const email = request.data.email;
    if (!email) {
      throw new HttpsError("invalid-argument", "Email required");
    }

    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });

    // This object is what you'll get as `result.data` on the client
    return { message: `Success! ${email} is now an admin.` };
  }
);

export const removeAdminRole = onCall<
  MakeAdminRequest,
  Promise<MakeAdminResponse>
>(async (req): Promise<MakeAdminResponse> => {
  if (!req.auth) {
    throw new HttpsError(
      "unauthenticated",
      "Only authenticated users can call this function."
    );
  }

  if (req.auth.token.admin !== true) {
    throw new HttpsError(
      "permission-denied",
      "Only admins can revoke admin role."
    );
  }

  if (!req.data.email) {
    throw new HttpsError("invalid-argument", "Email is required");
  }

  const user = await admin.auth().getUserByEmail(req.data.email);

  // Option A: explicitly set admin to false
  await admin.auth().setCustomUserClaims(user.uid, { admin: false });

  // Option B: fully clear claims
  // await admin.auth().setCustomUserClaims(user.uid, {});

  return { message: `Success! ${req.data.email} is no longer an admin.` };
});
