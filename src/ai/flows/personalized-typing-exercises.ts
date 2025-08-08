// src/ai/flows/personalized-typing-exercises.ts
'use server';

/**
 * @fileOverview Generates personalized typing exercises based on user typing patterns.
 *
 * - generatePersonalizedExercises - A function that generates personalized typing exercises.
 * - PersonalizedExercisesInput - The input type for the generatePersonalizedExercises function.
 * - PersonalizedExercisesOutput - The return type for the generatePersonalizedExercises function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedExercisesInputSchema = z.object({
  typingPatterns: z
    .string()
    .describe(
      'A string representing the user typing patterns, including common errors and slow keys.'
    ),
  difficultyLevel: z
    .enum(['easy', 'medium', 'hard'])
    .describe('The difficulty level of the typing exercises.'),
});

export type PersonalizedExercisesInput = z.infer<typeof PersonalizedExercisesInputSchema>;

const PersonalizedExercisesOutputSchema = z.object({
  exercises: z
    .array(z.string())
    .describe('An array of personalized typing exercises.'),
  explanation: z
    .string()
    .describe('An explanation of why these exercises were chosen.'),
});

export type PersonalizedExercisesOutput = z.infer<typeof PersonalizedExercisesOutputSchema>;

export async function generatePersonalizedExercises(
  input: PersonalizedExercisesInput
): Promise<PersonalizedExercisesOutput> {
  return personalizedExercisesFlow(input);
}

const personalizedExercisesPrompt = ai.definePrompt({
  name: 'personalizedExercisesPrompt',
  input: {schema: PersonalizedExercisesInputSchema},
  output: {schema: PersonalizedExercisesOutputSchema},
  prompt: `You are a typing coach who specializes in creating personalized exercises to improve typing skills.

  Based on the user's typing patterns and difficulty level, generate a list of exercises that target their weak areas.

  Typing Patterns: {{{typingPatterns}}}
  Difficulty Level: {{{difficultyLevel}}}

  Instructions: Generate 5 exercises, each between 10 and 20 words long. Include an explanation of why these exercises were chosen to help the user understand the purpose of the exercises.
  `,config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const personalizedExercisesFlow = ai.defineFlow(
  {
    name: 'personalizedExercisesFlow',
    inputSchema: PersonalizedExercisesInputSchema,
    outputSchema: PersonalizedExercisesOutputSchema,
  },
  async input => {
    const {output} = await personalizedExercisesPrompt(input);
    return output!;
  }
);
