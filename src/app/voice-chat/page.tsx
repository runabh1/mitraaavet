
'use client';
import React, { useState, useRef, useEffect, useActionState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Square, User, Bot, Volume2, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { processVoiceQuery } from '@/ai/flows/process-voice-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  audioDataUri?: string;
}

async function handleVoiceQueryAction(prevState: any, formData: FormData): Promise<{ messages: Message[] } | { error: string }> {
    const audioBlob = formData.get('audioBlob') as Blob;
    const language = formData.get('language') as string || 'English';

    if (!audioBlob || audioBlob.size === 0) {
        return { error: 'No audio was recorded.' };
    }

    try {
        const audioBuffer = await audioBlob.arrayBuffer();
        const audioDataUri = `data:audio/webm;base64,${Buffer.from(audioBuffer).toString('base64')}`;

        const response = await processVoiceQuery({
            audioDataUri,
            language,
        });

        const newUserMessage: Message = { id: Date.now(), role: 'user', text: response.question };
        const newAssistantMessage: Message = { id: Date.now() + 1, role: 'assistant', text: response.answer, audioDataUri: response.audioDataUri };
        
        return { messages: [newUserMessage, newAssistantMessage] };

    } catch(e: any) {
        return { error: e.message || "An unexpected error occurred." };
    }
}

export default function VoiceChatPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [language, setLanguage] = useState('English');
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);


    const [state, formAction, isPending] = useActionState(handleVoiceQueryAction, { messages: [] });

    useEffect(() => {
        const savedLanguage = localStorage.getItem('language') || 'English';
        setLanguage(savedLanguage);
    }, []);

    useEffect(() => {
        if ('error' in state && state.error) {
            toast({ variant: 'destructive', title: 'Error', description: state.error });
        }
        if ('messages' in state && state.messages) {
            setMessages(prev => [...prev, ...state.messages]);
        }
    }, [state, toast]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.role === 'assistant' && lastMessage.audioDataUri && audioRef.current) {
            audioRef.current.src = lastMessage.audioDataUri;
            audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
        }
    }, [messages]);


    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('petType');
        setIsLoggedOut(true);
        router.push('/login');
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mediaRecorder;
            audioChunksRef.current = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                
                if (formRef.current) {
                    const dataTransfer = new DataTransfer();
                    dataTransfer.items.add(new File([audioBlob], "symptoms.webm", { type: "audio/webm" }));
                    const fileInput = formRef.current.querySelector('input[type="file"]') as HTMLInputElement;
                    fileInput.files = dataTransfer.files;
                    formRef.current.requestSubmit();
                }

                 // Stop all tracks to release the microphone
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error('Microphone access denied:', err);
            toast({ variant: 'destructive', title: 'Permission Denied', description: 'Please allow microphone access.' });
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        }
        setIsRecording(false);
    };

    const playAudio = (audioDataUri: string) => {
        if (audioRef.current) {
            audioRef.current.src = audioDataUri;
            audioRef.current.play();
        }
    }

    if (isLoggedOut) {
        return null;
    }

    return (
        <div className="flex h-screen w-full flex-col">
            <Header onLogout={handleLogout} />
            <audio ref={audioRef} className="hidden" />
            <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col">
                <Button variant="ghost" onClick={() => router.push('/')} className="mb-4 self-start">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Dashboard
                </Button>
                <Card className="flex-1 flex flex-col">
                    <CardHeader>
                        <CardTitle>Voice Assistant</CardTitle>
                        <CardDescription>Ask questions about your pet and get voice responses. Current language: {language}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-4">
                        <ScrollArea className="flex-1 space-y-4 pr-4" ref={scrollAreaRef}>
                            {messages.length === 0 && <p className="text-center text-muted-foreground">Press the mic to start speaking.</p>}
                            {messages.map((msg) => (
                                <div key={msg.id} className={`flex items-start gap-3 my-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                                    {msg.role === 'assistant' && (
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback><Bot/></AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={`rounded-lg p-3 max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                        {msg.role === 'assistant' && msg.audioDataUri && (
                                           <Button size="icon" variant="ghost" className="h-6 w-6 mt-2" onClick={() => playAudio(msg.audioDataUri)}>
                                               <Volume2 className="h-4 w-4"/>
                                           </Button>
                                        )}
                                    </div>
                                     {msg.role === 'user' && (
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback><User /></AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isPending && (
                               <div className="flex items-start gap-3 my-4 justify-end">
                                    <div className="rounded-lg p-3 max-w-[80%] bg-primary text-primary-foreground flex items-center gap-2">
                                        <Loader2 className="animate-spin h-4 w-4"/>
                                        <span className="text-sm">Thinking...</span>
                                    </div>
                                    <Avatar className="h-9 w-9">
                                        <AvatarFallback><User /></AvatarFallback>
                                    </Avatar>
                               </div>
                            )}
                        </ScrollArea>

                        <form action={formAction} ref={formRef} className="hidden">
                            <input type="file" name="audioBlob" />
                            <input type="hidden" name="language" value={language} />
                        </form>

                        <div className="flex justify-center items-center pt-4">
                            <Button
                                type="button"
                                variant={isRecording ? 'destructive' : 'default'}
                                size="lg"
                                className="rounded-full w-20 h-20"
                                onClick={isRecording ? stopRecording : startRecording}
                                disabled={isPending}
                            >
                                {isPending ? <Loader2 className="animate-spin h-8 w-8" /> : <Mic className="h-8 w-8" />}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
