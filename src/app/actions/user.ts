"use server";

import { revalidatePath } from "next/cache";
import { db, auth, getUserClaims } from "@/lib/firebase-admin";
import { DecodedIdToken, UserRecord } from "firebase-admin/auth";

// Helper functions for admin verification
// async function getAdminUids(): Promise<string[]> {
//   const adminDoc = await getDoc(doc(db, "app-settings", "admins"));
//   if (adminDoc.exists()) {
//     return adminDoc.data()?.uids || [];
//   }
//   return [];
// }

export async function verifyAdmin(
  idToken: string
): Promise<DecodedIdToken | null> {
  const claims = await getUserClaims(idToken);
  if (!claims || claims.role !== "admin") {
    throw new Error("Permission Denied: Only admins can view the user list.");
  }
  return claims;
}

/**
 * Retrieves a list of all users from Firebase Authentication.
 * This is a privileged operation and is restricted to administrators.
 */
export async function listAllUsers(idToken: string) {
  try {
    await verifyAdmin(idToken);
    const listUsersResult = await auth.listUsers();
    const users = listUsersResult.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      role: (user.customClaims?.role as string) || "viewer",
    }));
    return { users };
  } catch (error) {
    console.error("Error listing users:", error);
    return { error: "An error occurred while fetching users." };
  }
}

/**
 * Updates a user's custom claims (role) in Firebase Authentication.
 * This is a critical security action and is restricted to administrators.
 */
export async function updateUserRole(formData: FormData, idToken: string) {
  const uid = formData.get("uid") as string;
  const newRole = formData.get("role") as string;

  if (!uid || !newRole) {
    return { error: "User ID and new role are required." };
  }

  try {
    await verifyAdmin(idToken);
    await auth.setCustomUserClaims(uid, { role: newRole });
    revalidatePath("/admin/users");
    return { success: "User role updated successfully!" };
  } catch (error) {
    console.error("Error updating user role:", error);
    return { error: "An error occurred while updating the user role." };
  }
}

/**
 * Deletes a user from Firebase Authentication.
 * This is a highly sensitive action and is restricted to administrators.
 */
export async function deleteUser(uid: string, idToken: string) {
  try {
    await verifyAdmin(idToken);
    await auth.deleteUser(uid);
    revalidatePath("/admin/users");
    return { success: "User deleted successfully!" };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { error: "An error occurred while deleting the user." };
  }
}
