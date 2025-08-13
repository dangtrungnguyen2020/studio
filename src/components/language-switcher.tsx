
'use client';

import {Languages} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {locales} from '@/navigation';
import {useRouter} from 'next/navigation';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from './ui/scroll-area';

export default function LanguageSwitcher() {
  const t = useTranslations('LanguageSwitcher');
  const locale = useLocale();
  const router = useRouter();

  const switchLocale = (nextLocale: string) => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; SameSite=Lax`;
    router.refresh();
  };
  
  const languageNames: Record<string, string> = {
    en: 'English',
    vi: 'Tiếng Việt',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    zh: '中文',
    hi: 'हिन्दी',
    ar: 'العربية',
    pt: 'Português',
    ru: 'Русский',
    ja: '日本語',
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start">
          <Languages className="h-[1.2rem] w-[1.2rem] mr-2" />
          <span>{t('language')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <ScrollArea className="h-64">
          {locales.map((l) => (
            <DropdownMenuItem
              key={l}
              onClick={() => switchLocale(l)}
              disabled={locale === l}
            >
              {languageNames[l]}
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
