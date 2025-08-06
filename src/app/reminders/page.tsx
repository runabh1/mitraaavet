
'use client';
import React, { useState, useEffect } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Bell, Syringe, Heart, Baby, ALargeSmall, Calendar as CalendarIcon, Eye, Tractor, Droplets } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';

type AnimalReminderType = 'Vaccination' | 'Deworming' | 'Pregnancy Due' | 'Heat Cycle';
type CropReminderType = 'Planting' | 'Fertilizing' | 'Harvesting' | 'Irrigation';
type ReminderType = AnimalReminderType | CropReminderType;

type Reminder = {
    id: number;
    type: ReminderType;
    date: string;
    notes: string;
};

const initialAnimalReminders: Reminder[] = [
    { id: 1, type: 'Vaccination', date: '2025-08-01', notes: 'FMD Booster Shot' },
    { id: 2, type: 'Deworming', date: '2025-09-15', notes: 'Oral medication' },
    { id: 3, type: 'Pregnancy Due', date: '2025-10-20', notes: 'Expected delivery for Cow #3' },
];

const initialCropReminders: Reminder[] = [
    { id: 4, type: 'Planting', date: '2025-08-10', notes: 'Plant paddy seedlings' },
    { id: 5, type: 'Fertilizing', date: '2025-09-01', notes: 'Apply NPK fertilizer to corn' },
    { id: 6, type: 'Harvesting', date: '2025-11-15', notes: 'Harvest potato crop' },
];

const reminderIcons: Record<ReminderType, React.ReactNode> = {
    'Vaccination': <Syringe className="h-5 w-5 text-blue-500" />,
    'Deworming': <ALargeSmall className="h-5 w-5 text-green-500" />,
    'Pregnancy Due': <Baby className="h-5 w-5 text-pink-500" />,
    'Heat Cycle': <Heart className="h-5 w-5 text-red-500" />,
    'Planting': <Tractor className="h-5 w-5 text-orange-500" />,
    'Fertilizing': <Droplets className="h-5 w-5 text-purple-500" />,
    'Harvesting': <Tractor className="h-5 w-5 text-yellow-600" />,
    'Irrigation': <Droplets className="h-5 w-5 text-cyan-500" />,
};

export default function RemindersPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [focusType, setFocusType] = useState<string | null>(null);

    useEffect(() => {
        const savedFocus = localStorage.getItem('petType');
        setFocusType(savedFocus);
        if (savedFocus === 'Farming') {
            setReminders(initialCropReminders);
        } else {
            setReminders(initialAnimalReminders);
        }
    }, []);

    const handleLogout = () => {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('petType');
      setIsLoggedOut(true);
      router.push('/login');
    }

    const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const type = formData.get('type') as ReminderType;
        const date = formData.get('date') as string;
        const notes = formData.get('notes') as string;

        if (type && date && notes) {
            const newReminder: Reminder = { id: Date.now(), type, date, notes };
            setReminders(prev => [...prev, newReminder].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            toast({ title: "Reminder Added", description: `A new reminder for ${type} has been scheduled.` });
            setIsAddDialogOpen(false);
            (e.target as HTMLFormElement).reset();
        }
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
                    <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-2xl">{isFarming ? 'Farming Reminders' : 'Animal Care Reminders'}</CardTitle>
                            <CardDescription>Stay on top of important tasks and events.</CardDescription>
                        </div>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                            <DialogTrigger asChild>
                                <Button><PlusCircle className="mr-2 h-4 w-4"/>Add Reminder</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add a New Reminder</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddReminder} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="type">Reminder Type</Label>
                                        <Select name="type" required>
                                            <SelectTrigger id="type">
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {isFarming ? (
                                                    <>
                                                        <SelectItem value="Planting">Planting</SelectItem>
                                                        <SelectItem value="Fertilizing">Fertilizing</SelectItem>
                                                        <SelectItem value="Harvesting">Harvesting</SelectItem>
                                                        <SelectItem value="Irrigation">Irrigation</SelectItem>
                                                    </>
                                                ) : (
                                                    <>
                                                        <SelectItem value="Vaccination">Vaccination</SelectItem>
                                                        <SelectItem value="Deworming">Deworming</SelectItem>
                                                        <SelectItem value="Pregnancy Due">Pregnancy Due</SelectItem>
                                                        <SelectItem value="Heat Cycle">Heat Cycle</SelectItem>
                                                    </>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Input id="date" name="date" type="date" required />
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="notes">Notes</Label>
                                        <Input id="notes" name="notes" type="text" placeholder="e.g., FMD Booster for Cow #3" required />
                                    </div>
                                    <Button type="submit" className="w-full">Save Reminder</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {reminders.length > 0 ? (
                             <ul className="space-y-3">
                                {reminders.map(reminder => (
                                    <li key={reminder.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50">
                                        <div className="flex-shrink-0">
                                            {reminderIcons[reminder.type]}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold">{reminder.type}</p>
                                            <p className="text-sm text-muted-foreground">{reminder.notes}</p>
                                        </div>
                                        <div className="text-right">
                                             <p className="font-medium">{format(new Date(reminder.date), 'PPP')}</p>
                                             <p className="text-xs text-muted-foreground">in {Math.ceil(Math.max(0, (new Date(reminder.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} days</p>
                                        </div>
                                    </li>
                                ))}
                             </ul>
                        ) : (
                             <div className="text-center py-10">
                                <Bell className="mx-auto h-12 w-12 text-muted-foreground"/>
                                <h3 className="mt-2 text-lg font-medium">No Reminders Yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Add a reminder to get started.</p>
                             </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
