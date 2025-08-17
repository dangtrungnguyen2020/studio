"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { KEYBOARD_LAYOUTS } from "@/lib/keyboards";
import type { KeyboardLayout, KeyboardTheme } from "@/lib/keyboards";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Command,
} from "lucide-react";

interface KeyboardProps {
  layout: KeyboardLayout;
  theme: KeyboardTheme;
  lastPressedKey: string | null;
  text: string;
  currentCharIndex: number;
}

const Keyboard = ({
  layout,
  theme,
  lastPressedKey,
  text,
  currentCharIndex,
}: KeyboardProps) => {
  const keyboardLayout = KEYBOARD_LAYOUTS[layout];
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const keyIcons: { [key: string]: React.ReactNode } = {
    ArrowLeft: <ArrowLeft size={16} />,
    ArrowRight: <ArrowRight size={16} />,
    ArrowUp: <ArrowUp size={16} />,
    ArrowDown: <ArrowDown size={16} />,
    Alt: <Command size={16} />,
  };

  useEffect(() => {
    if (lastPressedKey) {
      const key = lastPressedKey.toLowerCase();
      setPressedKey(key);
      const timer = setTimeout(() => setPressedKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [lastPressedKey]);

  const getKeyClass = (key: string) => {
    const targetChar =
      text && text.length > 0 && currentCharIndex < text.length
        ? text[currentCharIndex]
        : null;
    let isTargetKey = false;
    if (targetChar) {
      isTargetKey =
        key.toLowerCase() === targetChar.toLowerCase() ||
        (key === "Space" && targetChar === " ") ||
        (key === "Shift" &&
          targetChar.toUpperCase() === targetChar &&
          /[a-z]/i.test(targetChar));
    }

    let widthClass = "w-12";

    if (key.length > 1 && key !== "Space") {
      if (["Backspace", "Enter", "CapsLock", "Tab"].includes(key)) {
        widthClass = "w-20";
      } else if (key === "Shift") {
        widthClass = "w-28";
      } else if (["Ctrl", "Alt", "Fn"].includes(key)) {
        widthClass = "w-16";
      } else if (key.startsWith("Arrow")) {
        widthClass = "w-12";
      }
    } else if (key === "Space") {
      widthClass = "flex-grow";
    }

    const isPressed =
      pressedKey === key.toLowerCase() ||
      (pressedKey === " " && key === "Space");

    return cn(
      "h-12 rounded-md flex items-center justify-center p-2 text-sm font-medium transition-all duration-100 ease-in-out",
      "shadow-sm",
      "hover:bg-muted",
      isPressed ? "scale-95" : "",
      isPressed
        ? "bg-[--key-accent-bg] text-[--key-accent-text]"
        : "bg-[--key-bg] text-[--key-text] border border-[--key-border]",
      widthClass,
      isTargetKey && "bg-[--key-target-bg] ring-2 ring-[--key-target-ring]"
    );
  };

  return (
    <div
      className={`flex flex-col gap-2 p-4 bg-muted/20 rounded-lg ${
        theme !== "default" ? `theme-${theme}` : ""
      }`}
    >
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key, keyIndex) =>
            key === " " ? (
              <div key={keyIndex} className="w-12"></div>
            ) : (
              <div key={keyIndex} className={getKeyClass(key)}>
                {keyIcons[key] || key}
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
