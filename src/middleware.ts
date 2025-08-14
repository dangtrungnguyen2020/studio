
import {NextRequest, NextResponse} from 'next/server';
import {locales} from './i18n';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const {nextUrl} = request;

  if (
    nextUrl.pathname.startsWith('/_next') ||
    nextUrl.pathname.includes('/api/') ||
    PUBLIC_FILE.test(nextUrl.pathname)
  ) {
    return;
  }

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;

  if (!cookieLocale || !locales.includes(cookieLocale)) {
    const response = NextResponse.next();
    response.cookies.set('NEXT_LOCALE', 'en', {path: '/'});
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next).*)'],
};
