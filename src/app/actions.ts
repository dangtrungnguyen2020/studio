"use server";

import { generatePersonalizedExercises } from "@/ai/flows/personalized-typing-exercises";
import type { PersonalizedExercisesInput, PersonalizedExercisesOutput } from "@/ai/flows/personalized-typing-exercises";

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
