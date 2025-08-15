// src/app/game/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Keyboard as KeyboardIcon, RefreshCw, Bot, Settings, ChevronDown, Palette, BookOpen, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/theme-switcher";
import LanguageSwitcher from "@/components/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import Game from "@/components/keystroke-symphony/game";
import AdBanner from "@/components/keystroke-symphony/ad-banner";

import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";
import LoginDialog from "@/components/keystroke-symphony/login-dialog";

export default function GamePage() {
  const t = useTranslations('GamePage');
  const tSettings = useTranslations('ThemeSwitcher');
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
        <h1 className="text-2xl font-bold mb-4">{t('unsupportedDeviceTitle')}</h1>
        <p className="max-w-md">
          {t('unsupportedDeviceMessage')}
        </p>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 md:p-8 justify-center items-center">
        <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">{t('title')}</h1>
            <span className="text-xl sm:text-2xl font-semibold text-muted-foreground">{t('subtitle')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                {t('practiceMode')}
              </Button>
            </Link>
            <LoginDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{tSettings('appearance')}</DropdownMenuLabel>
                 <div className="px-2">
                  <ThemeSwitcher />
                </div>
                <DropdownMenuSeparator />
                 <DropdownMenuLabel>
                  <LanguageSwitcher />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/info">
                  <Button variant="ghost" className="w-full justify-start">
                      <Info className="h-4 w-4 mr-2" />
                      About
                  </Button>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="w-full max-w-5xl mx-auto flex flex-col gap-8 flex-1">
          <Card className="shadow-lg border-primary/20 h-full flex flex-col">
            <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
              <Game />
            </CardContent>
          </Card>
          {/* <AdBanner /> */}
        </main>
      </div>
    </TooltipProvider>
  );
}
