
'use client';
import React, { useState, useRef, useEffect, useActionState } from 'react';
import Header from '@/components/header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mic, Square, User, Bot, Volume2, Loader2, Send } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { voiceAssistant } from '@/ai/flows/voice-assistant';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  audioDataUri?: string;
}

async function handleVoiceQuery(prevState: any, formData: FormData): Promise<{ messages: Message[] } | { error: string }> {
    const question = formData.get('question') as string;
    const language = formData.get('language') as string || 'English';
    if (!question || question.trim().length === 0) {
        return { error: 'Question cannot be empty.' };
    }
    
    try {
        const response = await voiceAssistant({
            question,
            language,
        });

        const newUserMessage: Message = { id: Date.now(), role: 'user', text: question };
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
    const [inputValue, setInputValue] = useState('');
    const [language, setLanguage] = useState('English');
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const [state, formAction, isPending] = useActionState(handleVoiceQuery, { messages: [] });

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
            setInputValue('');
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

    useEffect(() => {
        const languageCode = language === 'Assamese' ? 'as-IN' : language === 'Hindi' ? 'hi-IN' : 'en-US';
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = languageCode;

            recognition.onresult = (event) => {
                let finalTranscript = '';
                 for (let i = 0; i < event.results.length; i++) {
                    finalTranscript += event.results[i][0].transcript;
                }
                setInputValue(finalTranscript);
            };
            recognition.onerror = (event) => {
                toast({ variant: 'destructive', title: 'Speech Error', description: event.error });
                setIsRecording(false);
            };
            recognition.onend = () => setIsRecording(false);
            recognitionRef.current = recognition;
        } else {
            toast({ variant: 'destructive', title: 'Not Supported', description: 'Speech recognition is not supported in your browser.' });
        }
    }, [toast, language]);

    const handleLogout = () => {
        localStorage.removeItem('userLoggedIn');
        localStorage.removeItem('petType');
        setIsLoggedOut(true);
        router.push('/login');
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
             navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
                setInputValue('');
                recognitionRef.current?.start();
                setIsRecording(true);
            }).catch(() => {
                toast({ variant: 'destructive', title: 'Permission Denied', description: 'Please allow microphone access.' });
            });
        }
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
                            {messages.length === 0 && <p className="text-center text-muted-foreground">Ask me anything about your animal's health!</p>}
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
                        </ScrollArea>
                        <form action={formAction} className="relative mt-auto">
                             <input type="hidden" name="language" value={language} />
                            <Textarea
                                name="question"
                                placeholder="Type your question or use the mic..."
                                className="pr-20"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        if (!isPending) (e.target as HTMLFormElement).form?.requestSubmit();
                                    }
                                }}
                            />
                            <div className="absolute top-1/2 right-2 -translate-y-1/2 flex items-center gap-1">
                                <Button type="button" variant="ghost" size="icon" onClick={toggleRecording} disabled={isPending}>
                                    {isRecording ? <Square className="text-destructive" /> : <Mic />}
                                </Button>
                                <Button type="submit" size="icon" disabled={isPending || !inputValue.trim()}>
                                    {isPending ? <Loader2 className="animate-spin" /> : <Send />}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
