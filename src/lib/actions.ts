'use server';

import { z } from 'zod';
import { analyzeAnimalImage } from '@/ai/flows/analyze-animal-image';
import { processSymptoms } from '@/ai/flows/process-symptoms';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { getFeedAdvice } from '@/ai/flows/get-feed-advice';
import type { DiagnosisResultState, FeedAdviceState } from './types';

const diagnosisFormSchema = z.object({
  symptoms: z.string().optional(),
  language: z.string().optional(),
  animalPhoto: z
    .instanceof(File, { message: 'Image is required.' })
    .refine((file) => file.size > 0, 'Image is required.')
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed.'
    )
    .refine((file) => file.size < 4 * 1024 * 1024, 'Image must be less than 4MB.'),
});

const feedAdviceFormSchema = z.object({
    species: z.string().min(1, 'Species is required.'),
    age: z.string().min(1, 'Age is required.'),
    location: z.string().min(1, 'Location is required.'),
});

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

async function getAudioForDiagnosis(diagnosisResult: any) {
    const textToRead = `
        Possible Diagnosis: ${diagnosisResult.diagnosis}.
        Urgency Level: ${'urgency' in diagnosisResult ? diagnosisResult.urgency : diagnosisResult.emergencyLevel}.
        ${'careInstructions' in diagnosisResult && diagnosisResult.careInstructions ? `Care Recommendations: ${diagnosisResult.careInstructions}` : ''}
    `;
    try {
        const audioResult = await textToSpeech(textToRead.trim());
        return audioResult.media;
    } catch (e) {
        console.error("TTS generation failed:", e);
        return null;
    }
}


export async function getDiagnosisAction(
  prevState: DiagnosisResultState,
  formData: FormData
): Promise<DiagnosisResultState> {
  const validatedFields = diagnosisFormSchema.safeParse({
    symptoms: formData.get('symptoms'),
    language: formData.get('language'),
    animalPhoto: formData.get('animalPhoto'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.animalPhoto?.[0] || 'Invalid input.',
      pending: false,
    };
  }

  const { animalPhoto, symptoms, language } = validatedFields.data;

  try {
    const animalPhotoDataUri = await fileToDataUri(animalPhoto);

    let result;
    let type: 'symptoms' | 'image';

    if (symptoms && symptoms.trim().length > 0) {
      result = await processSymptoms({ animalPhotoDataUri, symptoms, language: language || 'English' });
      type = 'symptoms';
    } else {
      result = await analyzeAnimalImage({ animalPhotoDataUri });
      type = 'image';
    }

    const audioDataUri = await getAudioForDiagnosis(result);

    return { data: { ...result, type, audioDataUri }, error: null, pending: false };

  } catch (e: any) {
    console.error(e);
    return {
      data: null,
      error: e.message || 'An unexpected error occurred. Please try again.',
      pending: false,
    };
  }
}

export async function getFeedAdviceAction(
  prevState: FeedAdviceState,
  formData: FormData
): Promise<FeedAdviceState> {
    const validatedFields = feedAdviceFormSchema.safeParse({
        species: formData.get('species'),
        age: formData.get('age'),
        location: formData.get('location'),
    });

    if (!validatedFields.success) {
        const fieldErrors = validatedFields.error.flatten().fieldErrors;
        const errorMessage = Object.values(fieldErrors).flat()[0] || 'Invalid input.';
        return {
            data: null,
            error: errorMessage,
            pending: false,
        };
    }
    
    const { species, age, location } = validatedFields.data;

    try {
        const result = await getFeedAdvice({ species, age, location });
        return { data: result, error: null, pending: false };
    } catch (e: any) {
        console.error(e);
        return {
            data: null,
            error: e.message || 'An unexpected error occurred. Please try again.',
            pending: false,
        };
    }
}
