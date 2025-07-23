
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

const realVets = [
  {
    id: 'vet1',
    name: 'Guwahati Veterinary Hospital',
    address: 'Chenikuthi, M.C. Road, Guwahati, Assam',
    phone: '+91-9876543210',
    query: 'Guwahati%20Veterinary%20Hospital%2C%20Guwahati'
  },
  {
    id: 'vet2',
    name: 'Animal Care Clinic',
    address: 'Zoo Road, near Central Zoo, Guwahati, Assam',
    phone: '+91-9876543211',
    query: 'Animal%20Care%20Clinic%2C%20Zoo%20Road%2C%20Guwahati'
  },
  {
    id: 'vet3',
    name: "Pet's World Clinic",
    address: 'Six Mile, G.S. Road, Guwahati, Assam',
    phone: '+91-9876543212',
    query: 'Pets%20World%20Clinic%2C%20Six%20Mile%2C%20Guwahati'
  },
];

const DEFAULT_MAP_SRC = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d114833.0123681431!2d91.68593459143936!3d26.14333603415663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x375a5a217bac8f21%3A0x8e8bba3356e87a6!2sGuwahati%2C%20Assam%2C%20India!5e0!3m2!1sen!2sus!4v1694773839281!5m2!1sen!2sus&q=veterinary+clinic";

export function VetLocator() {
  const { toast } = useToast();
  const [selectedVet, setSelectedVet] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [mapSrc, setMapSrc] = useState(DEFAULT_MAP_SRC);

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

  const handleShowDirections = (vetQuery: string) => {
    const origin = "Guwahati, Assam";
    const destination = vetQuery;
    const newSrc = `https://www.google.com/maps/embed/v1/directions?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    // Since we can't use a real API key in this environment, we'll construct a standard Google Maps URL and open it in a new tab.
    // For a real embedded experience, you would use an API key with the line above.
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`;
    window.open(mapsUrl, '_blank');

    // To demonstrate the map changing, we'll just focus on the destination.
    setMapSrc(`https://maps.google.com/maps?q=${vetQuery}&t=&z=13&ie=UTF8&iwloc=&output=embed`);
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
        <div className="h-64 w-full rounded-lg overflow-hidden relative border">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Veterinary clinics in Guwahati"
          ></iframe>
        </div>
        <ul className="space-y-4">
          {realVets.map((vet) => (
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
                 <Button variant="outline" size="sm" onClick={() => handleShowDirections(vet.query)}>
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
