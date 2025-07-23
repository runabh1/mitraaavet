'use client';

import React from 'react';
import { useFormState } from 'react-dom';
import Header from '@/components/header';
import DiagnosisForm from '@/components/diagnosis-form';
import { DiagnosisResult } from '@/components/diagnosis-result';
import { VetLocator } from '@/components/vet-locator';
import { getDiagnosisAction } from '@/lib/actions';
import type { DiagnosisResultState } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: DiagnosisResultState = {
  data: null,
  error: null,
  pending: false,
};

export default function Home() {
  const [state, formAction] = useFormState(getDiagnosisAction, initialState);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-headline">
              AI Veterinary Assistant
            </h1>
            <p className="text-muted-foreground mb-6">
              Upload a photo of your animal and describe its symptoms to get an
              AI-powered analysis.
            </p>
            <DiagnosisForm formAction={formAction} state={state} />
          </div>
          <div className="space-y-8">
            {state.pending && (
              <div className="space-y-8">
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}
            {state.error && !state.pending && (
               <div className="rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="text-2xl font-semibold leading-none tracking-tight text-destructive">Error</h3>
                </div>
                <div className="p-6 pt-0">
                  <p>{state.error}</p>
                </div>
              </div>
            )}
            {state.data && !state.pending && (
              <>
                <DiagnosisResult result={state.data} />
                <VetLocator />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function CardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6 space-y-4">
      <Skeleton className="h-8 w-1/2" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );
}
