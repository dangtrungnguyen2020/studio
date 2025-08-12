
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Keyboard from '@/components/keystroke-symphony/keyboard';
import { THEMES } from '@/lib/keyboards';
import type { KeyboardTheme } from '@/lib/keyboards';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/theme-switcher';

export default function ThemesPage() {
  const [selectedTheme, setSelectedTheme] = useState<KeyboardTheme>('default');
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('keystroke-symphony-theme') as KeyboardTheme | null;
    if (savedTheme && THEMES.find(t => t.value === savedTheme)) {
      setSelectedTheme(savedTheme);
    }
    setHydrated(true);
  }, []);

  const handleSelectTheme = (theme: KeyboardTheme) => {
    setSelectedTheme(theme);
    localStorage.setItem('keystroke-symphony-theme', theme);
    // This is a bit of a hack to ensure other tabs get the message.
    window.dispatchEvent(new Event('storage'));
  };

  if (!hydrated) {
    return null; // or a loading spinner
  }

  return (
    <div className={`min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8 font-body`}>
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
           <Link href="/" passHref>
             <Button variant="outline" size="icon">
                <ArrowLeft />
             </Button>
            </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-headline">Choose Your Keyboard Theme</h1>
        </div>
        <ThemeSwitcher />
      </header>

      <main className="w-full max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {THEMES.map((theme) => (
             <div key={theme.value} className={`${theme.value !== 'default' ? `theme-${theme.value}` : ''}`}>
                <Card 
                  className={`cursor-pointer transition-all h-full ${selectedTheme === theme.value ? 'ring-2 ring-primary border-primary' : 'hover:border-primary/50'}`}
                  onClick={() => handleSelectTheme(theme.value)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{theme.name}</span>
                      {selectedTheme === theme.value && <CheckCircle2 className="text-primary" />}
                    </CardTitle>
                    <CardDescription>{theme.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="pointer-events-none">
                      <Keyboard
                        layout="QWERTY"
                        theme={theme.value}
                        lastPressedKey={null}
                        text=""
                        currentCharIndex={-1}
                      />
                    </div>
                  </CardContent>
                </Card>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
