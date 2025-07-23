'use client';

import React, { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mic, Loader2 } from 'lucide-react';
import type { DiagnosisResultState } from '@/lib/types';
import { Alert, AlertDescription } from './ui/alert';

interface DiagnosisFormProps {
  formAction: (payload: FormData) => void;
  state: DiagnosisResultState;
}

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

export default function DiagnosisForm({ formAction, state }: DiagnosisFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  
  // Cleanup object URL
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="animal-photo" className="text-base">1. Upload Photo</Label>
            <div
              className="relative flex justify-center items-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Input
                id="animal-photo"
                name="animalPhoto"
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
                  alt="Animal preview"
                  fill
                  className="object-contain rounded-lg"
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <Upload className="mx-auto h-10 w-10 mb-2" />
                  <p>Click to upload a photo</p>
                  <p className="text-xs">PNG, JPG, etc.</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms" className="text-base">2. Describe Symptoms (Optional)</Label>
            <div className="relative">
              <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="e.g., My cow is coughing, not eating, and has a fever..."
                rows={4}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                aria-label="Use voice input"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </div>
          </div>
           {state?.error && (
            <Alert variant="destructive">
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </Card>
    </form>
  );
}
