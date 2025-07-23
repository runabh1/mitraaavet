
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Edit } from 'lucide-react';
import PetSelectionDialog from '@/components/pet-selection-dialog';

export default function ProfilePage() {
  const router = useRouter();
  const [petType, setPetType] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const savedPetType = localStorage.getItem('petType');
    if (savedPetType) {
      setPetType(savedPetType);
    }
  }, []);

  const handlePetSelection = (selectedPet: string) => {
    localStorage.setItem('petType', selectedPet);
    setPetType(selectedPet);
    setIsDialogOpen(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userLoggedIn');
    localStorage.removeItem('petType');
    setIsLoggedOut(true);
    router.push('/login');
  }

  if (isLoggedOut) {
    return null;
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
       <Header onLogout={handleLogout} />
       <main className="flex-1 container mx-auto p-4 md:p-8">
        <PetSelectionDialog isOpen={isDialogOpen} onSelectPet={handlePetSelection} />
         <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
           <ArrowLeft className="mr-2 h-4 w-4" />
           Back to Dashboard
         </Button>
         <Card>
           <CardHeader>
             <CardTitle className="text-2xl">User Profile</CardTitle>
             <CardDescription>View and manage your profile settings.</CardDescription>
           </CardHeader>
           <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src="https://placehold.co/100x100" alt="User avatar" />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="text-xl font-semibold">Demo User</h3>
                        <p className="text-muted-foreground">m@example.com</p>
                    </div>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold">Primary Animal Type</h4>
                    <div className="flex items-center justify-between rounded-lg border p-3">
                        <p className="text-muted-foreground">{petType || 'Not set'}</p>
                        <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(true)}>
                            <Edit className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

           </CardContent>
         </Card>
       </main>
    </div>
  );
}
