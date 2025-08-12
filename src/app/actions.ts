"use server";

import { generatePersonalizedExercises } from "@/ai/flows/personalized-typing-exercises";
import type { PersonalizedExercisesInput, PersonalizedExercisesOutput } from "@/ai/flows/personalized-typing-exercises";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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

type SaveTestResultsInput = {
  userId: string;
  wpm: number;
  accuracy: number;
  errors: Record<string, number>;
  difficulty: string;
};

export async function saveTestResults(input: SaveTestResultsInput) {
  if (!input.userId) {
    throw new Error("User must be logged in to save results.");
  }
  try {
    await addDoc(collection(db, "typing-sessions"), {
      ...input,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error saving test results to Firestore:", error);
    // We don't want to throw an error to the user if this fails,
    // as it's not critical to their experience.
  }
}
