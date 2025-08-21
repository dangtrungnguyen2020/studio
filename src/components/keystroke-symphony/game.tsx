// src/components/keystroke-symphony/game.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generate } from "@/lib/words";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Difficulty } from "@/lib/keyboards";
import { useTranslations } from "next-intl";

type Word = {
  id: number;
  text: string;
  y: number;
  x: number;
};

type GameStatus = "waiting" | "playing" | "lost";

const Game = () => {
  const t = useTranslations("Game");
  const [status, setStatus] = useState<GameStatus>("waiting");
  const [health, setHealth] = useState(100);
  const [words, setWords] = useState<Word[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const inputRef = useRef<HTMLInputElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const wordIdCounter = useRef(0);

  const getWord = useCallback(() => {
    let currentDifficulty: Difficulty = difficulty;
    if (level > 5 && difficulty === "very-easy") currentDifficulty = "easy";
    if (level > 5 && difficulty === "easy") currentDifficulty = "medium";
    if (level > 10 && difficulty === "medium") currentDifficulty = "hard";
    if (level > 15 && difficulty === "hard") currentDifficulty = "expert";

    const wordList = generate(currentDifficulty).split(" ");
    return wordList[Math.floor(Math.random() * wordList.length)];
  }, [level, difficulty]);

  const startGame = useCallback(() => {
    setStatus("playing");
    setHealth(100);
    setWords([]);
    setInputValue("");
    setScore(0);
    setLevel(1);
    setStreak(0);
    setMultiplier(1);
    wordIdCounter.current = 0;
    inputRef.current?.focus();
  }, []);

  // Game loop
  useEffect(() => {
    if (status === "playing") {
      inputRef.current?.focus();

      const baseSpeed: any = {
        "very-easy": 120,
        easy: 100,
        medium: 90,
        hard: 80,
        expert: 70,
        custom: 100,
      };

      const wordFallSpeed = baseSpeed[difficulty] - level * 1.5;
      const wordFrequency = 0.1 + level * 0.01;

      gameLoopRef.current = setInterval(() => {
        // Add new word
        if (Math.random() < wordFrequency) {
          const newWord: Word = {
            id: wordIdCounter.current++,
            text: getWord(),
            y: 0,
            x: Math.random() * 80 + 10, // 10% to 90% of width
          };
          setWords((prev) => {
            console.log(`### game interval:`, {
              wordFallSpeed,
              wordFrequency,
              wcount: prev.length,
            });
            return [...prev, newWord];
          });
        }

        // Move words
        setWords((prevWords) =>
          prevWords
            .map((word) => ({ ...word, y: word.y + 0.5 })) // Adjust speed
            .filter((word) => {
              if (word.y >= 100) {
                // Word reached the bottom
                setHealth((h) => Math.max(0, h - 10));
                setStreak(0); // Reset streak
                setMultiplier(1);
                return false;
              }
              return true;
            })
        );
      }, Math.max(wordFallSpeed, 20)); // Ensure interval doesn't get too fast
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [status, level, getWord, difficulty]);

  // Check for game over
  useEffect(() => {
    if (health <= 0) {
      setStatus("lost");
    }
  }, [health]);

  // Increase level based on score
  useEffect(() => {
    const newLevel = Math.floor(score / 100) + 1;
    if (newLevel > level) {
      setLevel(newLevel);
    }
  }, [score, level]);

  // Update multiplier based on streak
  useEffect(() => {
    const newMultiplier = Math.floor(streak / 5) + 1;
    setMultiplier(newMultiplier);
  }, [streak]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(" ")) {
      const typedWord = value.trim();
      const matchedWordIndex = words.findIndex(
        (w) => w.text.toLowerCase() === typedWord.toLowerCase()
      );

      if (matchedWordIndex !== -1) {
        setWords((prev) =>
          prev.filter((_, index) => index !== matchedWordIndex)
        );
        setScore((s) => s + typedWord.length * multiplier);
        setStreak((s) => s + 1);
        setInputValue("");
      } else {
        // Incorrect word, reset streak
        setStreak(0);
        setMultiplier(1);
      }
    } else {
      setInputValue(value);
    }
  };

  if (status === "waiting") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center h-full text-center p-4">
        <h2 className="text-2xl font-bold mb-4">{t("title")}</h2>
        <p className="mb-6 max-w-md">{t("description")}</p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <Select
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as Difficulty)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("selectDifficulty")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="very-easy">{t("veryEasy")}</SelectItem>
              <SelectItem value="easy">{t("easy")}</SelectItem>
              <SelectItem value="medium">{t("medium")}</SelectItem>
              <SelectItem value="hard">{t("hard")}</SelectItem>
              <SelectItem value="expert">{t("expert")}</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={startGame}>{t("startGame")}</Button>
        </div>
      </div>
    );
  }

  if (status === "lost") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center h-full text-center p-4">
        <h2 className="text-3xl font-bold mb-4">{t("gameOver")}</h2>
        <p className="text-xl mb-2">{t("finalScore", { score })}</p>
        <p className="mb-6">{t("gameOverDesc")}</p>
        <Button onClick={() => setStatus("waiting")}>{t("playAgain")}</Button>
      </div>
    );
  }

  return (
    <Card
      className="w-full h-full flex flex-col flex-1 p-4"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Health Bar, Score, etc. */}
      <div className="flex justify-between items-center mb-4 gap-4">
        <div>
          <label className="text-sm font-semibold">{t("health")}</label>
          <Progress value={health} className="w-32 sm:w-48" />
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-xs text-muted-foreground">
            {t("level", { level })}
          </div>
        </div>
        <div className="text-right">
          <label className="text-sm font-semibold">
            {t("streak", { streak })}
          </label>
          <div className="text-lg font-bold text-primary">{multiplier}x</div>
        </div>
      </div>

      {/* Game Area */}
      <div className="relative flex-1 bg-muted/30 rounded-md overflow-hidden border">
        {words.map((word) => (
          <span
            key={word.id}
            className="absolute font-mono bg-card text-card-foreground px-2 py-1 rounded shadow-md"
            style={{
              top: `${word.y}%`,
              left: `${word.x}%`,
              transform: "translateX(-50%)",
              transition: "top 0.1s linear",
            }}
          >
            {word.text}
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="mt-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-2 text-center text-lg font-mono rounded-md border bg-background"
          placeholder={t("placeholder")}
          autoFocus
          disabled={status !== "playing"}
        />
      </div>
    </Card>
  );
};

export default Game;
