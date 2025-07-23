
'use client';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Phone, MapPin, Calendar } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const fakeVets = [
  {
    id: 'vet1',
    name: 'Rural Veterinary Clinic',
    address: '123 Farm Road, Vill: Rampur',
    phone: '+91-9876543210',
  },
  {
    id: 'vet2',
    name: 'Green Pastures Vet Care',
    address: '456 Cattle St, Near Market',
    phone: '+91-9876543211',
  },
  {
    id: 'vet3',
    name: 'Paws & Hooves Hospital',
    address: '789 Highway Junction, Block: A',
    phone: '+91-9876543212',
  },
];

export function VetLocator() {
  const { toast } = useToast();
  const [selectedVet, setSelectedVet] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBooking = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const date = formData.get('appointmentDate');
    toast({
        title: "Appointment Booked!",
        description: `Your appointment with ${selectedVet?.name} on ${date} is confirmed.`
    });
    setIsDialogOpen(false);
  }


  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Nearest Vets</CardTitle>
        <CardDescription>
          Showing clinics near your location. This is a demo, data is for illustrative purposes only.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-48 w-full rounded-lg overflow-hidden relative">
          <Image
            src="https://placehold.co/600x400"
            alt="Map showing vet locations"
            layout="fill"
            objectFit="cover"
            data-ai-hint="map"
          />
        </div>
        <ul className="space-y-4">
          {fakeVets.map((vet) => (
            <li key={vet.name} className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg bg-background">
              <div className="flex-1">
                <h4 className="font-bold">{vet.name}</h4>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0" />
                  {vet.address}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                   <Phone className="h-4 w-4 shrink-0" />
                   {vet.phone}
                </p>
              </div>
              <div className="flex gap-2 self-start sm:self-center">
                 <Button variant="outline" size="sm">
                    Directions
                 </Button>
                 <Button size="sm" onClick={() => {
                    setSelectedVet(vet);
                    setIsDialogOpen(true);
                 }}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book
                 </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
              <DialogHeader>
                  <DialogTitle>Book Appointment</DialogTitle>
                  <CardDescription>Schedule a time with {selectedVet?.name}.</CardDescription>
              </DialogHeader>
              <form onSubmit={handleBooking}>
                  <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="appointmentDate" className="text-right">Date & Time</Label>
                          <Input id="appointmentDate" name="appointmentDate" type="datetime-local" className="col-span-3" required />
                      </div>
                  </div>
                  <DialogFooter>
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">Cancel</Button>
                      </DialogClose>
                      <Button type="submit">Confirm Appointment</Button>
                  </DialogFooter>
              </form>
          </DialogContent>
      </Dialog>
    </Card>
  );
}
