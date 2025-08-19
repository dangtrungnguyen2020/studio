// src/components/keystroke-symphony/typing-test.tsx
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

interface TypingTestProps {
  text: string;
  onComplete: (stats: {
    wpm: number;
    accuracy: number;
    errors: Map<string, number>;
  }) => void;
  onKeyPress: (key: string | null) => void;
  onCharIndexChange: (index: number) => void;
}

const arrowKeyIcons: { [key: string]: React.ReactNode } = {
  ArrowUp: <ArrowUp className="inline-block h-6 w-6" />,
  ArrowDown: <ArrowDown className="inline-block h-6 w-6" />,
  ArrowLeft: <ArrowLeft className="inline-block h-6 w-6" />,
  ArrowRight: <ArrowRight className="inline-block h-6 w-6" />,
};

const TypingTest = ({
  text,
  onComplete,
  onKeyPress,
  onCharIndexChange,
}: TypingTestProps) => {
  const t = useTranslations("TypingTest");
  const [userInput, setUserInput] = useState<string[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errors, setErrors] = useState(0);
  const [errorsMap, setErrorsMap] = useState<Map<string, number>>(new Map());
  const inputRef = useRef<HTMLInputElement>(null);

  const words = useMemo(() => text.split(" "), [text]);
  const isArrowTraining = useMemo(() => words.every(word => word.startsWith("Arrow")), [words]);

  const currentIndex = userInput.length;

  const resetTest = useCallback(() => {
    setUserInput([]);
    setStartTime(null);
    setErrors(0);
    setErrorsMap(new Map());
    onCharIndexChange(0);
    onKeyPress(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [onCharIndexChange, onKeyPress]);

  useEffect(() => {
    resetTest();
  }, [text, resetTest]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    onKeyPress(e.key);

    if (e.key === "Escape") {
      resetTest();
      return;
    }

    if (currentIndex >= (isArrowTraining ? words.length : text.length) && e.key !== "Backspace") {
      return;
    }

    if (!startTime && (e.key.length === 1 || e.key.startsWith("Arrow")) && !e.ctrlKey && !e.metaKey && !e.altKey) {
      setStartTime(Date.now());
    }

    if (e.key === "Backspace") {
      if (currentIndex > 0) {
        setUserInput((prev) => prev.slice(0, -1));
        onCharIndexChange(currentIndex - 1);
      }
      return;
    }

    const isTypingKey = e.key.length === 1 || e.key.startsWith("Arrow");

    if (isTypingKey && !e.ctrlKey && !e.metaKey) {
      const char = e.key;
      const targetChar = isArrowTraining ? words[currentIndex] : text[currentIndex];

      if (char !== targetChar) {
        setErrors((prev) => prev + 1);
        const originalChar = targetChar;
        setErrorsMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(originalChar, (newMap.get(originalChar) || 0) + 1);
          return newMap;
        });
      }

      setUserInput((prev) => [...prev, char]);
      onCharIndexChange(currentIndex + 1);
    }
  };

  useEffect(() => {
    const totalLength = isArrowTraining ? words.length : text.length;
    if (userInput.length === totalLength && totalLength > 0 && startTime) {
      const endTime = Date.now();
      const durationInMinutes = (endTime - startTime) / 1000 / 60;
      const wordsTyped = (isArrowTraining ? totalLength : text.length / 5);
      const wpm = Math.round(wordsTyped / durationInMinutes);
      const accuracy = Math.round(((totalLength - errors) / totalLength) * 100);
      onComplete({ wpm, accuracy, errors: errorsMap });
    }
  }, [userInput, words, text, isArrowTraining, startTime, errors, errorsMap, onComplete]);

  const wpm = useMemo(() => {
    if (!startTime || userInput.length === 0) return 0;
    const durationInMinutes = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = isArrowTraining ? userInput.length : userInput.length / 5;
    return Math.round(wordsTyped / durationInMinutes);
  }, [startTime, userInput, isArrowTraining]);

  const accuracy = useMemo(() => {
    if (userInput.length === 0) return 100;
    const totalLength = isArrowTraining ? words.length : userInput.length;
    const currentErrors = isArrowTraining ? errors : errors;
    return Math.round(((userInput.length - currentErrors) / userInput.length) * 100);
  }, [userInput, errors, isArrowTraining, words.length]);

  return (
    <div
      className="flex flex-col overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex justify-between items-center mb-4 px-2">
        <div className="text-2xl font-mono text-primary">
          {wpm} {t("wpm")}
        </div>
        <div className="text-2xl font-mono text-primary">
          {accuracy}% {t("acc")}
        </div>
      </div>
      <Card className="flex-1 overflow-auto relative bg-muted/30">
        <CardContent className="p-4 sm:p-6">
          <div className="text-xl sm:text-2xl tracking-wider leading-relaxed font-mono select-none whitespace-pre-wrap flex items-center gap-x-2">
            {(isArrowTraining ? words : text.split("")).map((char, index) => {
              let charState: "correct" | "incorrect" | "current" | "pending" = "pending";

              if (index < userInput.length) {
                charState = userInput[index] === char ? "correct" : "incorrect";
              } else if (index === userInput.length) {
                charState = "current";
              }

              return (
                <span
                  key={index}
                  className={cn("flex items-center justify-center h-8", { // Added flex properties for alignment
                    "text-primary": charState === "correct",
                    "text-destructive": charState === "incorrect",
                    "text-muted-foreground": charState === "pending",
                    "relative": charState === "current",
                  })}
                >
                  {charState === "current" && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent animate-pulse" />
                  )}
                  {isArrowTraining ? (
                    arrowKeyIcons[char]
                  ) : char === " " && charState === "incorrect" ? (
                    <span className="bg-destructive/20 rounded-sm">&nbsp;</span>
                  ) : (
                    char
                  )}
                </span>
              );
            })}
          </div>
          <input
            ref={inputRef}
            type="text"
            className="absolute inset-0 opacity-0 w-full h-full cursor-default"
            onKeyDown={handleKeyDown}
            value={""} // Input is controlled differently for this component
            onChange={() => {}} // React requires onChange for controlled components
            onBlur={() => {
              if (startTime) inputRef.current?.focus();
            }}
            autoFocus
            tabIndex={-1}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingTest;
