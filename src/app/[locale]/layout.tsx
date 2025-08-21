import type { Metadata } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

export const metadata: Metadata = {
  title: "Keystroke Symphony",
  description: "A modern typing trainer to elevate your keyboard skills.",
  manifest: "/manifest.webmanifest",
};

export default async function RootLayout({
  children,
  params: _params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const params = await _params;
  const messages = await getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-7533423449746957" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#7DF9FF" />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7533423449746957"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className="antialiased">
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
