
'use server';

/**
 * @fileOverview Processes a voice query, transcribes it, gets an answer, and converts the answer back to speech.
 *
 * - processVoiceQuery - A function that handles the end-to-end voice interaction.
 * - ProcessVoiceQueryInput - The input type for the processVoiceQuery function.
 * - ProcessVoiceQueryOutput - The return type for the processVoiceQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { textToSpeech } from './text-to-speech';

const ProcessVoiceQueryInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "The user's voice query, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  language: z.string().describe('The language of the user input (e.g., "Assamese", "Hindi", "English").'),
});
export type ProcessVoiceQueryInput = z.infer<typeof ProcessVoiceQueryInputSchema>;

const ProcessVoiceQueryOutputSchema = z.object({
  question: z.string().describe('The transcribed text of the user\'s question.'),
  answer: z.string().describe('The text response to the user\'s question.'),
  audioDataUri: z.string().describe('The audio response as a data URI.'),
});
export type ProcessVoiceQueryOutput = z.infer<typeof ProcessVoiceQueryOutputSchema>;

export async function processVoiceQuery(input: ProcessVoiceQueryInput): Promise<ProcessVoiceQueryOutput> {
  return processVoiceQueryFlow(input);
}

const sttPrompt = ai.definePrompt({
    name: 'sttPrompt',
    input: { schema: z.object({ audioDataUri: z.string(), language: z.string() }) },
    prompt: `Transcribe the following audio. The speaker is talking in {{language}}.
Audio: {{media url=audioDataUri}}`
});

const answerPrompt = ai.definePrompt({
  name: 'voiceAnswerPrompt',
  input: { schema: z.object({ question: z.string(), language: z.string() }) },
  output: { schema: z.object({ answer: z.string() }) },
  prompt: `You are a helpful veterinary assistant. Answer the user's question about animal care in a concise and easy-to-understand way. The user is likely a rural farmer. Respond in the same language as the question.

Question: {{{question}}}
Language: {{{language}}}`,
});

const processVoiceQueryFlow = ai.defineFlow(
  {
    name: 'processVoiceQueryFlow',
    inputSchema: ProcessVoiceQueryInputSchema,
    outputSchema: ProcessVoiceQueryOutputSchema,
  },
  async (input) => {
    // 1. Transcribe audio to text
    const sttResponse = await sttPrompt(input);
    const question = sttResponse.text;

    if (!question) {
        throw new Error('Failed to transcribe audio.');
    }

    // 2. Get a text answer based on the transcribed question
    const { output: answerOutput } = await answerPrompt({ question, language: input.language });
    if (!answerOutput) {
      throw new Error('Failed to get a response from the AI.');
    }
    const { answer } = answerOutput;

    // 3. Convert the text answer to speech
    const { media: audioDataUri } = await textToSpeech(answer);
    
    return {
      question,
      answer,
      audioDataUri,
    };
  }
);
