'use server';

/**
 * @fileOverview Processes animal symptoms provided via voice or text input and integrates them with image analysis for a more accurate disease diagnosis.
 *
 * - processSymptoms - A function that handles the symptom processing and integration.
 * - ProcessSymptomsInput - The input type for the processSymptoms function.
 * - ProcessSymptomsOutput - The return type for the processSymptoms function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProcessSymptomsInputSchema = z.object({
  animalPhotoDataUri: z
    .string()
    .describe(
      "A photo of the animal, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  symptoms: z.string().describe('The symptoms described by the user.'),
  language: z.string().describe('The language of the user input (e.g., "Assamese", "Hindi", "English").'),
});
export type ProcessSymptomsInput = z.infer<typeof ProcessSymptomsInputSchema>;

const ProcessSymptomsOutputSchema = z.object({
  diagnosis: z.string().describe('The integrated disease diagnosis.'),
  urgency: z.string().describe('The urgency level of the diagnosis.'),
  careInstructions: z.string().describe('First-aid or temporary care steps.'),
});
export type ProcessSymptomsOutput = z.infer<typeof ProcessSymptomsOutputSchema>;

export async function processSymptoms(input: ProcessSymptomsInput): Promise<ProcessSymptomsOutput> {
  return processSymptomsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'processSymptomsPrompt',
  input: {schema: ProcessSymptomsInputSchema},
  output: {schema: ProcessSymptomsOutputSchema},
  prompt: `Given the following image of an animal and the described symptoms, provide a disease diagnosis, the urgency level, and care instructions. Respond in the same language as the input.

Language: {{{language}}}
Symptoms: {{{symptoms}}}
Animal Photo: {{media url=animalPhotoDataUri}}

Respond in the following JSON format:
{
  "diagnosis": "disease diagnosis",
  "urgency": "urgency level",
  "careInstructions": "care instructions"
}`,
});

const processSymptomsFlow = ai.defineFlow(
  {
    name: 'processSymptomsFlow',
    inputSchema: ProcessSymptomsInputSchema,
    outputSchema: ProcessSymptomsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
