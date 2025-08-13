
// src/app/game/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Keyboard as KeyboardIcon, RefreshCw, Bot, Settings, ChevronDown, Palette, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/theme-switcher";

import Game from "@/components/keystroke-symphony/game";
import AdBanner from "@/components/keystroke-symphony/ad-banner";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function GamePage() {
  const { colorTheme, setColorTheme } = useTheme();
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedColorTheme = localStorage.getItem('color-theme') as any;
    if(savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <h1 className="text-2xl font-bold mb-4">Unsupported Device</h1>
        <p className="max-w-md">
          Keystroke Symphony is designed for desktop browsers. Please visit on a computer for the full experience.
        </p>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 md:p-8 justify-center items-center">
        <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Keystroke Symphony</h1>
            <span className="text-xl sm:text-2xl font-semibold text-muted-foreground">/ Game</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                Practice Mode
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <ThemeSwitcher />
             <Link href="/info">
              <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
              </Button>
            </Link>
            <a href="https://github.com/firebase/genkit/tree/main/studio/samples/keystroke-symphony" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </Button>
            </a>
          </div>
        </header>

        <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 flex-1">
          <Card className="shadow-lg border-primary/20 h-full flex flex-col">
            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
              <Game />
            </CardContent>
          </Card>
          <AdBanner />
        </main>
      </div>
    </TooltipProvider>
  );
}
