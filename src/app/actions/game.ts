"use server";

import { generatePersonalizedExercises } from "@/ai/flows/personalized-typing-exercises";
import type {
  PersonalizedExercisesInput,
  PersonalizedExercisesOutput,
} from "@/ai/flows/personalized-typing-exercises";
import { auth, db } from "@/lib/firebase-admin";
import {
  AdminDashboardStats,
  SaveTestResultsInput,
  TestResult,
  UserWithAdminStatus,
} from "@/domain/entities/game";
import { verifyAdmin } from "./user";
import { FieldValue } from "firebase-admin/firestore";

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

export async function saveTestResults(data: SaveTestResultsInput) {
  console.log("### saveTestResults", data.userId, data);
  try {
    // Use a subcollection to store user-specific sessions
    const sessionsCollectionRef = db.collection("typing-sessions");
    await sessionsCollectionRef.add({
      ...data,
      timestamp: FieldValue.serverTimestamp(),
    });

    return { success: true, message: "Typing session saved successfully!" };
  } catch (error) {
    console.error("Error creating typing session:", error);
    return { success: false, message: "Failed to save session." };
  }
}

export async function getTestResults(userId: string): Promise<TestResult[]> {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Use the Admin SDK's chained method calls to reference the collection and apply the filter
    const sessionsCollectionRef = db.collection("typing-sessions");
    const sessionsQuery = sessionsCollectionRef
      .where("timestamp", ">=", thirtyDaysAgo)
      .where("userId", "==", userId);
    const querySnapshot = await sessionsQuery.get();
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
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const sessionsCollectionRef = db
      .collection("typing-sessions")
      .doc(userId)
      .collection("sessions");
    const sessionsQuery = sessionsCollectionRef.where(
      "date",
      ">=",
      thirtyDaysAgo
    );
    const snapshot = await sessionsQuery.get();

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
