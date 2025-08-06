
'use client';
import React, { useState, useActionState, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CloudSun, Lightbulb, MapPin, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import { getWeatherAdviceAction } from '@/lib/actions';
import type { WeatherAdviceState } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

const initialState: WeatherAdviceState = {
  data: null,
  error: null,
  pending: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Getting Advisory...
        </>
      ) : (
        'Get Weather Advice'
      )}
    </Button>
  );
}


export default function WeatherAdvisoryPage() {
    const router = useRouter();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [state, formAction] = useActionState(getWeatherAdviceAction, initialState);
    const [language, setLanguage] = useState('English');

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'English';
        setLanguage(savedLanguage);
    }, []);

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
                            <CardTitle className="text-2xl flex items-center gap-2">Weather Advisory</CardTitle>
                            <CardDescription>Enter your location to get AI-driven farming advice based on the weather forecast.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <form action={formAction} className="space-y-4">
                            <input type="hidden" name="language" value={language} />
                             <div className="grid gap-2">
                                <Label htmlFor="location">Your Location</Label>
                                <Input id="location" name="location" placeholder="e.g., Nagaon, Assam" required />
                             </div>
                             {state.error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{state.error}</AlertDescription>
                                </Alert>
                             )}
                             <SubmitButton />
                           </form>
                        </CardContent>
                    </Card>
                    <div className="space-y-8">
                        {state.pending && <AdvisorySkeleton />}
                        {state.data && !state.pending && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Your Local Weather Advisory</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                     <div className="flex items-start gap-4">
                                        <CloudSun className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h4 className="font-semibold">Forecast</h4>
                                            <p className="text-muted-foreground">{state.data.forecast}</p>
                                        </div>
                                     </div>
                                     <div className="flex items-start gap-4">
                                        <Lightbulb className="h-6 w-6 text-primary mt-1" />
                                        <div>
                                            <h4 className="font-semibold">AI-Powered Advice</h4>
                                            <p className="text-muted-foreground">{state.data.advice}</p>
                                        </div>
                                     </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                 </div>
            </main>
        </div>
    )
}

function AdvisorySkeleton() {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                    </div>
                </div>
                 <div className="flex items-start gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2 flex-1">
                        <Skeleton className="h-5 w-1/4" />
                        <Skeleton className="h-4 w-full" />
                         <Skeleton className="h-4 w-5/6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
