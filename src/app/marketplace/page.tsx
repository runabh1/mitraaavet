
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function MarketplacePage() {
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
                        <CardTitle>Marketplace</CardTitle>
                        <CardDescription>Buy and sell animals, feed, and accessories.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">This feature is under construction.</p>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
