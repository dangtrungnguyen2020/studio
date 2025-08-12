"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface TypingTestProps {
  text: string;
  onComplete: (stats: { wpm: number; accuracy: number; errors: Map<string, number> }) => void;
  onKeyPress: (key: string | null) => void;
  onCharIndexChange: (index: number) => void;
}

const TypingTest = ({ text, onComplete, onKeyPress, onCharIndexChange }: TypingTestProps) => {
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [errorsMap, setErrorsMap] = useState<Map<string, number>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);
  const currentIndex = userInput.length;

  const reset = useCallback(() => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setErrorsMap(new Map());
    onCharIndexChange(0);
    onKeyPress(null);
  }, [onKeyPress, onCharIndexChange]);

  useEffect(() => {
    reset();
  }, [text, reset]);
  
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    onKeyPress(e.key);
    
    if (e.key === "Escape") {
      e.preventDefault();
      return;
    }

    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey && currentIndex < text.length) {
      e.preventDefault();
      if (!startTime) {
        setStartTime(Date.now());
      }
      
      const char = e.key;
      if (char !== text[currentIndex]) {
        setErrors(prev => prev + 1);
        const originalChar = text[currentIndex];
        setErrorsMap(prev => {
          const newMap = new Map(prev);
          newMap.set(originalChar, (newMap.get(originalChar) || 0) + 1);
          return newMap;
        });
      }

      setUserInput(prev => prev + char);
      onCharIndexChange(currentIndex + 1);
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      if (currentIndex > 0) {
        // We need to check if the character being removed was an error or not.
        // This is a simplification; a more accurate approach might store error indices.
        // For now, let's assume accuracy recalculation handles this implicitly.
        setUserInput(prev => prev.slice(0, -1));
        onCharIndexChange(currentIndex - 1);
      }
    }
  };

  useEffect(() => {
    onCharIndexChange(userInput.length);
    if (startTime) {
      const elapsedTime = (Date.now() - startTime) / 1000 / 60; // in minutes
      if (elapsedTime > 0) {
        const wordsTyped = userInput.length / 5;
        const calculatedWpm = Math.round(wordsTyped / elapsedTime);
        setWpm(calculatedWpm);
        
        // Recalculate errors based on current userInput
        let currentErrors = 0;
        for (let i = 0; i < userInput.length; i++) {
          if (userInput[i] !== text[i]) {
            currentErrors++;
          }
        }
        setErrors(currentErrors);

        const calculatedAccuracy = Math.max(0, Math.round(((userInput.length - currentErrors) / userInput.length) * 100));
        setAccuracy(userInput.length > 0 ? calculatedAccuracy : 100);
      }
    }
    
    if (userInput.length === text.length && text.length > 0) {
      onComplete({ wpm, accuracy, errors: errorsMap });
    }
  }, [userInput, text, startTime, onComplete, wpm, accuracy, errorsMap, onCharIndexChange]);
  
  return (
    <div onClick={() => inputRef.current?.focus()}>
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-2xl font-mono text-primary">{wpm} WPM</div>
        <div className="text-2xl font-mono text-primary">{accuracy}% ACC</div>
      </div>
      <Card className="relative bg-muted/30">
        <CardContent className="p-4 sm:p-6">
          <div className="text-xl sm:text-2xl tracking-wider leading-relaxed font-mono select-none">
            {text.split('').map((char, index) => {
              let charState: 'correct' | 'incorrect' | 'current' | 'pending' = 'pending';

              if (index < currentIndex) {
                charState = userInput[index] === char ? 'correct' : 'incorrect';
              } else if (index === currentIndex) {
                charState = 'current';
              }

              return (
                <span key={index} className={cn({
                  'text-primary': charState === 'correct',
                  'text-destructive': charState === 'incorrect',
                  'text-muted-foreground': charState === 'pending',
                  'relative': charState === 'current',
                })}>
                  {charState === 'current' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent animate-pulse" />}
                  {char}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="absolute inset-0 opacity-0 w-full h-full cursor-default"
            onKeyDown={handleKeyDown}
            value={userInput}
            onChange={() => {}} // React requires onChange for controlled components
            onBlur={() => inputRef.current?.focus()}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingTest;
