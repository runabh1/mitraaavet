
'use server';
/**
 * @fileOverview An AI agent that analyzes regional data to detect and summarize emerging risks.
 *
 * - getRegionalAlerts - A function that returns alerts and risk summaries for a given pincode.
 * - GetRegionalAlertsInput - The input type for the getRegionalAlerts function.
 * - GetRegionalAlertsOutput - The return type for the getRegionalAlerts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetRegionalAlertsInputSchema = z.object({
  pincode: z.string().length(6, { message: 'Pincode must be 6 digits.'}).describe("The 6-digit pincode for the user's region."),
  language: z.string().describe("The language for the response (e.g., 'English', 'Hindi', 'Assamese')."),
});
export type GetRegionalAlertsInput = z.infer<typeof GetRegionalAlertsInputSchema>;

const AlertSchema = z.object({
    id: z.string(),
    severity: z.enum(['High', 'Medium', 'Low']).describe('The severity of the alert.'),
    title: z.string().describe('A short, clear title for the alert.'),
    recommendation: z.string().describe('A brief, actionable recommendation for the user.'),
});

const GetRegionalAlertsOutputSchema = z.object({
    summary: z.string().describe('A one-sentence summary of the overall situation in the region.'),
    livestockDiseaseRisk: z.enum(['High', 'Medium', 'Low']).describe('The risk level for livestock diseases.'),
    cropPestRisk: z.enum(['High', 'Medium', 'Low']).describe('The risk level for crop pests.'),
    weatherRisk: z.enum(['High', 'Medium', 'Low']).describe('The risk level for adverse weather conditions.'),
    alerts: z.array(AlertSchema).describe('A list of specific alerts for the user.'),
});
export type GetRegionalAlertsOutput = z.infer<typeof GetRegionalAlertsOutputSchema>;


// Mock data simulating Firestore aggregation. In a real app, this would be a real database query.
const mockRegionalData: Record<string, any> = {
    '781001': { // Guwahati
        'FMD': 8, // Foot and Mouth Disease reports
        'Rice Blast': 2,
        'Drought Stress': 3,
        'Heat Wave': true,
    },
    '784125': { // Tezpur
        'FMD': 2,
        'Rice Blast': 12, // High number of reports
        'Bacterial Blight': 8,
        'Drought Stress': 9,
    },
    '785001': { // Jorhat
        'Avian Influenza': 6,
        'Goat Pox': 7,
        'Fall Armyworm': 15,
        'Normal Weather': true,
    },
    'default': {
        'FMD': 1,
        'Rice Blast': 2,
        'Normal Weather': true,
    }
};

const prompt = ai.definePrompt({
  name: 'regionalAlertsPrompt',
  input: {schema: z.object({ data: z.any(), language: z.string() })},
  output: {schema: GetRegionalAlertsOutputSchema},
  prompt: `You are an agro-meteorological expert analyzing regional farm data. Based on the provided data summary for a specific pincode, generate a regional risk assessment. The response must be in the requested language.

Language for response: {{{language}}}

Data for Pincode:
\`\`\`json
{{{json data}}}
\`\`\`

Analysis Task:
1.  **Set Risk Levels**: Based on the count of reports, determine the risk level for 'livestockDiseaseRisk', 'cropPestRisk', and 'weatherRisk'. Use simple thresholds: >10 reports is High, >5 is Medium, otherwise Low. For weather, if a negative event like 'Drought' or 'Heat Wave' is true, set risk to High.
2.  **Create Specific Alerts**: For each issue with a count > 5 (or any adverse weather event), create a specific alert object. The title should be the name of the issue (e.g., "Foot and Mouth Disease Outbreak"). The recommendation should be a short, practical step a farmer can take (e.g., "Vaccinate your cattle and isolate any sick animals immediately.").
3.  **Generate a Summary**: Write a single, concise sentence summarizing the main risks for the region.
4.  Translate the entire output (summary, titles, recommendations) into the specified language.
`,
});

export async function getRegionalAlerts(input: GetRegionalAlertsInput): Promise<GetRegionalAlertsOutput> {
  return getRegionalAlertsFlow(input);
}

const getRegionalAlertsFlow = ai.defineFlow(
  {
    name: 'getRegionalAlertsFlow',
    inputSchema: GetRegionalAlertsInputSchema,
    outputSchema: GetRegionalAlertsOutputSchema,
  },
  async ({ pincode, language }) => {
    // 1. Simulate fetching and aggregating data for the pincode.
    const data = mockRegionalData[pincode] || mockRegionalData['default'];

    // 2. Call the LLM to process the data and generate insights.
    const { output } = await prompt({ data, language });
    if (!output) {
      throw new Error('Failed to generate regional alerts from AI.');
    }
    
    return output;
  }
);
