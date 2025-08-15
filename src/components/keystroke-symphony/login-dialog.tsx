// src/components/keystroke-symphony/login-dialog.tsx
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaGoogle, FaFacebook, FaLinkedin, FaApple } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

const LoginDialog = () => {
  const t = useTranslations("LoginPage");
  const tHome = useTranslations("HomePage");
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider | TwitterAuthProvider) => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: t('signInSuccess'),
        description: t('signInSuccessDesc'),
      });
      setOpen(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{tHome('login')}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl">{t('title')}</DialogTitle>
          <DialogDescription>{t('description')}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          {error && <p className="text-destructive text-center text-sm pt-2">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
