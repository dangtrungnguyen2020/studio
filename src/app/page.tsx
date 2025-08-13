
// src/app/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Keyboard as KeyboardIcon, RefreshCw, Bot, Settings, ChevronDown, Palette, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/theme-switcher";

import Keyboard from "@/components/keystroke-symphony/keyboard";
import TypingTest from "@/components/keystroke-symphony/typing-test";
import Results from "@/components/keystroke-symphony/results";
import AdBanner from "@/components/keystroke-symphony/ad-banner";

import { generate, generateCustom } from "@/lib/words";
import { KEYBOARD_LAYOUTS } from "@/lib/keyboards";
import type { KeyboardLayout, Difficulty, KeyboardTheme } from "@/lib/keyboards";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";


type TestStats = {
  wpm: number;
  accuracy: number;
  errors: Map<string, number>;
};

export default function Home() {
  const [layout, setLayout] = useState<KeyboardLayout>("QWERTY");
  const { theme, colorTheme, setColorTheme, setTheme } = useTheme();
  const [keyboardTheme, setKeyboardTheme] = useState<KeyboardTheme>('default');
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [customText, setCustomText] = useState("");
  
  const [testText, setTestText] = useState("");
  const [testId, setTestId] = useState(0);

  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const [results, setResults] = useState<TestStats | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);
  
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])
  
  useEffect(() => {
    if (isClient) {
      if (difficulty === 'custom') {
        setTestText(generateCustom(customText));
      } else {
        setTestText(generate(difficulty));
      }
    }
  }, [difficulty, customText, isClient]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('keystroke-symphony-theme') as KeyboardTheme | null;
    if (savedTheme) {
      setKeyboardTheme(savedTheme);
      document.body.classList.add(`theme-${savedTheme}`);
    }
    const savedColorTheme = localStorage.getItem('color-theme') as any;
    if(savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);
  
  const handleKeyboardThemeChange = (newTheme: KeyboardTheme) => {
    // remove old theme
    document.body.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        document.body.classList.remove(className);
      }
    });
    setKeyboardTheme(newTheme);
    document.body.classList.add(`theme-${newTheme}`);
    localStorage.setItem('keystroke-symphony-theme', newTheme);
  };


  const handleRestart = useCallback(() => {
    setShowResults(false);
    setResults(null);
    setCurrentCharIndex(0);
    if (difficulty === 'custom') {
      setTestText(generateCustom(customText));
    } else {
      setTestText(generate(difficulty));
    }
    setTestId(prev => prev + 1);
  }, [difficulty, customText]);
  
  const handleTestComplete = (stats: TestStats) => {
    setResults(stats);
    setShowResults(true);
  };
  
  // Effect to handle Escape key to restart test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRestart]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 md:p-8 items-center justify-center">
        <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">Keystroke Symphony</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/game">
              <Button variant="outline">
                <Gamepad2 className="mr-2 h-4 w-4" />
                Game Mode
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <ThemeSwitcher />
            <a href="https://github.com/firebase/genkit/tree/main/studio/samples/keystroke-symphony" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </Button>
            </a>
          </div>
        </header>

        <main className="w-full max-w-5xl mx-auto flex flex-col gap-8">
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 mb-6">
                 <Select value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-easy">Very Easy</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                    <SelectItem value="custom">Custom Text</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={handleRestart} variant="outline" size="sm" className="w-full sm:w-auto">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Restart Test
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Press <kbd className="bg-muted-foreground/20 px-1.5 py-0.5 rounded">Esc</kbd> to restart</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              {difficulty === 'custom' && (
                 <Textarea
                    placeholder="Paste your custom text here..."
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="min-h-[50px] mb-4"
                  />
              )}
              <TypingTest
                key={testId}
                text={testText}
                onComplete={handleTestComplete}
                onKeyPress={setLastPressedKey}
                onCharIndexChange={setCurrentCharIndex}
              />
            </CardContent>
          </Card>

          <AdBanner />

          {showKeyboard && (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <KeyboardIcon className="h-4 w-4" />
                      <span>Layout:</span>
                      <Select value={layout} onValueChange={(v) => setLayout(v as KeyboardLayout)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.keys(KEYBOARD_LAYOUTS).map(l => (
                            <SelectItem key={l} value={l}>{l}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Palette className="h-4 w-4" />
                      <span>Theme:</span>
                      <Select value={keyboardTheme} onValueChange={(v) => handleKeyboardThemeChange(v as KeyboardTheme)}>
                        <SelectTrigger className="w-[120px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Default</SelectItem>
                          <SelectItem value="retro">Retro</SelectItem>
                          <SelectItem value="80s-kid">80s Kid</SelectItem>
                          <SelectItem value="carbon">Carbon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button onClick={() => setShowKeyboard(!showKeyboard)} variant="outline" size="icon">
                          <KeyboardIcon className={cn("h-4 w-4", !showKeyboard && "text-muted-foreground/50")} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Show/Hide Keyboard</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <Keyboard
                  layout={layout}
                  theme={keyboardTheme}
                  lastPressedKey={lastPressedKey}
                  text={testText}
                  currentCharIndex={currentCharIndex}
                />
            </div>
          )}
        </main>
        
        {results && (
           <Results
            stats={results}
            isOpen={showResults}
            onClose={() => setShowResults(false)}
            onRestart={handleRestart}
            difficulty={difficulty}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
