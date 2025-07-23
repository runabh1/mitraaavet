'use server';

/**
 * @fileOverview A voice assistant that answers questions about animal care.
 *
 * - voiceAssistant - A function that handles the voice assistant logic.
 * - VoiceAssistantInput - The input type for the voiceAssistant function.
 * - VoiceAssistantOutput - The return type for the voiceAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { textToSpeech } from './text-to-speech';

const VoiceAssistantInputSchema = z.object({
  question: z.string().describe('The user\'s question in text format.'),
  language: z.string().describe('The language of the question (e.g., "Hindi", "Assamese", "English").'),
});
export type VoiceAssistantInput = z.infer<typeof VoiceAssistantInputSchema>;

const VoiceAssistantOutputSchema = z.object({
  answer: z.string().describe('The text response to the user\'s question.'),
  audioDataUri: z.string().describe('The audio response as a data URI.'),
});
export type VoiceAssistantOutput = z.infer<typeof VoiceAssistantOutputSchema>;

export async function voiceAssistant(input: VoiceAssistantInput): Promise<VoiceAssistantOutput> {
  return voiceAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'voiceAssistantPrompt',
  input: { schema: VoiceAssistantInputSchema },
  output: { schema: z.object({ answer: z.string() }) },
  prompt: `You are a helpful veterinary assistant. Answer the user's question about animal care in a concise and easy-to-understand way. The user is likely a rural farmer. Respond in the same language as the question.

Question: {{{question}}}
Language: {{{language}}}`,
});

const voiceAssistantFlow = ai.defineFlow(
  {
    name: 'voiceAssistantFlow',
    inputSchema: VoiceAssistantInputSchema,
    outputSchema: VoiceAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI.');
    }

    const { media: audioDataUri } = await textToSpeech(output.answer);
    
    return {
      answer: output.answer,
      audioDataUri,
    };
  }
);
