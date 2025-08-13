
"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Bot, Loader2 } from "lucide-react";
import { getAIPoweredExercises, saveTestResults } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Difficulty } from "@/lib/keyboards";
import type { PersonalizedExercisesOutput } from "@/ai/flows/personalized-typing-exercises";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";


interface ResultsProps {
  stats: {
    wpm: number;
    accuracy: number;
    errors: Map<string, number>;
  };
  isOpen: boolean;
  onClose: () => void;
  onRestart: () => void;
  difficulty: Difficulty;
}

const Results = ({ stats, isOpen, onClose, onRestart, difficulty }: ResultsProps) => {
  const t = useTranslations('Results');
  const { toast } = useToast();
  const [user] = useAuthState(auth);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiExercises, setAiExercises] = useState<PersonalizedExercisesOutput | null>(null);

  useEffect(() => {
    if (isOpen && user) {
      const errorsObject: Record<string, number> = {};
      stats.errors.forEach((value, key) => {
        errorsObject[key] = value;
      });

      saveTestResults({
        userId: user.uid,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        errors: errorsObject,
        difficulty: difficulty,
      });
    }
  }, [isOpen, user, stats, difficulty]);

  useEffect(() => {
    // Reset AI exercises when the dialog is opened for new results
    if (isOpen) {
      setAiExercises(null);
    }
  }, [isOpen]);


  const handleGetAIExercises = async () => {
    setIsLoadingAI(true);
    setAiExercises(null);
    try {
      let typingPatterns = "User completed a typing test. ";
      if (stats.errors.size > 0) {
        const errorEntries = Array.from(stats.errors.entries())
                                  .sort((a,b) => b[1] - a[1])
                                  .slice(0, 5);
        const commonErrors = errorEntries.map(([char, count]) => `'${char === ' ' ? 'space' : char}' (${count} times)`).join(', ');
        typingPatterns += `They made frequent mistakes on the following keys: ${commonErrors}. `;
      } else {
        typingPatterns += "They made no mistakes. ";
      }
      typingPatterns += `The user's WPM was ${stats.wpm}. Focus on improving speed and maintaining accuracy.`;
      
      const result = await getAIPoweredExercises({
        typingPatterns,
        difficultyLevel: difficulty,
      });
      setAiExercises(result);
    } catch (error) {
      console.error("AI generation failed:", error);
      toast({
        variant: "destructive",
        title: t('aiError'),
        description: t('aiErrorDesc'),
      });
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-center text-primary">{t('title')}</DialogTitle>
          <DialogDescription className="text-center">{t('description')}</DialogDescription>
        </DialogHeader>
        
        <div className="flex justify-around text-center my-4">
          <div>
            <p className="text-sm text-muted-foreground">{t('wpm')}</p>
            <p className="text-4xl font-bold text-primary">{stats.wpm}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{t('accuracy')}</p>
            <p className="text-4xl font-bold text-primary">{stats.accuracy}%</p>
          </div>
        </div>

        <div className="my-4">
          <Button onClick={handleGetAIExercises} disabled={isLoadingAI} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
            {isLoadingAI ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Bot className="mr-2 h-4 w-4" />
            )}
            {t('getAIExercises')}
          </Button>
        </div>

        {isLoadingAI && <div className="text-center text-muted-foreground">{t('generatingPlan')}</div>}

        {aiExercises && (
          <Card className="mt-4 bg-muted/30">
            <ScrollArea className="h-48 p-4">
              <h4 className="font-semibold mb-2 text-primary">{aiExercises.explanation}</h4>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                {aiExercises.exercises.map((exercise, index) => (
                  <li key={index} className="font-mono">{exercise}</li>
                ))}
              </ul>
            </ScrollArea>
          </Card>
        )}

        <DialogFooter className="sm:justify-center mt-6">
          <Button onClick={onRestart}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('tryAgain')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Results;
