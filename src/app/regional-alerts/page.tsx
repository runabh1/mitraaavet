
'use client';
import React, { useState, useActionState, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Siren, Thermometer, Bug, PawPrint, MessageCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormStatus } from 'react-dom';
import type { GetRegionalAlertsOutput } from '@/ai/flows/get-regional-alerts';
import { getRegionalAlerts } from '@/ai/flows/get-regional-alerts';
import { cn } from '@/lib/utils';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

type RegionalAlertsState = {
  data: GetRegionalAlertsOutput | null;
  error: string | null;
  pending: boolean;
};

const initialState: RegionalAlertsState = {
  data: null,
  error: null,
  pending: false,
};

async function getRegionalAlertsAction(prevState: RegionalAlertsState, formData: FormData): Promise<RegionalAlertsState> {
    const pincode = formData.get('pincode') as string;
    const language = formData.get('language') as string;

    if (!pincode || !/^\d{6}$/.test(pincode)) {
        return { data: null, error: 'Please enter a valid 6-digit pincode.', pending: false };
    }

    try {
        const result = await getRegionalAlerts({ pincode, language });
        return { data: result, error: null, pending: false };
    } catch (e: any) {
        return { data: null, error: e.message || "Failed to fetch regional alerts.", pending: false };
    }
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing Region...</> : 'Get Alerts'}
    </Button>
  );
}

function RiskHeatmap({ data }: { data: GetRegionalAlertsOutput }) {
    const getRiskColor = (level: 'High' | 'Medium' | 'Low') => {
        if (level === 'High') return 'bg-destructive/80 text-destructive-foreground';
        if (level === 'Medium') return 'bg-yellow-500/80 text-secondary-foreground';
        return 'bg-green-500/80 text-primary-foreground';
    };

    const riskLevels = [
        { icon: <PawPrint className="h-8 w-8" />, title: 'Livestock Disease', level: data.livestockDiseaseRisk },
        { icon: <Bug className="h-8 w-8" />, title: 'Crop Pests', level: data.cropPestRisk },
        { icon: <Thermometer className="h-8 w-8" />, title: 'Adverse Weather', level: data.weatherRisk },
    ];

    return (
        <div>
            <h3 className="text-lg font-semibold mb-2">Regional Risk Heatmap</h3>
            <div className="grid grid-cols-3 gap-4">
                {riskLevels.map(risk => (
                    <div key={risk.title} className={cn("p-4 rounded-lg text-center flex flex-col items-center justify-center", getRiskColor(risk.level))}>
                        {risk.icon}
                        <p className="font-bold mt-2">{risk.level}</p>
                        <p className="text-xs">{risk.title}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function ResultSkeleton() {
    return (
         <Card>
            <CardHeader>
                <Skeleton className="h-7 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                     <Skeleton className="h-6 w-1/3 mb-4" />
                     <div className="grid grid-cols-3 gap-4">
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                        <Skeleton className="h-28 w-full" />
                     </div>
                </div>
                 <div>
                     <Skeleton className="h-6 w-1/3 mb-4" />
                     <div className="space-y-4">
                        <Skeleton className="h-20 w-full" />
                        <Skeleton className="h-20 w-full" />
                     </div>
                </div>
            </CardContent>
        </Card>
    );
}


export default function RegionalAlertsPage() {
    const router = useRouter();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [state, formAction] = useActionState(getRegionalAlertsAction, initialState);
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
    
    if (isLoggedOut) { return null; }

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header onLogout={handleLogout} />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <div className="grid gap-8 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center gap-2"><Siren /> Early Warning System</CardTitle>
                            <CardDescription>Enter a pincode to see potential agricultural and livestock risks in that area.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form action={formAction} className="space-y-4">
                                <input type="hidden" name="language" value={language} />
                                <div className="grid gap-2">
                                    <Label htmlFor="pincode">Your Pincode</Label>
                                    <Input id="pincode" name="pincode" placeholder="e.g., 781001" required pattern="\d{6}" />
                                </div>
                                {state.error && !state.pending && (
                                    <Alert variant="destructive">
                                        <AlertTitle>Error</AlertTitle>
                                        <AlertDescription>{state.error}</AlertDescription>
                                    </Alert>
                                )}
                                <SubmitButton />
                            </form>
                        </CardContent>
                    </Card>

                    <div className="space-y-8">
                        {state.pending && <ResultSkeleton />}
                        {state.data && !state.pending && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Alerts for Pincode: {state.data.alerts.length > 0 ? (new URLSearchParams(window.location.search)).get('pincode') || ''}</CardTitle>
                                    <CardDescription>{state.data.summary}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <RiskHeatmap data={state.data} />
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">Specific Alerts</h3>
                                        <div className="space-y-4">
                                            {state.data.alerts.length > 0 ? state.data.alerts.map(alert => (
                                                <Alert key={alert.id} variant={alert.severity === 'High' ? 'destructive' : 'default'}>
                                                    <AlertTriangle className="h-4 w-4" />
                                                    <AlertTitle>{alert.title}</AlertTitle>
                                                    <AlertDescription>{alert.recommendation}</AlertDescription>
                                                </Alert>
                                            )) : (
                                                <div className="text-center text-muted-foreground py-4">
                                                    <MessageCircle className="mx-auto h-8 w-8 mb-2" />
                                                    <p>No major alerts for this region at the moment.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                         {!state.data && !state.pending && (
                             <Card className="flex items-center justify-center h-full">
                                <div className="text-center text-muted-foreground p-8">
                                    <Siren className="mx-auto h-12 w-12 mb-4" />
                                    <h3 className="text-lg font-semibold">Check Regional Risks</h3>
                                    <p>Enter a pincode to see the latest alerts and advisories.</p>
                                </div>
                             </Card>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
