'use client';

import {Languages} from 'lucide-react';
import {useLocale, useTranslations} from 'next-intl';
import {useRouter, usePathname, locales} from '@/navigation';

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
  const pathname = usePathname();

  const switchLocale = (nextLocale: string) => {
    router.replace(pathname, {locale: nextLocale});
  };
  
  const languageNames: Record<string, string> = {
    en: t('english'),
    vi: t('vietnamese'),
    es: t('spanish'),
    fr: t('french'),
    de: t('german'),
    zh: t('chinese'),
    hi: t('hindi'),
    ar: t('arabic'),
    pt: t('portuguese'),
    ru: t('russian'),
    ja: t('japanese'),
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Languages className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('language')}</span>
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
