
"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  ArrowUp: <ArrowUp className="inline-block h-7 w-7 m-3" />,
  ArrowDown: <ArrowDown className="inline-block h-7 w-7 m-3" />,
  ArrowLeft: <ArrowLeft className="inline-block h-7 w-7 m-3" />,
  ArrowRight: <ArrowRight className="inline-block h-7 w-7 m-3" />,
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
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTextRef = useRef<HTMLSpanElement>(null);

  const words = useMemo(() => text.split(" "), [text]);
  const isSpecialTraining = useMemo(
    () => words.every((word) => word.startsWith("Arrow") || !isNaN(parseInt(word))),
    [words]
  );
  
  const isArrowTraining = useMemo(
    () => words.every((word) => word.startsWith("Arrow")),
    [words]
  );

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
    
    const totalLength = isSpecialTraining ? words.length : text.length;

    if (
      currentIndex >= totalLength &&
      e.key !== "Backspace"
    ) {
      return;
    }

    if (
      !startTime &&
      (e.key.length === 1 || e.key.startsWith("Arrow")) &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      setStartTime(Date.now());
    }

    if (e.key === "Backspace") {
      // disable backspace
      return;
    }

    const isTypingKey = e.key.length === 1 || e.key.startsWith("Arrow");

    if (isTypingKey && !e.ctrlKey && !e.metaKey) {
      const char = e.key;
      const targetChar = isSpecialTraining
        ? words[currentIndex]
        : text[currentIndex];

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
    const totalLength = isSpecialTraining ? words.length : text.length;
    if (userInput.length === totalLength && totalLength > 0 && startTime) {
      const endTime = Date.now();
      const durationInMinutes = (endTime - startTime) / 1000 / 60;
      const wordsTyped = isSpecialTraining ? totalLength : text.length / 5;
      const wpm = Math.round(wordsTyped / durationInMinutes);
      const accuracy = Math.round(((totalLength - errors) / totalLength) * 100);
      onComplete({ wpm, accuracy, errors: errorsMap });
    }
  }, [userInput]);
  
  useEffect(() => {
    if (containerRef.current && currentTextRef.current) {
        const container = containerRef.current;
        const activeElement = currentTextRef.current;

        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();

        const isVisible =
            elementRect.top >= containerRect.top &&
            elementRect.bottom <= containerRect.bottom;

        if (!isVisible) {
            activeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}, [currentIndex]);

  const wpm = useMemo(() => {
    if (!startTime || userInput.length === 0) return 0;
    const durationInMinutes = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = isSpecialTraining
      ? userInput.length
      : userInput.length / 5;
    return Math.round(wordsTyped / durationInMinutes);
  }, [startTime, userInput, isSpecialTraining]);

  const accuracy = useMemo(() => {
    if (userInput.length === 0) return 100;
    const currentErrors = errors;
    return Math.round(
      ((userInput.length - currentErrors) / userInput.length) * 100
    );
  }, [userInput, errors]);

  const renderText = () => {
    const chars = text.split('');
    return (
      <>
        {chars.map((char, index) => {
          let charState: "correct" | "incorrect" | "current" | "pending" = "pending";
          if (index < currentIndex) {
            charState = userInput[index] === char ? "correct" : "incorrect";
          } else if (index === currentIndex) {
            charState = "current";
          }

          return (
            <span
              key={index}
              ref={charState === "current" ? currentTextRef : null}
              className={cn({
                "text-primary": charState === "correct",
                "text-destructive": charState === "incorrect",
                "text-muted-foreground": charState === "pending",
                "relative after:content-[''] after:block after:absolute after:h-[2px] after:bg-accent after:w-full after:bottom-0": charState === 'current'
              })}
            >
              {char === " " && (charState === "incorrect" || charState === "pending" || charState === "current") ? 
                <span className={cn("rounded-sm", {"bg-destructive/20": charState === "incorrect"})}>&nbsp;</span> : char}
            </span>
          );
        })}
      </>
    );
  };

  const renderSpecialTraining = () => {
    const items = words;
    return (
      <>
        {items.map((item, index) => {
          let itemState: "correct" | "incorrect" | "current" | "pending" = "pending";

          if (index < userInput.length) {
            itemState = userInput[index] === item ? "correct" : "incorrect";
          } else if (index === userInput.length) {
            itemState = "current";
          }
          const isArrow = item.startsWith('Arrow');
          return (
            <span
              key={index}
              ref={itemState === "current" ? currentTextRef : null}
              className={cn("m-2 bg-secondary rounded-md", {
                "bg-primary/20": itemState === "correct",
                "bg-destructive/20": itemState === "incorrect",
                "border border-primary": itemState === "current",
              })}
            >
              {isArrow ? arrowKeyIcons[item] : <span className="inline-block p-4 font-mono text-2xl">{item}</span>}
            </span>
          );
        })}
      </>
    );
  };

  return (
    <div
      className="flex flex-col flex-1 overflow-hidden"
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
      <Card
        ref={containerRef}
        className="p-4 flex-1 flex-wrap overflow-y-auto relative bg-muted/30"
      >
        <CardContent
          className={cn(
            "p-0 tracking-wider leading-relaxed select-none whitespace-pre-wrap flex flex-wrap",
            isSpecialTraining ? "justify-center items-center" : "font-mono text-xl sm:text-2xl"
          )}
        >
          {isSpecialTraining ? renderSpecialTraining() : renderText()}
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
