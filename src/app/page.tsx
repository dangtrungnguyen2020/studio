// src/app/page.tsx is now src/app/[locale]/page.tsx
'use server';

import {redirect} from 'next/navigation';

export default async function RootPage() {
  redirect('/en');
}
