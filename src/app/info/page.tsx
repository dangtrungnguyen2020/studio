
// src/app/info/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

export default function InfoPage() {
  const router = useRouter();
  const t = useTranslations('InfoPage');

  const features = t.raw('features') as string[];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 md:p-8 items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary text-center">{t('title')}</CardTitle>
                <CardDescription className="text-center text-muted-foreground pt-2">
                    {t('description')}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary/90">{t('featuresTitle')}</h3>
                    <ul className="space-y-2">
                        {features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-1 flex-shrink-0" />
                            <span>{feature}</span>
                        </li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary/90">{t('gettingStartedTitle')}</h3>
                    <p className="text-muted-foreground">
                        {t.rich('gettingStarted', {
                          practiceLink: (chunks) => <Link href="/"><Button variant="link" className="p-0 h-auto">{chunks}</Button></Link>,
                          gameLink: (chunks) => <Link href="/game"><Button variant="link" className="p-0 h-auto">{chunks}</Button></Link>,
                        })}
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-6">
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> {t('goBack')}
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
