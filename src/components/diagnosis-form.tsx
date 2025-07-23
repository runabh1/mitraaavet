
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Upload, Mic, Loader2, Square } from 'lucide-react';
import type { DiagnosisResultState } from '@/lib/types';
import { Alert, AlertDescription } from './ui/alert';
import { useToast } from '@/hooks/use-toast';

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
  const [language, setLanguage] = useState('English');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'English';
    setLanguage(savedLanguage);
  }, []);

  useEffect(() => {
    const languageCode = language === 'Assamese' ? 'as-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = languageCode;

      recognition.onresult = (event) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setSymptoms(prev => prev + finalTranscript + ' ');
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Error',
          description: `An error occurred: ${event.error}. Please try again.`,
        });
        setIsRecording(false);
      };
      
      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    } else {
      console.warn('SpeechRecognition API not supported in this browser.');
    }
    
    return () => {
      recognitionRef.current?.stop();
    }
  }, [toast, language]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };
  
  const toggleRecording = () => {
    if (!recognitionRef.current) {
       toast({
          variant: 'destructive',
          title: 'Voice Input Not Supported',
          description: 'Your browser does not support speech recognition.',
        });
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
       navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
           setSymptoms('');
           recognitionRef.current?.start();
           setIsRecording(true);
       }).catch(err => {
            console.error('Microphone access denied:', err);
            toast({
              variant: 'destructive',
              title: 'Microphone Access Denied',
              description: 'Please enable microphone permissions in your browser settings.',
            });
       })
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
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-1/2 right-2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
                aria-label="Use voice input"
                onClick={toggleRecording}
              >
                {isRecording ? <Square className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />}
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
