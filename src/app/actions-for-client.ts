
"use server";
// This file contains actions that are safe to be called from the client,
// for example, to fetch non-sensitive data for UI logic.
import { db } from "@/lib/firebase-admin";
import { doc } from "firebase/firestore";

export async function getAdminUids(): Promise<string[]> {
    const adminDoc = await doc(db, 'app-settings', 'admins').get();
    if (adminDoc.exists) {
        return adminDoc.data()?.uids || [];
    }
    return [];
}
