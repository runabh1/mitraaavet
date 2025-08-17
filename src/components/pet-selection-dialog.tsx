
'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PawPrint, Bird, Fish, Wheat } from 'lucide-react';

interface PetSelectionDialogProps {
  isOpen: boolean;
  onSelectPet: (petType: string) => void;
}

const petOptions = [
    { name: 'Cattle', icon: <PawPrint className="h-10 w-10 mx-auto mb-2" /> },
    { name: 'Poultry', icon: <Bird className="h-10 w-10 mx-auto mb-2" /> },
    { name: 'Farming', icon: <Wheat className="h-10 w-10 mx-auto mb-2" /> },
    { name: 'Fish', icon: <Fish className="h-10 w-10 mx-auto mb-2" /> },
]

export default function PetSelectionDialog({ isOpen, onSelectPet }: PetSelectionDialogProps) {
  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline">Welcome to MitraVet!</DialogTitle>
          <DialogDescription>
            To get started, please select your primary focus.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          {petOptions.map(pet => (
            <Button
              key={pet.name}
              variant="outline"
              className="h-32 flex-col"
              onClick={() => onSelectPet(pet.name)}
            >
              {pet.icon}
              {pet.name}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
