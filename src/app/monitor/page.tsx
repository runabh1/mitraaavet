
'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Trash2, Droplets, Egg, Cross, AlertCircle, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HealthChart } from '@/components/health-chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';

// Mock data
const initialPoultryData = {
  egg_count: [
    { date: '2024-07-01', value: 85 }, { date: '2024-07-02', value: 88 },
    { date: '2024-07-03', value: 90 }, { date: '2024-07-04', value: 82 },
    { date: '2024-07-05', value: 89 }, { date: '2024-07-06', value: 91 },
    { date: '2024-07-07', value: 93 },
  ],
  deaths: [
    { date: '2024-07-01', value: 1 }, { date: '2024-07-02', value: 0 },
    { date: '2024-07-03', value: 0 }, { date: '2024-07-04', value: 2 },
    { date: '2024-07-05', value: 1 }, { date: '2024-07-06', value: 0 },
    { date: '2024-07-07', value: 1 },
  ],
  alerts: [
      { id: 1, severity: 'Medium', message: "Egg count dropped on July 4. Check for heat stress or feed quality."}
  ]
};

const initialFishData = {
  mortality: [
    { date: '2024-07-01', value: 5 }, { date: '2024-07-02', value: 7 },
    { date: '2024-07-03', value: 15 }, { date: '2024-07-04', value: 12 },
    { date: '2024-07-05', value: 4 }, { date: '2024-07-06', value: 3 },
    { date: '2024-07-07', value: 2 },
  ],
  water_quality: [
      { date: '2024-07-01', value: 'Clear' }, { date: '2024-07-02', value: 'Clear' },
      { date: '2024-07-03', value: 'Muddy' }, { date: '2024-07-04', value: 'Smelly' },
      { date: '2024-07-05', value: 'Clear' },
  ],
  alerts: [
      { id: 1, severity: 'High', message: "High mortality and poor water quality detected on July 3-4. Recommend immediate water change and aeration."}
  ]
};

export default function MonitorPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [focusType, setFocusType] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Unified state for mock data
    const [poultryData, setPoultryData] = useState(initialPoultryData);
    const [fishData, setFishData] = useState(initialFishData);

    useEffect(() => {
        const savedFocus = localStorage.getItem('petType');
        setFocusType(savedFocus);
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('petType');
      setIsLoggedOut(true);
      router.push('/login');
    }

    const handleLogData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const today = new Date().toISOString().split('T')[0];
        let updated = false;

        if (focusType === 'Poultry') {
            const eggsLaid = formData.get('eggsLaid') as string;
            const deaths = formData.get('deaths') as string;
            if (eggsLaid) {
                setPoultryData(prev => ({ ...prev, egg_count: [...prev.egg_count, { date: today, value: parseInt(eggsLaid) }] }));
                updated = true;
            }
            if (deaths) {
                setPoultryData(prev => ({ ...prev, deaths: [...prev.deaths, { date: today, value: parseInt(deaths) }] }));
                updated = true;
            }
        } else if (focusType === 'Fish') {
            const fishMortality = formData.get('fishMortality') as string;
            const waterClarity = formData.get('waterClarity') as string;
            if (fishMortality) {
                setFishData(prev => ({ ...prev, mortality: [...prev.mortality, { date: today, value: parseInt(fishMortality) }] }));
                updated = true;
            }
             if (waterClarity) {
                setFishData(prev => ({ ...prev, water_quality: [...prev.water_quality, { date: today, value: waterClarity }] }));
                updated = true;
            }
        }

        if (updated) {
            toast({ title: "Data Logged", description: "Your farm data has been updated." });
        }
        setIsDialogOpen(false);
    }
    
    if (isLoggedOut) {
        return null; // Don't render anything if logging out
    }
    
    if (!focusType) {
        // Render a loading state or nothing while waiting for focusType
        return <div className="flex min-h-screen w-full flex-col bg-background" />;
    }
    
    if (!['Poultry', 'Fish'].includes(focusType)) {
        return (
            <div className="flex min-h-screen w-full flex-col">
                <Header onLogout={handleLogout} />
                <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col items-center justify-center text-center">
                     <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Feature Not Available</CardTitle>
                            <CardDescription>The monitor is only available for Poultry and Fish farms.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p>Your current focus is set to <span className="font-semibold text-primary">{focusType}</span>.</p>
                            <Button onClick={() => router.push('/')} className="mt-4">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </main>
            </div>
        )
    }
    
    const isPoultry = focusType === 'Poultry';
    const data = isPoultry ? poultryData : fishData;

    return (
        <div className="flex min-h-screen w-full flex-col">
            <Header onLogout={handleLogout} />
            <main className="flex-1 container mx-auto p-4 md:p-8">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">{isPoultry ? 'Poultry Farm Monitor' : 'Fish Farm Monitor'}</CardTitle>
                            <CardDescription>Track key metrics for your {focusType.toLowerCase()} farm.</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button> <PlusCircle className="mr-2 h-4 w-4"/> Log Daily Data </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log New {isPoultry ? 'Poultry' : 'Fish'} Data</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleLogData} className="space-y-4">
                                    {isPoultry ? (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="eggsLaid">Eggs Laid Today</Label>
                                                <Input id="eggsLaid" name="eggsLaid" type="number" placeholder="e.g., 95" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="deaths">Number of Deaths</Label>
                                                <Input id="deaths" name="deaths" type="number" placeholder="e.g., 1" />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="fishMortality">Fish Mortality Today</Label>
                                                <Input id="fishMortality" name="fishMortality" type="number" placeholder="e.g., 5" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="waterClarity">Water Clarity</Label>
                                                <Select name="waterClarity">
                                                    <SelectTrigger id="waterClarity">
                                                        <SelectValue placeholder="Select water quality" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Clear">Clear</SelectItem>
                                                        <SelectItem value="Muddy">Muddy</SelectItem>
                                                        <SelectItem value="Smelly">Smelly</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </>
                                    )}
                                    <DialogFooter> <Button type="submit" className="w-full">Save Data</Button> </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {isPoultry ? (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2"><Egg/> Egg Production Trend</h3>
                                    <HealthChart data={poultryData.egg_count.slice(-14)} dataKey="value" name="Eggs Laid" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2"><Cross/> Mortality Trend</h3>
                                    <HealthChart data={poultryData.deaths.slice(-14)} dataKey="value" name="Deaths" />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2"><Cross/> Fish Mortality Trend</h3>
                                    <HealthChart data={fishData.mortality.slice(-14)} dataKey="value" name="Mortality" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold flex items-center gap-2"><Droplets/> Water Quality History</h3>
                                    <div className="flex flex-wrap gap-2">
                                    {fishData.water_quality.slice(-7).map((log, index) => (
                                        <Badge key={index} variant={log.value === 'Clear' ? 'secondary' : 'destructive'}>{log.date}: {log.value}</Badge>
                                    ))}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="space-y-4">
                             <h3 className="text-xl font-semibold flex items-center gap-2"><AlertCircle /> AI-Generated Alerts</h3>
                             <div className="space-y-2">
                             {data.alerts.map(alert => (
                                 <div key={alert.id} className={cn("p-3 rounded-md border flex items-start gap-3", alert.severity === 'High' ? 'bg-destructive/10 border-destructive' : 'bg-yellow-400/10 border-yellow-500')}>
                                     <AlertCircle className={cn("h-5 w-5 mt-0.5", alert.severity === 'High' ? 'text-destructive' : 'text-yellow-600')} />
                                     <p className="text-sm">{alert.message}</p>
                                 </div>
                             ))}
                             </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

    