import { config } from 'dotenv';
config();

import '@/ai/flows/process-symptoms.ts';
import '@/ai/flows/analyze-animal-image.ts';
import '@/ai/flows/text-to-speech.ts';
import '@/ai/flows/voice-assistant.ts';
