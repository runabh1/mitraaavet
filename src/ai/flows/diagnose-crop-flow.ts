
'use server';
/**
 * @fileOverview An AI agent for diagnosing crop diseases.
 *
 * - diagnoseCrop - A function that handles the crop diagnosis process.
 * - DiagnoseCropInput - The input type for the diagnoseCrop function.
 * - DiagnoseCropOutput - The return type for the diagnoseCrop function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnoseCropInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a diseased crop part (leaf, stem), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().optional().describe('The user\'s description of the crop problem.'),
  language: z.string().describe("The language for the response (e.g., 'English', 'Hindi', 'Assamese')."),
});
export type DiagnoseCropInput = z.infer<typeof DiagnoseCropInputSchema>;

const DiagnoseCropOutputSchema = z.object({
  disease: z.string().describe('The name of the identified crop disease.'),
  cause: z.string().describe('The likely cause of the disease (e.g., fungal, bacterial, pest).'),
  treatment: z.string().describe('Recommended treatment and prevention steps.'),
});
export type DiagnoseCropOutput = z.infer<typeof DiagnoseCropOutputSchema>;

export async function diagnoseCrop(input: DiagnoseCropInput): Promise<DiagnoseCropOutput> {
  return diagnoseCropFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnoseCropPrompt',
  input: {schema: DiagnoseCropInputSchema},
  output: {schema: DiagnoseCropOutputSchema},
  prompt: `You are an expert agricultural scientist specializing in crop diseases. Analyze the user's photo of a plant and their description to diagnose the issue. Respond in the requested language.

Language: {{{language}}}
Description: {{{description}}}
Crop Photo: {{media url=photoDataUri}}

Provide a clear diagnosis, the likely cause, and actionable advice for treatment and prevention.
`,
});

const diagnoseCropFlow = ai.defineFlow(
  {
    name: 'diagnoseCropFlow',
    inputSchema: DiagnoseCropInputSchema,
    outputSchema: DiagnoseCropOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
