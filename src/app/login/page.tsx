
// src/app/login/page.tsx
"use client";

import { auth } from "@/lib/firebase";
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  FacebookAuthProvider,
  OAuthProvider,
  TwitterAuthProvider
} from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { FaGoogle, FaFacebook, FaLinkedin, FaApple } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const SignInPage = () => {
  const t = useTranslations("LoginPage");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider | TwitterAuthProvider) => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: t('signInSuccess'),
        description: t('signInSuccessDesc'),
      });
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: t('signInFailed'),
        description: error.message,
      });
    }
  };

  const googleProvider = new GoogleAuthProvider();
  const facebookProvider = new FacebookAuthProvider();
  const appleProvider = new OAuthProvider('apple.com');
  const twitterProvider = new TwitterAuthProvider();
  const linkedinProvider = new OAuthProvider('linkedin.com');

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => handleSignIn(googleProvider)} variant="outline">
            <FaGoogle className="mr-2 h-4 w-4" /> {t('google')}
          </Button>
          <Button onClick={() => handleSignIn(facebookProvider)} variant="outline">
            <FaFacebook className="mr-2 h-4 w-4" /> {t('facebook')}
          </Button>
           <Button onClick={() => handleSignIn(twitterProvider)} variant="outline">
            <FaXTwitter className="mr-2 h-4 w-4" /> {t('twitter')}
          </Button>
          <Button onClick={() => handleSignIn(linkedinProvider)} variant="outline">
            <FaLinkedin className="mr-2 h-4 w-4" /> {t('linkedin')}
          </Button>
          <Button onClick={() => handleSignIn(appleProvider)} variant="outline">
            <FaApple className="mr-2 h-4 w-4" /> {t('apple')}
          </Button>
          {error && <p className="text-destructive text-center text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> {t('goBack')}
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
