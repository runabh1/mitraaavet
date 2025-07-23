
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { HealthChart } from '@/components/health-chart';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
        const today = new Date().toISOString().split('T')[0];

        if (milkYield) {
            setHealthData(prev => ({
                ...prev,
                milk_yield: [...prev.milk_yield, { date: today, value: parseFloat(milkYield) }]
            }));
        }
        if (weight) {
            setHealthData(prev => ({
                ...prev,
                weight: [...prev.weight, { date: today, value: parseFloat(weight) }]
            }));
        }

        toast({
            title: "Data Logged",
            description: "Your animal's health data has been updated.",
        });
        setIsDialogOpen(false);
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
                                    <Button type="submit" className="w-full">Save Data</Button>
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
                             <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                <li>FMD - 2024</li>
                                <li>Foot rot - 2023</li>
                             </ul>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
