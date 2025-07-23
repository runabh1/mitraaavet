'use server';

/**
 * @fileOverview An AI agent that provides feed advice for animals.
 *
 * - getFeedAdvice - A function that returns a personalized feed plan.
 * - GetFeedAdviceInput - The input type for the getFeedAdvice function.
 * - GetFeedAdviceOutput - The return type for the getFeedAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetFeedAdviceInputSchema = z.object({
  age: z.string().describe("The age of the animal (e.g., '6 months', '2 years')."),
  species: z.string().describe("The species of the animal (e.g., 'Goat', 'Cow', 'Chicken')."),
  location: z.string().describe("The user's location, to infer local weather conditions (e.g., 'Assam, India')."),
});
export type GetFeedAdviceInput = z.infer<typeof GetFeedAdviceInputSchema>;

const GetFeedAdviceOutputSchema = z.object({
  morningFeed: z.string().describe("The recommended feed for the morning."),
  eveningFeed: z.string().describe("The recommended feed for the evening."),
  notes: z.string().describe("Any additional notes or recommendations, like supplements or weather-based adjustments."),
});
export type GetFeedAdviceOutput = z.infer<typeof GetFeedAdviceOutputSchema>;

export async function getFeedAdvice(input: GetFeedAdviceInput): Promise<GetFeedAdviceOutput> {
  return getFeedAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getFeedAdvicePrompt',
  input: {schema: GetFeedAdviceInputSchema},
  output: {schema: GetFeedAdviceOutputSchema},
  prompt: `You are a veterinary nutritionist advising a farmer in a rural area. Generate a simple, practical, and personalized daily feeding plan for their animal.

Animal Details:
- Species: {{{species}}}
- Age: {{{age}}}
- Location (for weather context): {{{location}}}

Based on these details, calculate a custom feed plan. Adjust the plan for likely weather conditions in the given location. Provide specific quantities where possible. Be concise and clear.
`,
});

const getFeedAdviceFlow = ai.defineFlow(
  {
    name: 'getFeedAdviceFlow',
    inputSchema: GetFeedAdviceInputSchema,
    outputSchema: GetFeedAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
