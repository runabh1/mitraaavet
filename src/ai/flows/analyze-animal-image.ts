'use server';

/**
 * @fileOverview An AI agent that analyzes an animal image and provides a potential disease diagnosis and emergency level.
 *
 * - analyzeAnimalImage - A function that handles the animal image analysis process.
 * - AnalyzeAnimalImageInput - The input type for the analyzeAnimalImage function.
 * - AnalyzeAnimalImageOutput - The return type for the analyzeAnimalImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeAnimalImageInputSchema = z.object({
  animalPhotoDataUri: z
    .string()
    .describe(
      "A photo of an animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeAnimalImageInput = z.infer<typeof AnalyzeAnimalImageInputSchema>;

const AnalyzeAnimalImageOutputSchema = z.object({
  diagnosis: z.string().describe('The potential disease diagnosis based on the image.'),
  emergencyLevel: z.string().describe('The emergency level of the situation (e.g., Urgent, Moderate, Low).'),
});
export type AnalyzeAnimalImageOutput = z.infer<typeof AnalyzeAnimalImageOutputSchema>;

export async function analyzeAnimalImage(input: AnalyzeAnimalImageInput): Promise<AnalyzeAnimalImageOutput> {
  return analyzeAnimalImageFlow(input);
}

const analyzeAnimalImagePrompt = ai.definePrompt({
  name: 'analyzeAnimalImagePrompt',
  input: {schema: AnalyzeAnimalImageInputSchema},
  output: {schema: AnalyzeAnimalImageOutputSchema},
  prompt: `You are a veterinary AI assistant. Analyze the provided image of the animal and provide a potential disease diagnosis and emergency level.

Animal Photo: {{media url=animalPhotoDataUri}}

Respond in the following JSON format:
{
  "diagnosis": "potential disease diagnosis",
  "emergencyLevel": "Urgent | Moderate | Low"
}
`,
});

const analyzeAnimalImageFlow = ai.defineFlow(
  {
    name: 'analyzeAnimalImageFlow',
    inputSchema: AnalyzeAnimalImageInputSchema,
    outputSchema: AnalyzeAnimalImageOutputSchema,
  },
  async input => {
    const {output} = await analyzeAnimalImagePrompt(input);
    return output!;
  }
);
