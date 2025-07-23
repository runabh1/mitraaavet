'use server';

import { z } from 'zod';
import { analyzeAnimalImage } from '@/ai/flows/analyze-animal-image';
import { processSymptoms } from '@/ai/flows/process-symptoms';
import type { DiagnosisResultState } from './types';

const formSchema = z.object({
  symptoms: z.string().optional(),
  animalPhoto: z
    .instanceof(File, { message: 'Image is required.' })
    .refine((file) => file.size > 0, 'Image is required.')
    .refine(
      (file) => file.type.startsWith('image/'),
      'Only image files are allowed.'
    )
    .refine((file) => file.size < 4 * 1024 * 1024, 'Image must be less than 4MB.'),
});

async function fileToDataUri(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

export async function getDiagnosisAction(
  prevState: DiagnosisResultState,
  formData: FormData
): Promise<DiagnosisResultState> {
  const validatedFields = formSchema.safeParse({
    symptoms: formData.get('symptoms'),
    animalPhoto: formData.get('animalPhoto'),
  });

  if (!validatedFields.success) {
    return {
      data: null,
      error: validatedFields.error.flatten().fieldErrors.animalPhoto?.[0] || 'Invalid input.',
      pending: false,
    };
  }

  const { animalPhoto, symptoms } = validatedFields.data;

  try {
    const animalPhotoDataUri = await fileToDataUri(animalPhoto);

    if (symptoms && symptoms.trim().length > 0) {
      // Both image and symptoms are provided
      const result = await processSymptoms({ animalPhotoDataUri, symptoms });
      return { data: { ...result, type: 'symptoms' }, error: null, pending: false };
    } else {
      // Only image is provided
      const result = await analyzeAnimalImage({ animalPhotoDataUri });
      return { data: { ...result, type: 'image' }, error: null, pending: false };
    }
  } catch (e: any) {
    console.error(e);
    return {
      data: null,
      error: e.message || 'An unexpected error occurred. Please try again.',
      pending: false,
    };
  }
}
