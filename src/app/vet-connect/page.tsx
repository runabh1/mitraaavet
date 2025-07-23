
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { VetLocator } from '@/components/vet-locator';

export default function VetConnectPage() {
    const router = useRouter();
    const [isLoggedOut, setIsLoggedOut] = useState(false);

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
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <Card>
                    <CardHeader>
                        <CardTitle>Vet Connect</CardTitle>
                        <CardDescription>Connect with veterinary services.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <VetLocator />
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
