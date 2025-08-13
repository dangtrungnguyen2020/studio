
// src/app/info/page.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from 'next/navigation';

const features = [
  "Practice with different keyboard layouts: QWERTY, DVORAK, and AZERTY.",
  "Generate unique typing tests every time with random text generation.",
  "Track your Words Per Minute (WPM) and accuracy.",
  "Get customized exercises based on your performance with AI-Powered Personalized Training.",
  "Adjust the challenge to match your skill level with various difficulty levels.",
  "See where you made mistakes with real-time accuracy feedback.",
  "Learn proper finger placement with finger-to-key mapping visualization.",
  "Practice with your own text using the custom text input feature.",
  "Play an engaging 'Falling Words' game to make practice fun."
];

export default function InfoPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 md:p-8 items-center justify-center">
        <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader>
                <CardTitle className="text-3xl font-bold text-primary text-center">About Keystroke Symphony</CardTitle>
                <CardDescription className="text-center text-muted-foreground pt-2">
                    An advanced typing trainer designed to elevate your keyboard skills through practice and play.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="text-xl font-semibold mb-3 text-primary/90">Features</h3>
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
                    <h3 className="text-xl font-semibold mb-3 text-primary/90">Getting Started</h3>
                    <p className="text-muted-foreground">
                        Navigate to the <Link href="/"><Button variant="link" className="p-0 h-auto">Practice</Button></Link> page to start a standard typing test, or try the <Link href="/game"><Button variant="link" className="p-0 h-auto">Game</Button></Link> mode for a more interactive experience.
                    </p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-center pt-6">
                <Button onClick={() => router.back()}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                </Button>
            </CardFooter>
        </Card>
    </div>
  );
}
