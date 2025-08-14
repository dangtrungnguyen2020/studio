
import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';
import {notFound} from 'next/navigation';

export const locales = ['en', 'vi', 'es', 'fr', 'de', 'zh', 'hi', 'ar', 'pt', 'ru', 'ja'];

export default getRequestConfig(async () => {
  // Read the locale from the cookies
  const locale = cookies().get('NEXT_LOCALE')?.value ?? 'en';

  // Validate that the locale is one of the supported locales
  if (!locales.includes(locale)) notFound();

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
