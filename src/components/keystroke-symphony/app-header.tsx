// src/components/keystroke-symphony/app-header.tsx
'use client';

import Link from 'next/link';
import {
  Settings,
  Info,
  Gamepad2,
  BookOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeSwitcher } from '@/components/theme-switcher';
import LanguageSwitcher from '@/components/language-switcher';
import LoginDialog from '@/components/keystroke-symphony/login-dialog';
import UserMenu from '@/components/keystroke-symphony/user-menu';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useTranslations } from 'next-intl';

type AppHeaderProps = {
  page: 'home' | 'game' | 'info';
};

export default function AppHeader({ page }: AppHeaderProps) {
  const [user] = useAuthState(auth);
  const tHome = useTranslations('HomePage');
  const tGame = useTranslations('GamePage');
  const tSettings = useTranslations('ThemeSwitcher');

  const title = page === 'game' ? tGame('title') : tHome('title');
  const subtitle = page === 'game' ? tGame('subtitle') : undefined;

  return (
    <header className="w-full max-w-5xl mx-auto flex justify-between items-center my-6 px-4 sm:px-0">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary">
          {title}
        </h1>
        {subtitle && (
           <span className="text-xl sm:text-2xl font-semibold text-muted-foreground">
              {subtitle}
            </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        {page === 'home' && (
           <Link href="/game">
              <Button variant="outline">
                <Gamepad2 className="mr-2 h-4 w-4" />
                {tHome("gameMode")}
              </Button>
            </Link>
        )}
        {page === 'game' && (
           <Link href="/">
              <Button variant="outline">
                <BookOpen className="mr-2 h-4 w-4" />
                {tGame("practiceMode")}
              </Button>
            </Link>
        )}
        {user ? <UserMenu /> : <LoginDialog />}
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
            {page !== 'info' && (
                <>
                <DropdownMenuSeparator />
                <Link href="/info">
                  <Button variant="ghost" className="w-full justify-start">
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Button>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
