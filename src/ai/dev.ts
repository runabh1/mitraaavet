
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/process-symptoms.ts';
import '@/ai/flows/analyze-animal-image.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/voice-assistant.ts';
import '@/ai/flows/get-feed-advice.ts';
import '@/ai/flows/process-voice-query.ts';
import '@/ai/flows/diagnose-crop-flow.ts';
import '@/ai/flows/get-weather-advice.ts';
import '@/ai/flows/get-regional-alerts.ts';
