"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Difficulty } from "@/lib/keyboards";

interface TypingTestProps {
  difficulty: Difficulty;
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
  type: "error" | "text" | "remaining" | "current";
  text: string;
};

type WordNode = Array<TextNode>;

type TestResult = {
  textNodes: Array<WordNode>;
  errorsMap: Map<string, number>;
};

const TypingTest = ({
  text,
  difficulty,
  onComplete,
  onKeyPress,
  onCharIndexChange,
}: TypingTestProps) => {
  const t = useTranslations("TypingTest");
  const [userInput, setUserInput] = useState<string>("");
  const [wordNodes, setWordNodes] = useState<Array<WordNode>>([
    // [{ type: "remaining", text }],
  ]);
  const [wordsInput, setWordsInput] = useState<Array<string>>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [errorsMap, setErrorsMap] = useState<Map<string, number>>(new Map());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTextRef = useRef<HTMLSpanElement>(null);

  const words = useMemo(() => text.split(" "), [text]);
  const isSpecialTraining = useMemo(
    // () => words.every((word) => word.startsWith("Arrow")),
    () =>
      ["very-easy", "arrow-training", "numpad-training"].includes(difficulty),
    [difficulty]
  );

  const resetTest = useCallback(() => {
    setUserInput("");
    const { textNodes, errorsMap }: TestResult = buildTrainingTest(text, "");
    setWordNodes(textNodes);
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
    const { textNodes, errorsMap }: TestResult = buildTrainingTest(text, "");
    setWordNodes(textNodes);
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
    const totalLength = isSpecialTraining
      ? wordsInput.length
      : userInput.length;
    if (!startTime || totalLength === 0) return 0;
    const durationInMinutes = (Date.now() - startTime) / 1000 / 60;
    return Math.round(totalLength / durationInMinutes);
  }, [userInput, wordsInput]);

  const errors = useMemo(() => {
    return Array.from(errorsMap.values()).reduce((a, c) => a + c, 0);
  }, [errorsMap]);

  const accuracy = useMemo(() => {
    const inputLength = isSpecialTraining
      ? wordsInput.length
      : userInput.length;
    if (inputLength === 0) return 100;

    return Math.round(((inputLength - errors) / inputLength) * 100);
  }, [errors]);

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
      if (wordsInput.length >= words.length) return;
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

  const buildTrainingTest = (target: string, input: string): TestResult => {
    const results: Array<WordNode> = [];
    const errorMap: Map<string, number> = new Map();
    let wordNode: WordNode = (results[0] = []);
    let textNode: TextNode | null = null;
    let checkEOF = false;
    let i = 0;
    while (!checkEOF && i < target.length) {
      if (i < input.length) {
        let char = target[i];
        if (char == input[i]) {
          if (char == " ") {
            results.push([{ type: "text", text: " " }]);
            wordNode = results[results.length] = [{ type: "text", text: "" }];
            textNode = wordNode[0];
            i++;
            continue;
          }
          if (textNode && textNode.type == "text") textNode.text += char;
          else {
            textNode = wordNode[wordNode.length] = {
              type: "text",
              text: "" + char,
            };
          }
        } else {
          errorMap.set(target[i], (errorMap.get(target[i]) || 0) + 1);
          if (char == " ") {
            results.push([{ type: "error", text: " " }]);
            wordNode = results[results.length] = [{ type: "error", text: "" }];
            textNode = wordNode[0];
            i++;
            continue;
          }
          if (textNode && textNode.type == "error") textNode.text += char;
          else {
            textNode = wordNode[wordNode.length] = {
              type: "error",
              text: "" + char,
            };
          }
        }
        i++;
      } else {
        let remainingText = target.slice(i);
        const match = remainingText.match(/^(\s*\S+)([\s\S]*)$/);

        if (match) {
          if (match[1] && !match[1].startsWith(" ")) {
            wordNode[wordNode.length] = {
              type: "current",
              text: match[1],
            };
          } else {
            results.push([{ type: "current", text: match[1] }]);
          }
          results.push([{ type: "remaining", text: match[2] }]);
        }
        // }
        checkEOF = true;
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

    if (!isSpecialTraining && userInput.length < text.length) {
      const { textNodes, errorsMap }: TestResult = buildTrainingTest(
        text,
        inputValue
      );
      setWordNodes(textNodes);
      setErrorsMap(errorsMap);
      setUserInput(inputValue);
      onCharIndexChange(index + 1);
    }
  };

  const renderTest = () => {
    return (
      <p className="h8 text-primary max-w-full break-words">
        {wordNodes.map((word, index) => (
          <span key={`word-${index}`} className="text-nowrap">
            {word.map((textNode, i) =>
              textNode.type != "remaining" && textNode.type != "current" ? (
                <span
                  key={`text-${i}`}
                  className={
                    textNode.type == "error"
                      ? "bg-destructive/20 rounded-sm"
                      : ""
                  }
                >
                  {textNode.text}
                </span>
              ) : (
                <span
                  key={index}
                  className={cn("text-muted-foreground", {
                    "whitespace-break-spaces": textNode.type == "remaining",
                    current: textNode.type == "current",
                  })}
                >
                  {textNode.type == "current" ? (
                    <>
                      <span
                        ref={currentTextRef}
                        className="relative inline-block after:content-[''] after:block after:absolute after:h-[2px] after:bg-accent after:w-full after:mt-0 after:bottom-1"
                      >
                        {textNode.text.slice(0, 1)}
                      </span>
                      {textNode.text.slice(1)}
                    </>
                  ) : (
                    textNode.text
                  )}
                </span>
              )
            )}
          </span>
        ))}
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
              {difficulty == "arrow-training" ? (
                arrowKeyIcons[char]
              ) : (
                <div className="flex items-center justify-center h-7 w-7 m-3">
                  {char}
                </div>
              )}
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
