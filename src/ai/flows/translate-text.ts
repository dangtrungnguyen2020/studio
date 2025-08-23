// src/ai/flows/translate-text.ts
'use server';

/**
 * @fileOverview A text translation AI flow.
 *
 * - translateText - A function that handles the text translation process.
 * - TranslateTextInput - The input type for the translateText function.
 * - TranslateTextOutput - The return type for the translateText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TranslateTextInputSchema = z.object({
    text: z.string().describe('The text to translate.'),
    targetLanguage: z.string().describe('The target language code (e.g., "en", "es").'),
});
export type TranslateTextInput = z.infer<typeof TranslateTextInputSchema>;

const TranslateTextOutputSchema = z.object({
    translation: z.string().describe('The translated text.'),
});
export type TranslateTextOutput = z.infer<typeof TranslateTextOutputSchema>;


const translatePrompt = ai.definePrompt({
    name: 'translatePrompt',
    input: { schema: TranslateTextInputSchema },
    output: { schema: TranslateTextOutputSchema },
    prompt: `Translate the following text to {{targetLanguage}}.

    Text: {{{text}}}
    
    Respond with only the translated text in a JSON object matching the output schema.`,
});

const translateTextFlow = ai.defineFlow(
    {
        name: 'translateTextFlow',
        inputSchema: TranslateTextInputSchema,
        outputSchema: TranslateTextOutputSchema,
    },
    async (input) => {
        const { output } = await translatePrompt(input);
        return output!;
    }
);

export async function translateText(input: TranslateTextInput): Promise<TranslateTextOutput> {
    return translateTextFlow(input);
}
