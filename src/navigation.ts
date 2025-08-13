import {createSharedPathnamesNavigation} from 'next-intl/navigation';

export const locales = ['en', 'vi', 'es', 'fr', 'de', 'zh', 'hi', 'ar', 'pt', 'ru', 'ja'] as const;
export const localePrefix = 'always'; // Default

export const {Link, redirect, usePathname, useRouter} =
  createSharedPathnamesNavigation({locales, localePrefix});
