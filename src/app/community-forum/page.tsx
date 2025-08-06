
'use client';
import React, { useState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, PlusCircle, User, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const initialPosts = [
  {
    id: 1,
    author: 'Ramesh Patel',
    avatar: 'https://placehold.co/40x40.png',
    dataAiHint: 'farmer portrait',
    question: 'My potato plants have yellow spots on the leaves. What could be the issue?',
    replies: [
      { author: 'Dr. Priya Sharma (Vet Expert)', text: 'This sounds like early blight. I would recommend using a copper-based fungicide. Also, ensure good air circulation around the plants.' },
      { author: 'Sunita Devi', text: 'I had the same problem last year. Dr. Sharma is right, the fungicide works. Also, try removing the affected leaves immediately.' },
    ],
    likes: 5,
  },
  {
    id: 2,
    author: 'Anjali Das',
    avatar: 'https://placehold.co/40x40.png',
    dataAiHint: 'woman farmer',
    question: 'What is the best feed for increasing milk yield in cows during the summer?',
    replies: [
        { author: 'Community Helper', text: 'A balanced diet with plenty of green fodder and access to cool water is key. You can find detailed plans in the "Feed Advice" section of the app!' }
    ],
    likes: 12,
  },
];

type Post = typeof initialPosts[0];

export default function CommunityForumPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [posts, setPosts] = useState<Post[]>(initialPosts);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleLogout = () => {
      localStorage.removeItem('userLoggedIn');
      localStorage.removeItem('petType');
      setIsLoggedOut(true);
      router.push('/login');
    }

    const handleAddPost = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const question = formData.get('question') as string;
        
        if (question) {
            const newPost: Post = {
                id: Date.now(),
                author: 'Demo User',
                avatar: 'https://placehold.co/40x40.png',
                dataAiHint: 'user avatar',
                question,
                replies: [],
                likes: 0,
            };
            setPosts(prev => [newPost, ...prev]);
            toast({
                title: 'Question Posted!',
                description: 'Your question is now live in the community forum.',
            });
            setIsDialogOpen(false);
        }
    };
    
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
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl">Community Forum</CardTitle>
                            <CardDescription>Ask questions and share knowledge with other farmers and experts.</CardDescription>
                        </div>
                         <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4"/>
                                    Ask a Question
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Post a New Question</DialogTitle>
                                </DialogHeader>
                                <form onSubmit={handleAddPost} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="question">Your Question</Label>
                                        <Textarea id="question" name="question" rows={5} placeholder="Describe your issue or ask for advice..." required />
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
                                        <Button type="submit">Post Question</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {posts.map(post => (
                            <div key={post.id} className="border p-4 rounded-lg">
                                <div className="flex items-start gap-4">
                                    <Avatar>
                                        <AvatarImage src={post.avatar} data-ai-hint={post.dataAiHint} />
                                        <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1">
                                        <p className="font-semibold">{post.author}</p>
                                        <p className="mt-1">{post.question}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2 pl-14">
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                        <ThumbsUp className="h-4 w-4" /> {post.likes}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="flex items-center gap-1">
                                        <MessageSquare className="h-4 w-4" /> Reply
                                    </Button>
                                </div>
                                {post.replies.length > 0 && <Separator className="my-4" />}
                                <div className="space-y-4 pl-14">
                                    {post.replies.map((reply, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <Avatar className="h-8 w-8">
                                                 <AvatarImage src={`https://placehold.co/40x40.png?text=${reply.author.charAt(0)}`} />
                                                <AvatarFallback>{reply.author.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 text-sm bg-muted p-3 rounded-lg">
                                                <p className="font-semibold">{reply.author}</p>
                                                <p>{reply.text}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
