// src/components/keystroke-symphony/app-header.tsx
'use client';

import Link from 'next/link';
import {
  Settings,
  Info,
  Gamepad2,
  BookOpen,
  Newspaper,
  ShieldCheck,
  LayoutDashboard,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useEffect, useState } from 'react';
import { getAdminUids } from '@/app/actions-for-client';

type AppHeaderProps = {
  page: 'home' | 'game' | 'info' | 'articles' | 'new-article' | 'view-article' | 'admin' | 'admin-dashboard' | 'admin-users';
};

export default function AppHeader({ page }: AppHeaderProps) {
  const [user] = useAuthState(auth);
  const tHome = useTranslations('HomePage');
  const tGame = useTranslations('GamePage');
  const tSettings = useTranslations('ThemeSwitcher');
  const tArticles = useTranslations('ArticlePage');
  const tAdmin = useTranslations('AdminPage');
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const uids = await getAdminUids();
        setIsAdmin(uids.includes(user.uid));
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [user]);


  const getTitle = () => {
    switch (page) {
      case 'game':
        return tGame('title');
      case 'articles':
      case 'new-article':
      case 'view-article':
        return tArticles.raw('title');
      case 'admin':
      case 'admin-dashboard':
      case 'admin-users':
        return tAdmin.raw('title');
      default:
        return tHome('title');
    }
  }

  const getSubtitle = () => {
     switch (page) {
      case 'game':
        return tGame('subtitle');
      case 'articles':
        return tArticles('subtitle');
       case 'new-article':
        return tArticles('newArticleSubtitle');
       case 'view-article':
         return ''
       case 'admin':
        return tAdmin('subtitle');
       case 'admin-dashboard':
        return tAdmin('dashboardSubtitle');
       case 'admin-users':
        return tAdmin('usersSubtitle');
      default:
        return undefined;
    }
  }

  const title = getTitle();
  const subtitle = getSubtitle();

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
            <DropdownMenuSeparator />
             <Link href="/articles">
                <DropdownMenuItem>
                  <Newspaper className="h-4 w-4 mr-2" />
                  {tArticles('title')}
                </DropdownMenuItem>
              </Link>
            {isAdmin && (
              <>
               <DropdownMenuSeparator />
               <DropdownMenuLabel>{tAdmin('title')}</DropdownMenuLabel>
               <Link href="/admin/dashboard">
                <DropdownMenuItem>
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  {tAdmin('dashboardTitle')}
                </DropdownMenuItem>
              </Link>
               <Link href="/admin">
                <DropdownMenuItem>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  {tAdmin('reviewTitle')}
                </DropdownMenuItem>
              </Link>
              <Link href="/admin/users">
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  {tAdmin('usersTitle')}
                </DropdownMenuItem>
              </Link>
              </>
            )}
            {page !== 'info' && (
                <>
                <DropdownMenuSeparator />
                <Link href="/info">
                   <DropdownMenuItem>
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
