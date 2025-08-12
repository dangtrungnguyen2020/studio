
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


const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleSignIn = async (provider: GoogleAuthProvider | FacebookAuthProvider | OAuthProvider | TwitterAuthProvider) => {
    setError(null);
    try {
      await signInWithPopup(auth, provider);
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
      router.push('/');
    } catch (error: any) {
      setError(error.message);
      toast({
        variant: "destructive",
        title: "Sign in failed",
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
          <CardTitle className="text-2xl">Sign In</CardTitle>
          <CardDescription>Choose your preferred sign-in method</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button onClick={() => handleSignIn(googleProvider)} variant="outline">
            <FaGoogle className="mr-2 h-4 w-4" /> Sign in with Google
          </Button>
          <Button onClick={() => handleSignIn(facebookProvider)} variant="outline">
            <FaFacebook className="mr-2 h-4 w-4" /> Sign in with Facebook
          </Button>
           <Button onClick={() => handleSignIn(twitterProvider)} variant="outline">
            <FaXTwitter className="mr-2 h-4 w-4" /> Sign in with X
          </Button>
          <Button onClick={() => handleSignIn(linkedinProvider)} variant="outline">
            <FaLinkedin className="mr-2 h-4 w-4" /> Sign in with LinkedIn
          </Button>
          <Button onClick={() => handleSignIn(appleProvider)} variant="outline">
            <FaApple className="mr-2 h-4 w-4" /> Sign in with Apple
          </Button>
          {error && <p className="text-destructive text-center text-sm">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-center">
            <Button variant="link" onClick={() => router.push('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Go back to typing
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignInPage;
