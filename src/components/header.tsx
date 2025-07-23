'use client';

import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Globe, ChevronDown } from 'lucide-react';
import { Logo } from './icons/logo';

export default function Header() {
  const [language, setLanguage] = React.useState('English');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Logo className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl font-headline">MitraVet</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <Globe className="h-4 w-4" />
              <span>{language}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setLanguage('English')}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setLanguage('Hindi')}>
              हिन्दी
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setLanguage('Assamese')}>
              অসমীয়া
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
