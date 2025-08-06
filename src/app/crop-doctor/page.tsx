
'use client';

import React, { useActionState, useState, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Leaf, AlertCircle, TestTube, TreeDeciduous } from 'lucide-react';
import type { CropDiagnosisState } from '@/lib/types';
import { getCropDiagnosisAction } from '@/lib/actions';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const initialState: CropDiagnosisState = {
  data: null,
  error: null,
  pending: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending} size="lg">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Analyzing...
        </>
      ) : (
        'Get Diagnosis'
      )}
    </Button>
  );
}

function CropDiagnosisForm({ formAction }: { formAction: (payload: FormData) => void }) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'English';
        setLanguage(savedLanguage);
    }, []);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
    };

     useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <form action={formAction}>
             <input type="hidden" name="language" value={language} />
             <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="crop-photo" className="text-base">1. Upload Crop Photo</Label>
                    <div
                        className="relative flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <Input
                            id="crop-photo"
                            name="cropPhoto"
                            type="file"
                            className="sr-only"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleImageChange}
                            required
                        />
                        {previewUrl ? (
                            <Image
                            src={previewUrl}
                            alt="Crop preview"
                            fill
                            className="object-contain rounded-lg"
                            />
                        ) : (
                            <div className="text-center text-muted-foreground">
                            <Upload className="mx-auto h-10 w-10 mb-2" />
                            <p>Click to upload a photo of the affected crop part</p>
                            <p className="text-xs">e.g., a leaf or stem</p>
                            </div>
                        )}
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="description" className="text-base">2. Describe Problem (Optional)</Label>
                    <Textarea
                        id="description"
                        name="description"
                        placeholder="e.g., 'Yellow spots with brown rings on the lower leaves.'"
                        rows={3}
                    />
                </div>
                 <SubmitButton />
             </div>
        </form>
    )
}

function DiagnosisResult({ result }: { result: NonNullable<CropDiagnosisState['data']> }) {
  return (
    <Card className="w-full">
      <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Leaf />
            Crop Diagnosis Result
          </CardTitle>
          <CardDescription>
            This is an AI-generated analysis. Always confirm with an agricultural expert.
          </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <TestTube className="h-5 w-5 text-primary" />
            Possible Disease
          </h4>
          <p className="text-lg">{result.disease}</p>
        </div>

        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Likely Cause
          </h4>
          <p className="text-muted-foreground">{result.cause}</p>
        </div>

         <div>
            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <TreeDeciduous className="h-5 w-5 text-primary" />
              Treatment & Prevention
            </h4>
            <p className="whitespace-pre-wrap text-muted-foreground">{result.treatment}</p>
          </div>
      </CardContent>
    </Card>
  );
}

function ResultSkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                 <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-6 w-1/2" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-3/4" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </CardContent>
        </Card>
    )
}

export default function CropDoctorPage() {
  const [state, formAction] = useActionState(getCropDiagnosisAction, initialState);
  const router = useRouter();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('petType');
    setIsLoggedOut(true);
    router.push('/login');
  }

  if (isLoggedOut) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <div className="grid gap-8 lg:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl font-bold text-primary mb-2 font-headline">AI Crop Doctor</CardTitle>
                    <CardDescription>Upload a photo of a diseased crop to get an AI-powered diagnosis and treatment advice.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CropDiagnosisForm formAction={formAction} />
                     {state.error && !state.pending && (
                       <div className="mt-4 rounded-lg border bg-card text-card-foreground shadow-sm" data-v0-t="card">
                        <div className="flex flex-col space-y-1.5 p-6">
                          <h3 className="text-2xl font-semibold leading-none tracking-tight text-destructive">Error</h3>
                        </div>
                        <div className="p-6 pt-0">
                          <p>{state.error}</p>
                        </div>
                      </div>
                    )}
                </CardContent>
            </Card>

            <div className="space-y-8">
                {state.pending && <ResultSkeleton />}
                {state.data && !state.pending && (
                  <DiagnosisResult result={state.data} />
                )}
            </div>
        </div>
      </main>
    </div>
  );
}
