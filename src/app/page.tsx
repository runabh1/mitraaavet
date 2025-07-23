
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import PetSelectionDialog from '@/components/pet-selection-dialog';
import FeatureGrid from '@/components/feature-grid';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [petType, setPetType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('userLoggedIn');
    if (!loggedIn) {
      router.push('/login');
      return;
    }

    const savedPetType = localStorage.getItem('petType');
    if (savedPetType) {
      setPetType(savedPetType);
    } else {
      setIsDialogOpen(true);
    }
  }, [router]);

  const handlePetSelection = (selectedPet: string) => {
    localStorage.setItem('petType', selectedPet);
    setPetType(selectedPet);
    setIsDialogOpen(false);
    toast({
      title: 'Pet Selected!',
      description: `You've selected ${selectedPet}. The app is now tailored for you.`,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('petType');
    router.push('/login');
  }

  if (!petType && !isDialogOpen) {
    // Still waiting for useEffect to run
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-1 container mx-auto p-4 md:p-8">
        <PetSelectionDialog isOpen={isDialogOpen} onSelectPet={handlePetSelection} />
        {petType && (
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2 font-headline">
              Welcome to MitraVet!
            </h1>
            <p className="text-muted-foreground mb-6">
              Your dashboard for managing your <span className="font-semibold text-primary">{petType}</span>.
            </p>
            <FeatureGrid petType={petType} />
          </div>
        )}
      </main>
    </div>
  );
}
