
'use client';
import React, { useState, useEffect } from 'react';
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

// Mock data
const initialAnimalData = {
  milk_yield: [
    { date: '2024-07-01', value: 6.5 }, { date: '2024-07-02', value: 6.8 },
    { date: '2024-07-03', value: 7.0 }, { date: '2024-07-04', value: 6.9 },
    { date: '2024-07-05', value: 7.2 }, { date: '2024-07-06', value: 7.1 },
    { date: '2024-07-07', value: 7.3 },
  ],
  weight: [
    { date: '2024-05-01', value: 220 }, { date: '2024-06-01', value: 230 },
    { date: '2024-07-01', value: 240 },
  ],
  disease_history: ["FMD - 2024", "Foot rot - 2023"],
};
const initialCropData = {
  yield: [
      { date: '2024-05-15', value: 1.2 }, { date: '2024-06-15', value: 1.5 },
      { date: '2024-07-15', value: 1.8 },
  ],
  growth_stage: [
      { date: '2024-05-01', value: 1 }, { date: '2024-06-01', value: 2 },
      { date: '2024-07-01', value: 3 },
  ],
  pest_incidents: ["Aphid Infestation - July 2024", "Rust Fungus - June 2024"],
};


export default function HealthTrackerPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [focusType, setFocusType] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    // Unified state
    const [animalData, setAnimalData] = useState(initialAnimalData);
    const [cropData, setCropData] = useState(initialCropData);

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

        if (focusType !== 'Farming') {
            const milkYield = formData.get('milkYield') as string;
            const weight = formData.get('weight') as string;
            const newDisease = formData.get('disease') as string;
            if (milkYield) {
                setAnimalData(prev => ({ ...prev, milk_yield: [...prev.milk_yield, { date: today, value: parseFloat(milkYield) }] }));
                updated = true;
            }
            if (weight) {
                setAnimalData(prev => ({ ...prev, weight: [...prev.weight, { date: today, value: parseFloat(weight) }] }));
                updated = true;
            }
            if (newDisease) {
                setAnimalData(prev => ({ ...prev, disease_history: [...prev.disease_history, newDisease] }));
                updated = true;
            }
        } else {
            const cropYield = formData.get('cropYield') as string;
            const growthStage = formData.get('growthStage') as string;
            const newPest = formData.get('pest') as string;
            if (cropYield) {
                setCropData(prev => ({ ...prev, yield: [...prev.yield, { date: today, value: parseFloat(cropYield) }] }));
                updated = true;
            }
            if (growthStage) {
                setCropData(prev => ({ ...prev, growth_stage: [...prev.growth_stage, { date: today, value: Number(growthStage) }] }));
                updated = true;
            }
            if (newPest) {
                setCropData(prev => ({...prev, pest_incidents: [...prev.pest_incidents, newPest] }));
                updated = true;
            }
        }

        if (updated) {
            toast({ title: "Data Logged", description: "Your data has been updated." });
        }
        setIsDialogOpen(false);
    }
    
    const removeItem = (indexToRemove: number, type: 'disease' | 'pest') => {
       if (type === 'disease') {
           setAnimalData(prev => ({ ...prev, disease_history: prev.disease_history.filter((_, index) => index !== indexToRemove) }));
       } else {
           setCropData(prev => ({ ...prev, pest_incidents: prev.pest_incidents.filter((_, index) => index !== indexToRemove) }));
       }
        toast({ title: "Entry Removed", description: "The history entry has been removed." });
    }

    if (isLoggedOut || !focusType) {
        return null;
    }
    
    const isFarming = focusType === 'Farming';

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
                            <CardTitle className="text-2xl">{isFarming ? 'Crop Performance Tracker' : 'Animal Health Tracker'}</CardTitle>
                            <CardDescription>Track and visualize key metrics.</CardDescription>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button> <PlusCircle className="mr-2 h-4 w-4"/> Log Data </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Log New Data</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleLogData} className="space-y-4">
                                    {isFarming ? (
                                        <>
                                            <div className="grid gap-2">
                                                <Label htmlFor="cropYield">Today's Yield (in Tons/acre)</Label>
                                                <Input id="cropYield" name="cropYield" type="number" step="0.1" placeholder="e.g., 2.5" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="growthStage">Growth Stage (1-5)</Label>
                                                <Input id="growthStage" name="growthStage" type="number" step="1" min="1" max="5" placeholder="e.g., 3 (Flowering)" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="pest">Add Pest/Disease Incident</Label>
                                                <Input id="pest" name="pest" type="text" placeholder="e.g., Spotted Aphids"/>
                                            </div>
                                        </>
                                    ) : (
                                        <>
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
                                        </>
                                    )}
                                    <DialogFooter> <Button type="submit" className="w-full">Save Data</Button> </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        {isFarming ? (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Crop Yield Trend</h3>
                                    <HealthChart data={cropData.yield} dataKey="value" name="Yield (Tons/acre)" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Pest & Disease History</h3>
                                    {cropData.pest_incidents.length > 0 ? (
                                        <ul className="space-y-2">
                                            {cropData.pest_incidents.map((record, index) => (
                                                <li key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                                    <span>{record}</span>
                                                    <Button variant="ghost" size="icon" onClick={() => removeItem(index, 'pest')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : ( <p className="text-sm text-muted-foreground text-center py-4">No pest incidents recorded.</p>)}
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Milk Yield Trend (Last 7 Days)</h3>
                                    <HealthChart data={animalData.milk_yield.slice(-7)} dataKey="value" name="Milk Yield (L)" />
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-xl font-semibold">Weight Growth</h3>
                                    <HealthChart data={animalData.weight} dataKey="value" name="Weight (kg)" />
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-semibold">Disease & Treatment History</h4>
                                    {animalData.disease_history.length > 0 ? (
                                        <ul className="space-y-2">
                                            {animalData.disease_history.map((record, index) => (
                                                <li key={index} className="flex items-center justify-between p-2 border rounded-lg">
                                                    <span>{record}</span>
                                                    <Button variant="ghost" size="icon" onClick={() => removeItem(index, 'disease')}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (<p className="text-sm text-muted-foreground text-center py-4">No disease history recorded.</p>)}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
