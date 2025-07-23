
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HealthChart } from '@/components/health-chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

// Mock data based on your Firestore schema
const initialHealthData = {
  milk_yield: [
    { date: '2024-07-01', value: 6.5 },
    { date: '2024-07-02', value: 6.8 },
    { date: '2024-07-03', value: 7.0 },
    { date: '2024-07-04', value: 6.9 },
    { date: '2024-07-05', value: 7.2 },
    { date: '2024-07-06', value: 7.1 },
    { date: '2024-07-07', value: 7.3 },
  ],
  weight: [
    { date: '2024-05-01', value: 220 },
    { date: '2024-06-01', value: 230 },
    { date: '2024-07-01', value: 240 },
  ],
  disease_history: ["FMD - 2024", "Foot rot - 2023"],
};

export default function HealthTrackerPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [healthData, setHealthData] = useState(initialHealthData);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleLogout = () => {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('petType');
      setIsLoggedOut(true);
      router.push('/login');
    }

    const handleLogData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const milkYield = formData.get('milkYield') as string;
        const weight = formData.get('weight') as string;
        const newDisease = formData.get('disease') as string;
        const today = new Date().toISOString().split('T')[0];

        let updated = false;

        if (milkYield) {
            setHealthData(prev => ({
                ...prev,
                milk_yield: [...prev.milk_yield, { date: today, value: parseFloat(milkYield) }]
            }));
            updated = true;
        }
        if (weight) {
            setHealthData(prev => ({
                ...prev,
                weight: [...prev.weight, { date: today, value: parseFloat(weight) }]
            }));
            updated = true;
        }
        if (newDisease) {
            setHealthData(prev => ({
                ...prev,
                disease_history: [...prev.disease_history, newDisease]
            }));
            updated = true;
        }

        if (updated) {
            toast({
                title: "Data Logged",
                description: "Your animal's health data has been updated.",
            });
        }
        setIsDialogOpen(false);
    }
    
    const removeDisease = (indexToRemove: number) => {
        setHealthData(prev => ({
            ...prev,
            disease_history: prev.disease_history.filter((_, index) => index !== indexToRemove)
        }));
         toast({
            title: "Entry Removed",
            description: "The disease history entry has been removed.",
        });
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
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Health Tracker</CardTitle>
                            <CardDescription>Track and visualize health metrics for your animals.</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Log Data
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log New Health Data</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleLogData} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="milkYield">Today's Milk Yield (in Liters)</Label>
                                        <Input id="milkYield" name="milkYield" type="number" step="0.1" placeholder="e.g., 7.5" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="weight">Today's Weight (in kg)</Label>
                                        <Input id="weight" name="weight" type="number" step="0.1" placeholder="e.g., 245.5"/>
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="disease">Add Disease/Treatment Record</Label>
                                        <Input id="disease" name="disease" type="text" placeholder="e.g., Vaccinated for Anthrax"/>
                                    </div>
                                    <DialogFooter>
                                     <Button type="submit" className="w-full">Save Data</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Milk Yield Trend (Last 7 Days)</h3>
                            <HealthChart data={healthData.milk_yield.slice(-7)} dataKey="value" name="Milk Yield (L)" />
                        </div>
                         <div className="space-y-4">
                            <h3 className="text-xl font-semibold">Weight Growth</h3>
                            <HealthChart data={healthData.weight} dataKey="value" name="Weight (kg)" />
                        </div>
                         <div className="space-y-4">
                             <h4 className="font-semibold">Disease & Treatment History</h4>
                            {healthData.disease_history.length > 0 ? (
                                <ul className="space-y-2">
                                    {healthData.disease_history.map((record, index) => (
                                        <li key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                            <span className="text-muted-foreground">{record}</span>
                                            <Button variant="ghost" size="icon" onClick={() => removeDisease(index)}>
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground text-center py-4">No disease history recorded yet.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
