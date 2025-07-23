
'use client';
import React, { useState, useMemo } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, Search, Tag, Phone } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const initialListings = [
  {
    id: 'listing1',
    name: 'Healthy Goat for Sale',
    category: 'Animals',
    price: 8000,
    location: 'Rampur Village',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'goat farm',
    sellerContact: '+91-9999988888',
  },
  {
    id: 'listing2',
    name: 'High-Protein Cattle Feed (50kg)',
    category: 'Feed',
    price: 1500,
    location: 'Near Market',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'cattle feed',
    sellerContact: '+91-9999977777',
  },
  {
    id: 'listing3',
    name: 'Durable Cage for Poultry',
    category: 'Accessories',
    price: 2500,
    location: 'Block: B',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'chicken coop',
    sellerContact: '+91-9999966666',
  },
   {
    id: 'listing4',
    name: 'Young Buffalo',
    category: 'Animals',
    price: 25000,
    location: 'Village Main Road',
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'buffalo farm',
    sellerContact: '+91-9999955555',
  },
];

type Listing = typeof initialListings[0];

function PostAdDialog({ onAddListing }: { onAddListing: (listing: Listing) => void }) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const newListing: Listing = {
            id: `listing${Date.now()}`,
            name: formData.get('name') as string,
            category: formData.get('category') as string,
            price: Number(formData.get('price')),
            location: formData.get('location') as string,
            sellerContact: formData.get('contact') as string,
            imageUrl: 'https://placehold.co/600x400.png',
            dataAiHint: 'new listing placeholder'
        };

        if (newListing.name && newListing.category && newListing.price && newListing.location && newListing.sellerContact) {
            onAddListing(newListing);
            toast({
                title: "Listing Posted!",
                description: "Your item is now live in the marketplace.",
            });
            setIsOpen(false);
        } else {
             toast({
                variant: 'destructive',
                title: "Incomplete Form",
                description: "Please fill out all fields to post an ad.",
            });
        }
    };

    return (
         <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Post an Ad
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Post a New Listing</DialogTitle>
                    <CardDescription>Fill in the details of the item you want to sell.</CardDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Item Name</Label>
                        <Input id="name" name="name" placeholder="e.g., Healthy Cow" required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select name="category" required>
                            <SelectTrigger id="category">
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Animals">Animals</SelectItem>
                                <SelectItem value="Feed">Feed</SelectItem>
                                <SelectItem value="Accessories">Accessories</SelectItem>
                                <SelectItem value="Medicine">Medicine</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="price">Price (in ₹)</Label>
                        <Input id="price" name="price" type="number" placeholder="e.g., 10000" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" name="location" placeholder="e.g., Rampur Village" required />
                    </div>
                     <div className="grid gap-2">
                        <Label htmlFor="contact">Contact Number</Label>
                        <Input id="contact" name="contact" type="tel" placeholder="+91-..." required />
                    </div>
                     <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                        <Button type="submit">Post Listing</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default function MarketplacePage() {
    const router = useRouter();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [listings, setListings] = useState<Listing[]>(initialListings);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    const handleLogout = () => {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('petType');
      setIsLoggedOut(true);
      router.push('/login');
    }
    
    if (isLoggedOut) {
        return null;
    }

    const filteredListings = useMemo(() => {
        return listings.filter(listing => {
            const matchesSearch = listing.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = filterCategory === 'All' || listing.category === filterCategory;
            return matchesSearch && matchesCategory;
        });
    }, [listings, searchQuery, filterCategory]);

    const handleAddListing = (listing: Listing) => {
        setListings(prev => [listing, ...prev]);
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
                    <CardHeader className="flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-2xl">Marketplace</CardTitle>
                            <CardDescription>Buy and sell animals, feed, and accessories.</CardDescription>
                        </div>
                        <PostAdDialog onAddListing={handleAddListing} />
                    </CardHeader>
                    <CardContent>
                       <div className="mb-6 flex flex-col sm:flex-row gap-4">
                           <div className="relative flex-1">
                               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                               <Input 
                                 placeholder="Search for items..." 
                                 className="pl-10"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                               />
                           </div>
                           <Select value={filterCategory} onValueChange={setFilterCategory}>
                               <SelectTrigger className="w-full sm:w-[180px]">
                                   <SelectValue placeholder="Filter by category" />
                               </SelectTrigger>
                               <SelectContent>
                                   <SelectItem value="All">All Categories</SelectItem>
                                   <SelectItem value="Animals">Animals</SelectItem>
                                   <SelectItem value="Feed">Feed</SelectItem>
                                   <SelectItem value="Accessories">Accessories</SelectItem>
                                    <SelectItem value="Medicine">Medicine</SelectItem>
                               </SelectContent>
                           </Select>
                       </div>
                       
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredListings.map(listing => (
                                <Card key={listing.id} className="overflow-hidden flex flex-col">
                                    <div className="relative h-48 w-full">
                                      <Image
                                          src={listing.imageUrl}
                                          alt={listing.name}
                                          layout="fill"
                                          objectFit="cover"
                                          data-ai-hint={listing.dataAiHint}
                                      />
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-lg leading-tight">{listing.name}</CardTitle>
                                        <Badge variant="secondary" className="w-fit">
                                            <Tag className="mr-1 h-3 w-3"/>
                                            {listing.category}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <p className="text-xl font-bold text-primary">₹{listing.price.toLocaleString('en-IN')}</p>
                                            <p className="text-sm text-muted-foreground mt-1">{listing.location}</p>
                                        </div>
                                         <Button className="w-full mt-4">
                                            <Phone className="mr-2 h-4 w-4" />
                                            Contact Seller
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                            {filteredListings.length === 0 && (
                                <div className="col-span-full text-center py-10">
                                    <p className="text-muted-foreground">No listings found matching your criteria.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
