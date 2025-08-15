
// src/app/page.tsx
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Keyboard as KeyboardIcon,
  RefreshCw,
  Bot,
  Settings,
  ChevronDown,
  Palette,
  Gamepad2,
  Info,
  Languages,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Keyboard from "@/components/keystroke-symphony/keyboard";
import TypingTest from "@/components/keystroke-symphony/typing-test";
import Results from "@/components/keystroke-symphony/results";
import AdBanner from "@/components/keystroke-symphony/ad-banner";
import LanguageSwitcher from "@/components/language-switcher";
import LoginDialog from "@/components/keystroke-symphony/login-dialog";

import { generate, generateCustom } from "@/lib/words";
import { KEYBOARD_LAYOUTS } from "@/lib/keyboards";
import type {
  KeyboardLayout,
  Difficulty,
  KeyboardTheme,
} from "@/lib/keyboards";
import Link from "next/link";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useTranslations } from "next-intl";

type TestStats = {
  wpm: number;
  accuracy: number;
  errors: Map<string, number>;
};

export default function Home() {
  const t = useTranslations("HomePage");
  const tSettings = useTranslations("ThemeSwitcher");

  const [layout, setLayout] = useState<KeyboardLayout>("QWERTY");
  const { theme, colorTheme, setColorTheme, setTheme } = useTheme();
  const [keyboardTheme, setKeyboardTheme] = useState<KeyboardTheme>("default");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [customText, setCustomText] = useState("");

  const [testText, setTestText] = useState("");
  const [testId, setTestId] = useState(0);

  const [lastPressedKey, setLastPressedKey] = useState<string | null>(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  const [results, setResults] = useState<TestStats | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  const isMobile = useIsMobile();

  const handleKeyboardThemeChange = (newTheme: KeyboardTheme) => {
    console.log(`### handleKeyboardThemeChange ${newTheme}`);

    // remove old theme
    document.body.classList.forEach((className) => {
      if (className.startsWith("theme-")) {
        document.body.classList.remove(className);
      }
    });
    setKeyboardTheme(newTheme);
    document.body.classList.add(`theme-${newTheme}`);
    localStorage.setItem("keystroke-symphony-theme", newTheme);
  };

  const handleRestart = useCallback(() => {
    setShowResults(false);
    setResults(null);
    setCurrentCharIndex(0);
    if (difficulty === "custom") {
      setTestText(generateCustom(customText, t));
    } else {
      setTestText(generate(difficulty));
    }
    setTestId((prev) => prev + 1);
  }, [difficulty, customText, t]);

  const handleTestComplete = (stats: TestStats) => {
    setResults(stats);
    setShowResults(true);
  };

  useEffect(() => {
    console.log(`### setTestText (${difficulty}, ${customText})`);

    if (difficulty === "custom") {
      setTestText(generateCustom(customText, t));
    } else {
      setTestText(generate(difficulty));
    }
  }, [difficulty, customText, t]);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      "keystroke-symphony-theme"
    ) as KeyboardTheme | null;
    if (savedTheme) {
      setKeyboardTheme(savedTheme);
      document.body.classList.add(`theme-${savedTheme}`);
    }
    const savedColorTheme = localStorage.getItem("color-theme") as any;
    if (savedColorTheme) {
      setColorTheme(savedColorTheme);
    }
  }, []);

  // Effect to handle Escape key to restart test
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleRestart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleRestart]);

  if (isMobile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
        <h1 className="text-2xl font-bold mb-4">
          {t("unsupportedDeviceTitle")}
        </h1>
        <p className="max-w-md">{t("unsupportedDeviceMessage")}</p>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background text-foreground flex flex-col p-4 sm:p-6 md:p-8 items-center pb-24">
        <header className="w-full max-w-5xl mx-auto flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-primary">
              {t("title")}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/game">
              <Button variant="outline">
                <Gamepad2 className="mr-2 h-4 w-4" />
                {t("gameMode")}
              </Button>
            </Link>
            <LoginDialog />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{tSettings("appearance")}</DropdownMenuLabel>
                <div className="px-2">
                  <ThemeSwitcher />
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>
                  <LanguageSwitcher />
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href="/info">
                  <Button variant="ghost" className="w-full justify-start">
                    <Info className="h-4 w-4 mr-2" />
                    About
                  </Button>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="w-full max-w-5xl mx-auto flex flex-col gap-8">
          <Card className="shadow-lg border-primary/20">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 mb-6">
                <Select
                  value={difficulty}
                  onValueChange={(v) => setDifficulty(v as Difficulty)}
                >
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder={t("selectDifficulty")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="very-easy">{t("veryEasy")}</SelectItem>
                    <SelectItem value="easy">{t("easy")}</SelectItem>
                    <SelectItem value="medium">{t("medium")}</SelectItem>
                    <SelectItem value="hard">{t("hard")}</SelectItem>
                    <SelectItem value="expert">{t("expert")}</SelectItem>
                    <SelectItem value="custom">{t("customText")}</SelectItem>
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleRestart}
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto ml-auto"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {t("restartTest")}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p
                      dangerouslySetInnerHTML={{
                        __html: t.raw("restartTooltip"),
                      }}
                    />
                  </TooltipContent>
                </Tooltip>
              </div>

              {difficulty === "custom" && (
                <Textarea
                  placeholder={t("customTextPlaceholder")}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="min-h-[50px] mb-4"
                />
              )}
              <TypingTest
                key={testId}
                text={testText}
                onComplete={handleTestComplete}
                onKeyPress={setLastPressedKey}
                onCharIndexChange={setCurrentCharIndex}
              />
            </CardContent>
          </Card>

          <AdBanner />

          <div className="flex flex-col gap-4">
            {showKeyboard && (
              <Keyboard
                layout={layout}
                theme={keyboardTheme}
                lastPressedKey={lastPressedKey}
                text={testText}
                currentCharIndex={currentCharIndex}
              />
            )}
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t p-2">
            <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <KeyboardIcon className="h-4 w-4" />
                  <span>{t("layout")}</span>
                  <Select
                    value={layout}
                    onValueChange={(v) => setLayout(v as KeyboardLayout)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(KEYBOARD_LAYOUTS).map((l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Palette className="h-4 w-4" />
                  <span>{t("theme")}</span>
                  <Select
                    value={keyboardTheme}
                    onValueChange={(v) =>
                      handleKeyboardThemeChange(v as KeyboardTheme)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">
                        {t("defaultTheme")}
                      </SelectItem>
                      <SelectItem value="retro">{t("retroTheme")}</SelectItem>
                      <SelectItem value="80s-kid">{t("kidTheme")}</SelectItem>
                      <SelectItem value="carbon">{t("carbonTheme")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setShowKeyboard(!showKeyboard)}
                      variant="outline"
                      size="icon"
                    >
                      <KeyboardIcon
                        className={cn(
                          "h-4 w-4",
                          !showKeyboard && "text-muted-foreground/50"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("toggleKeyboard")}</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
        </footer>

        {results && (
          <Results
            stats={results}
            isOpen={showResults}
            onClose={() => setShowResults(false)}
            onRestart={handleRestart}
            difficulty={difficulty}
          />
        )}
      </div>
    </TooltipProvider>
  );
}
