import createMiddleware from 'next-intl/middleware';
import {locales, localePrefix} from './navigation';

export default createMiddleware({
  defaultLocale: 'en',
  locales,
  localePrefix,
});

export const config = {
  matcher: ['/', '/(vi|en|es|fr|de|zh|hi|ar|pt|ru|ja)/:path*', '/((?!_next|_vercel|.*\\..*).*)'],
};
