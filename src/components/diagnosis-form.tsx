
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mic, Loader2, Square, CircleCheck } from 'lucide-react';
import type { DiagnosisResultState } from '@/lib/types';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Badge } from './ui/badge';

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
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [language, setLanguage] = useState('English');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'English';
    setLanguage(savedLanguage);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const newAudioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(newAudioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setAudioBlob(null);
    } catch (err) {
      console.error('Microphone access denied:', err);
      toast({
        variant: 'destructive',
        title: 'Permission Denied',
        description: 'Please allow microphone access.',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }
  
  const handleFormAction = (formData: FormData) => {
      if (audioBlob) {
          formData.append('symptomsAudio', audioBlob, 'symptoms.webm');
      }
      formAction(formData);
  }

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
    <form action={handleFormAction}>
      <input type="hidden" name="language" value={language} />
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
            <div className="flex gap-2 items-start">
               <Textarea
                id="symptoms"
                name="symptoms"
                placeholder="Type symptoms here, or use the microphone to record your voice."
                rows={4}
                className="flex-1"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
               <div className="flex flex-col gap-2 items-center">
                    <Button
                        type="button"
                        variant={isRecording ? "destructive" : "outline"}
                        size="icon"
                        className="h-10 w-10 shrink-0"
                        aria-label="Use voice input"
                        onClick={toggleRecording}
                    >
                        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                    </Button>
                    {audioBlob && !isRecording && (
                       <Badge variant="secondary" className="gap-1 text-green-600">
                           <CircleCheck className="h-3 w-3" />
                           Saved
                       </Badge>
                    )}
               </div>
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
