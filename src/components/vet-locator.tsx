import Image from 'next/image';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Phone, MapPin } from 'lucide-react';

const fakeVets = [
  {
    name: 'Rural Veterinary Clinic',
    address: '123 Farm Road, Vill: Rampur',
    phone: '+91-9876543210',
  },
  {
    name: 'Green Pastures Vet Care',
    address: '456 Cattle St, Near Market',
    phone: '+91-9876543211',
  },
  {
    name: 'Paws & Hooves Hospital',
    address: '789 Highway Junction, Block: A',
    phone: '+91-9876543212',
  },
];

export function VetLocator() {
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
            <li key={vet.name} className="flex items-start gap-4 p-4 border rounded-lg bg-background">
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
              <Button variant="outline" size="sm" className="mt-2">
                Directions
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
