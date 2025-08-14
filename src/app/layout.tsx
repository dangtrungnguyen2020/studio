import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Keystroke Symphony',
  description: 'A modern typing trainer to elevate your keyboard skills.',
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
