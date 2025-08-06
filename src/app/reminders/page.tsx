
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Bell, Syringe, Heart, Baby, ALargeSmall, Calendar as CalendarIcon, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';


type Reminder = {
    id: number;
    type: 'Vaccination' | 'Deworming' | 'Pregnancy Due' | 'Heat Cycle';
    date: string;
    notes: string;
};

type VaccinationRecord = {
    id: number;
    name: string;
    date: Date;
    status: 'done' | 'due';
};

const initialReminders: Reminder[] = [
    { id: 1, type: 'Vaccination', date: '2025-08-01', notes: 'FMD Booster Shot' },
    { id: 2, type: 'Deworming', date: '2025-09-15', notes: 'Oral medication' },
    { id: 3, type: 'Pregnancy Due', date: '2025-10-20', notes: 'Expected delivery for Cow #3' },
    { id: 4, type: 'Heat Cycle', date: '2025-08-12', notes: 'Predicted for Heifer #1' },
];

const initialVaccinations: VaccinationRecord[] = [
    { id: 1, name: 'Anthrax Vaccine', date: new Date('2025-07-15'), status: 'done'},
    { id: 2, name: 'FMD Booster', date: new Date('2025-08-01'), status: 'due' },
    { id: 3, name: 'Rabies Shot', date: new Date('2025-06-20'), status: 'done' },
    { id: 4, name: 'Tetanus Toxoid', date: new Date('2025-09-10'), status: 'due' },
];

const reminderIcons = {
    'Vaccination': <Syringe className="h-5 w-5 text-blue-500" />,
    'Deworming': <ALargeSmall className="h-5 w-5 text-green-500" />,
    'Pregnancy Due': <Baby className="h-5 w-5 text-pink-500" />,
    'Heat Cycle': <Heart className="h-5 w-5 text-red-500" />,
};

export default function RemindersPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [reminders, setReminders] = useState<Reminder[]>(initialReminders);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isCalendarDialogOpen, setIsCalendarDialogOpen] = useState(false);
    const [vaccinations, setVaccinations] = useState<VaccinationRecord[]>(initialVaccinations);


    const handleLogout = () => {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('petType');
      setIsLoggedOut(true);
      router.push('/login');
    }

    const handleAddReminder = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const type = formData.get('type') as Reminder['type'];
        const date = formData.get('date') as string;
        const notes = formData.get('notes') as string;

        if (type && date && notes) {
            const newReminder: Reminder = {
                id: Date.now(),
                type,
                date,
                notes,
            };
            setReminders(prev => [...prev, newReminder].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            toast({
                title: "Reminder Added",
                description: `A new reminder for ${type} has been scheduled.`,
            });
            setIsAddDialogOpen(false);
            (e.target as HTMLFormElement).reset();
        }
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
                    <CardHeader className="flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                        <div>
                            <CardTitle className="text-2xl">Care Reminders</CardTitle>
                            <CardDescription>Get reminders for vaccinations, heat cycles, and more.</CardDescription>
                        </div>
                        <div className="flex gap-2">
                             <Dialog open={isCalendarDialogOpen} onOpenChange={setIsCalendarDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline">
                                        <Eye className="mr-2 h-4 w-4"/>
                                        Vaccination Calendar
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Vaccination Calendar</DialogTitle>
                                        <DialogDescription>
                                            Track completed and upcoming vaccinations for your animal.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="flex justify-center">
                                       <Calendar
                                            mode="multiple"
                                            selected={vaccinations.map(v => v.date)}
                                            modifiers={{
                                                done: vaccinations.filter(v => v.status === 'done').map(v => v.date),
                                                due: vaccinations.filter(v => v.status === 'due').map(v => v.date),
                                            }}
                                            modifiersClassNames={{
                                                done: 'bg-green-200 text-green-900 rounded-full',
                                                due: 'bg-yellow-200 text-yellow-900 rounded-full',
                                            }}
                                            className="rounded-md border"
                                        />
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-green-200" /> Vaccination Done</div>
                                        <div className="flex items-center gap-2"><div className="h-4 w-4 rounded-full bg-yellow-200" /> Vaccination Due</div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button>
                                        <PlusCircle className="mr-2 h-4 w-4"/>
                                        Add Reminder
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Add a New Care Reminder</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAddReminder} className="space-y-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="type">Reminder Type</Label>
                                            <Select name="type" required>
                                                <SelectTrigger id="type">
                                                    <SelectValue placeholder="Select a type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Vaccination">Vaccination</SelectItem>
                                                    <SelectItem value="Deworming">Deworming</SelectItem>
                                                    <SelectItem value="Pregnancy Due">Pregnancy Due</SelectItem>
                                                    <SelectItem value="Heat Cycle">Heat Cycle</SelectItem>
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
                        </div>
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
                                             <p className="text-xs text-muted-foreground">in {Math.ceil((new Date(reminder.date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days</p>
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

    
