import type { ProcessSymptomsOutput } from '@/ai/flows/process-symptoms';
import type { AnalyzeAnimalImageOutput } from '@/ai/flows/analyze-animal-image';

export type DiagnosisResultState = {
  data:
    | (ProcessSymptomsOutput & { type: 'symptoms' })
    | (AnalyzeAnimalImageOutput & { type: 'image' })
    | null;
  error: string | null;
  pending: boolean;
};
