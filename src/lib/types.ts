import type { ProcessSymptomsOutput } from '@/ai/flows/process-symptoms';
import type { AnalyzeAnimalImageOutput } from '@/ai/flows/analyze-animal-image';

type BaseResult = {
  audioDataUri: string | null;
}

export type DiagnosisResultState = {
  data:
    | (ProcessSymptomsOutput & { type: 'symptoms' } & BaseResult)
    | (AnalyzeAnimalImageOutput & { type: 'image' } & BaseResult)
    | null;
  error: string | null;
  pending: boolean;
};
