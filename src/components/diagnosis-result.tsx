
'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, ShieldCheck, ListChecks, Volume2, Loader2 } from 'lucide-react';
import type { DiagnosisResultState } from '@/lib/types';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

interface DiagnosisResultProps {
  result: DiagnosisResultState['data'];
}

export function DiagnosisResult({ result }: DiagnosisResultProps) {
  const [isReading, setIsReading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (result?.audioDataUri && audioRef.current) {
      audioRef.current.src = result.audioDataUri;
      audioRef.current.play().catch(e => {
        console.error("Audio playback failed:", e);
        toast({
            variant: "destructive",
            title: "Audio Error",
            description: "Could not play audio. Please try again."
        })
      });
    }
  }, [result?.audioDataUri, toast]);


  if (!result) return null;

  const isUrgent =
    ('urgency' in result && result.urgency?.toLowerCase() === 'urgent') ||
    ('emergencyLevel' in result && result.emergencyLevel?.toLowerCase() === 'urgent');

  const title = result.type === 'symptoms' ? 'Integrated Diagnosis' : 'Initial Image Analysis';
  
  const handleReadAloud = async () => {
    if (!result || isReading) return;

    setIsReading(true);
    try {
        const textToRead = `
            Possible Diagnosis: ${result.diagnosis}.
            Urgency Level: ${'urgency' in result ? result.urgency : result.emergencyLevel}.
            ${'careInstructions' in result && result.careInstructions ? `Care Recommendations: ${result.careInstructions}` : ''}
        `;

        // We will get the audio data from the action now
        // This component no longer calls the TTS flow directly
    } catch (error) {
        console.error('TTS Error:', error);
        toast({
            variant: "destructive",
            title: "Read Aloud Failed",
            description: "Could not generate audio for the diagnosis."
        })
    } finally {
        setIsReading(false);
    }
  };


  return (
    <Card className="w-full">
       <audio ref={audioRef} className="hidden" />
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            {title}
          </CardTitle>
          <CardDescription>
            Based on the information provided. Always consult a certified veterinarian for a definitive diagnosis.
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleReadAloud}
          disabled={isReading || !result.audioDataUri}
          aria-label="Read diagnosis aloud"
        >
          {isReading ? (
             <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
             <Volume2 className="h-5 w-5" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Possible Diagnosis
          </h4>
          <p className="text-lg">{result.diagnosis}</p>
        </div>

        <div>
          <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Urgency Level
          </h4>
          <Badge variant={isUrgent ? 'destructive' : 'secondary'} className="text-base px-3 py-1">
            { 'urgency' in result ? result.urgency : result.emergencyLevel }
          </Badge>
          {isUrgent && (
             <p className="text-sm text-destructive mt-2">
               This condition may be serious. Please contact a veterinarian immediately.
             </p>
          )}
        </div>

        {'careInstructions' in result && result.careInstructions && (
          <div>
            <h4 className="font-semibold text-lg flex items-center gap-2 mb-2">
              <ListChecks className="h-5 w-5 text-primary" />
              Care Recommendations
            </h4>
            <p className="whitespace-pre-wrap">{result.careInstructions}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
