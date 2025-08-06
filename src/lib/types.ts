
import type { ProcessSymptomsOutput } from '@/ai/flows/process-symptoms';
import type { AnalyzeAnimalImageOutput } from '@/ai/flows/analyze-animal-image';
import type { GetFeedAdviceOutput } from '@/ai/flows/get-feed-advice';
import type { DiagnoseCropOutput } from '@/ai/flows/diagnose-crop-flow';
import type { GetWeatherAdviceOutput } from '@/ai/flows/get-weather-advice';

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

export type FeedAdviceState = {
  data: GetFeedAdviceOutput | null;
  error: string | null;
  pending: boolean;
};

export type CropDiagnosisState = {
    data: DiagnoseCropOutput | null;
    error: string | null;
    pending: boolean;
}

export type WeatherAdviceState = {
    data: GetWeatherAdviceOutput | null;
    error: string | null;
    pending: boolean;
}

export type Language = 'English' | 'Hindi' | 'Assamese';
