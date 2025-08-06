
'use server';

/**
 * @fileOverview An AI agent that provides weather-based farming advice.
 *
 * - getWeatherAdvice - A function that returns actionable farming advice based on the weather.
 * - GetWeatherAdviceInput - The input type for the getWeatherAdvice function.
 * - GetWeatherAdviceOutput - The return type for the getWeatherAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GetWeatherAdviceInputSchema = z.object({
  location: z.string().describe("The user's location for the weather forecast (e.g., 'Nagaon, Assam')."),
  language: z.string().describe("The language for the response (e.g., 'English', 'Assamese')."),
});
export type GetWeatherAdviceInput = z.infer<typeof GetWeatherAdviceInputSchema>;

const GetWeatherAdviceOutputSchema = z.object({
  forecast: z.string().describe("A brief summary of the weather forecast for the next 2-3 days."),
  advice: z.string().describe("Actionable advice for farmers based on the forecast (e.g., suggesting when to plant, irrigate, or harvest)."),
});
export type GetWeatherAdviceOutput = z.infer<typeof GetWeatherAdviceOutputSchema>;

// Mock weather data - in a real app, this would come from a weather API tool
const mockWeatherData = {
    'Nagaon, Assam': {
        forecast: "Sunny for the next 2 days, with a high of 34°C. Light chance of rain on the third day.",
        advice: "Excellent conditions for drying harvested crops. Good time for planting new seeds that require sun. If you have standing crops, ensure they are well-irrigated before the temperature peaks. Hold off on pesticide spraying as the sun might reduce its effectiveness."
    },
    'Default': {
        forecast: "Partly cloudy with a chance of afternoon showers. Temperatures around 30°C.",
        advice: "Good day for transplanting seedlings. Be prepared to cover young plants if the rain becomes heavy. If you plan to fertilize, doing so before the rain can help it soak into the soil."
    }
};

export async function getWeatherAdvice(input: GetWeatherAdviceInput): Promise<GetWeatherAdviceOutput> {
  return getWeatherAdviceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'getWeatherAdvicePrompt',
  input: {schema: z.object({ weatherData: GetWeatherAdviceOutputSchema, language: z.string() })},
  output: {schema: GetWeatherAdviceOutputSchema},
  prompt: `You are an agricultural advisor. The user's language is {{{language}}}. Based on the following weather data, provide a summary and actionable advice. Translate the response into the user's language.

Weather Data:
- Forecast: {{{weatherData.forecast}}}
- Advice: {{{weatherData.advice}}}
`,
});

const getWeatherAdviceFlow = ai.defineFlow(
  {
    name: 'getWeatherAdviceFlow',
    inputSchema: GetWeatherAdviceInputSchema,
    outputSchema: GetWeatherAdviceOutputSchema,
  },
  async ({ location, language }) => {
    // In a real app, you would use a tool to fetch live weather data here.
    const weatherData = mockWeatherData[location as keyof typeof mockWeatherData] || mockWeatherData['Default'];
    
    // Pass the fetched data to the prompt for formatting and translation
    const {output} = await prompt({ weatherData, language });
    return output!;
  }
);
