"use server";

import { generatePersonalizedExercises } from "@/ai/flows/personalized-typing-exercises";
import type {
  PersonalizedExercisesInput,
  PersonalizedExercisesOutput,
} from "@/ai/flows/personalized-typing-exercises";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
  updateDoc,
  getCountFromServer,
  setDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import {
  AdminDashboardStats,
  SaveTestResultsInput,
  TestResult,
  UserWithAdminStatus,
} from "@/domain/entities/game";
import { verifyAdmin } from "./user";

// AI-powered exercises
export async function getAIPoweredExercises(
  input: PersonalizedExercisesInput
): Promise<PersonalizedExercisesOutput> {
  try {
    const output = await generatePersonalizedExercises(input);
    return output;
  } catch (error) {
    console.error("Error generating personalized exercises:", error);
    throw new Error("Failed to generate AI exercises. Please try again later.");
  }
}

export async function saveTestResults(input: SaveTestResultsInput) {
  console.log("### saveTestResults", input);

  if (!input.userId) {
    console.log("Attempted to save results without a user ID.");
    return;
  }
  try {
    const docRef = await addDoc(collection(db, "typing-sessions"), {
      ...input,
      timestamp: serverTimestamp(),
    });
    console.log("Test results saved with ID: ", docRef.id);
  } catch (error) {
    console.error("Error saving test results to Firestore:", error);
  }
}

export async function getTestResults(userId: string): Promise<TestResult[]> {
  if (!userId) {
    return [];
  }

  try {
    const q = query(
      collection(db, "typing-sessions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const results: TestResult[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      results.push({
        id: doc.id,
        wpm: data.wpm,
        accuracy: data.accuracy,
        difficulty: data.difficulty,
        timestamp: data.timestamp.toDate(),
      });
    });
    return results;
  } catch (error) {
    console.error("Error fetching test results:", error);
    return [];
  }
}

export async function getUserDashboardStats(
  userId: string
): Promise<AdminDashboardStats> {
  // if (!(await verifyAdmin(userId))) {
  //   throw new Error("Unauthorized");
  // }

  try {
    const sessionsCollection = collection(db, "typing-sessions");
    const snapshot = await getDocs(sessionsCollection);

    let totalWpm = 0;
    let totalAccuracy = 0;
    const testsByDate: Record<string, number> = {};
    const testsByDifficulty: Record<string, number> = {};

    snapshot.forEach((doc) => {
      const data = doc.data();
      totalWpm += data.wpm;
      totalAccuracy += data.accuracy;

      const date = data.timestamp.toDate().toISOString().split("T")[0]; // YYYY-MM-DD
      testsByDate[date] = (testsByDate[date] || 0) + 1;

      const difficulty = data.difficulty || "unknown";
      testsByDifficulty[difficulty] = (testsByDifficulty[difficulty] || 0) + 1;
    });

    const totalTests = snapshot.size;
    const averageWpm = totalTests > 0 ? Math.round(totalWpm / totalTests) : 0;
    const averageAccuracy =
      totalTests > 0 ? Math.round(totalAccuracy / totalTests) : 0;

    return {
      totalTests,
      averageWpm,
      averageAccuracy,
      testsByDate: Object.entries(testsByDate)
        .map(([date, count]) => ({ date, count }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      testsByDifficulty: Object.entries(testsByDifficulty)
        .map(([difficulty, count]) => ({ difficulty, count }))
        .sort((a, b) => b.count - a.count),
    };
  } catch (error) {
    console.error("Error fetching admin dashboard stats:", error);
    throw new Error("Failed to fetch dashboard data.");
  }
}
/* 
export async function getUsersAndAdminStatus(
  userId: string
): Promise<UserWithAdminStatus[]> {
  // if (!(await verifyAdmin(userId))) {
  //   throw new Error("Unauthorized");
  // }

  try {
    const authAdmin = getAdminAuth();
    const userRecords = await authAdmin.listUsers();

    const users = userRecords.users.map((user) => ({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      isAdmin: adminUids.includes(user.uid),
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error("Failed to fetch user data.");
  }
} */

export async function setAdminStatus(
  idToken: string,
  targetUserId: string,
  isAdmin: boolean
) {
  if (!(await verifyAdmin(idToken))) {
    throw new Error("Unauthorized");
  }
  if (idToken === targetUserId) {
    throw new Error("Cannot change your own admin status.");
  }

  try {
    const adminDocRef = doc(db, "app-settings", "admins");

    if (isAdmin) {
      await updateDoc(adminDocRef, {
        uids: arrayUnion(targetUserId),
      });
    } else {
      await updateDoc(adminDocRef, {
        uids: arrayRemove(targetUserId),
      });
    }
  } catch (error) {
    console.error("Error updating admin status:", error);
    throw new Error("Failed to update admin status.");
  }
}
