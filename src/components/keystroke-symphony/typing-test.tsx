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

type TextNode = {
  type: "error" | "text" | "remaining";
  text: string;
};
type TestResult = {
  textNodes: Array<TextNode>;
  errorsMap: Map<string, number>;
};

const TypingTest = ({
  text,
  onComplete,
  onKeyPress,
  onCharIndexChange,
}: TypingTestProps) => {
  const t = useTranslations("TypingTest");
  const [userInput, setUserInput] = useState<string>("");
  const [textNodes, setTextNodes] = useState<Array<TextNode>>([
    { type: "remaining", text },
  ]);
  const [wordsInput, setWordsInput] = useState<Array<string>>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsMap, setErrorsMap] = useState<Map<string, number>>(new Map());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTextRef = useRef<HTMLSpanElement>(null);

  const words = useMemo(() => text.split(" "), [text]);
  const isSpecialTraining = useMemo(
    () => words.every((word) => word.startsWith("Arrow")),
    [words]
  );

  const resetTest = useCallback(() => {
    setUserInput("");
    // setInputHtml(null);
    setTextNodes([{ type: "remaining", text }]);
    setWordsInput([]);
    setStartTime(null);
    setErrorsMap(new Map());
    onCharIndexChange(0);
    onKeyPress(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [text]);

  useEffect(() => {
    resetTest();
  }, [text]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const totalLength = isSpecialTraining ? words.length : text.length;

    if (
      (userInput.length === totalLength || wordsInput.length === totalLength) &&
      totalLength > 0 &&
      startTime
    ) {
      const endTime = Date.now();
      const durationInMinutes = (endTime - startTime) / 1000 / 60;
      // const wordsTyped = isSpecialTraining ? totalLength : text.length / 5;
      const wpm = Math.round(totalLength / durationInMinutes);
      onComplete({ wpm, accuracy, errors: errorsMap });
    }
  }, [userInput, wordsInput]);

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
        // activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() =>
          container.scrollTo({
            top: activeElement.offsetTop - container.clientHeight / 2,
            behavior: "smooth",
          })
        );
      }
    }
  }, [userInput, wordsInput, currentTextRef]);

  const wpm = useMemo(() => {
    if (!startTime || userInput.length === 0) return 0;
    const durationInMinutes = (Date.now() - startTime) / 1000 / 60;
    const wordsTyped = isSpecialTraining
      ? userInput.length
      : userInput.length / 5;
    return Math.round(wordsTyped / durationInMinutes);
  }, [startTime, userInput, isSpecialTraining]);

  const errors = useMemo(() => {
    return Array.from(errorsMap.values()).reduce((a, c) => a + c, 0);
  }, [errorsMap]);

  const accuracy = useMemo(() => {
    const inputLength = isSpecialTraining
      ? wordsInput.length
      : userInput.length;
    if (inputLength === 0) return 100;

    return Math.round(((inputLength - errors) / inputLength) * 100);
  }, [userInput, errors]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isTypingKey = e.key.length === 1 || e.key.startsWith("Arrow");

    if (isTypingKey && isSpecialTraining && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const char = e.key;
      if (!startTime && char) {
        setStartTime(Date.now());
      }
      onKeyPress(
        e.key != "Process" ? e.key : String.fromCharCode(e.keyCode || e.which)
      );

      if (char != words[wordsInput.length]) {
        const word = words[wordsInput.length];
        setErrorsMap((prev) => {
          const newMap = new Map(prev);
          newMap.set(word, (newMap.get(word) || 0) + 1);
          return newMap;
        });
      }
      onCharIndexChange(wordsInput.length + 1);
      setWordsInput((current) => [...current, char]);
    }
  };

  const buildTrainingTest = (expected: string, input: string): TestResult => {
    const results: Array<TextNode> = [];
    const errorMap: Map<string, number> = new Map();
    let currentText = "";
    let type = "text";
    let check = true;
    let i = 0;
    while (check && i < expected.length) {
      if (i < input.length) {
        let char = expected[i];
        if (char == input[i]) {
          if (type == "text") currentText += char;
          else {
            currentText &&
              results.push({ type, text: currentText } as TextNode);
            currentText = "" + char;
            type = "text";
          }
        } else {
          errorMap.set(char, (errorMap.get(char) || 0) + 1);
          if (type == "error") currentText += char;
          else {
            currentText &&
              results.push({ type, text: currentText } as TextNode);
            currentText = "" + char;
            type = "error";
          }
        }
        i++;
      } else {
        currentText && results.push({ type, text: currentText } as TextNode);
        results.push({ type: "remaining", text: expected.slice(i) });
        check = false;
      }
    }
    return { textNodes: results, errorsMap: errorMap };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.currentTarget.value;
    const index = inputValue.length - 1;
    e.preventDefault();
    onKeyPress(e.target.value[index]);

    if (!startTime && inputValue?.length > 0) {
      setStartTime(Date.now());
    }

    if (!isSpecialTraining) {
      const { textNodes, errorsMap }: TestResult = buildTrainingTest(
        text,
        inputValue
      );
      setTextNodes(textNodes);
      setErrorsMap(errorsMap);
    }
    setUserInput(inputValue);
    onCharIndexChange(index + 1);
  };

  const renderTest = () => {
    const currentIndex = userInput.length;
    return (
      <p className="h8 text-primary">
        {textNodes.map((textNode, index) =>
          textNode.type != "remaining" ? (
            <span
              key={index}
              className={
                textNode.type == "error" ? "bg-destructive/20 rounded-sm" : ""
              }
            >
              {textNode.text}
            </span>
          ) : (
            <span key={index} className="text-muted-foreground">
              <span
                ref={currentTextRef}
                className="relative inline-block after:content-[''] after:block after:absolute after:h-[2px] after:bg-accent after:w-full after:mt-0 after:bottom-1"
              >
                {textNode.text.slice(0, 1)}
              </span>
              {textNode.text.slice(1)}
            </span>
          )
        )}
      </p>
    );
  };

  const renderSpecialTraining = () => {
    return (
      <>
        {words.map((char, index) => {
          let charState: "correct" | "incorrect" | "current" | "pending" =
            "pending";

          if (index < wordsInput.length) {
            charState = wordsInput[index] === char ? "correct" : "incorrect";
          } else if (index === wordsInput.length) {
            charState = "current";
          }
          return (
            <span
              key={index}
              ref={charState === "current" ? currentTextRef : null}
              className={cn("m-2 bg-secondary rounded-md", {
                // Added flex properties for alignment
                "bg-primary/20": charState === "correct",
                "bg-destructive/20": charState === "incorrect",
                // "text-muted-foreground": charState === "pending",
                "border border-primary": charState === "current",
              })}
            >
              {arrowKeyIcons[char]}
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
            isSpecialTraining
              ? "justify-center items-center"
              : "font-mono text-xl sm:text-2xl"
          )}
        >
          {isSpecialTraining ? renderSpecialTraining() : renderTest()}
          <textarea
            id="userInput"
            ref={inputRef}
            className="absolute inset-0 opacity-0 w-full h-full p-4 cursor-default"
            onKeyDown={handleKeyDown}
            onChange={handleInputChange}
            value={userInput} // Input is controlled differently for this component
            onBlur={() => {
              if (startTime) inputRef.current?.focus();
            }}
            autoFocus
            tabIndex={-1}
          ></textarea>
        </CardContent>
      </Card>
    </div>
  );
};

export default TypingTest;
