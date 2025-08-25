"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { KEYBOARD_LAYOUTS } from "@/lib/keyboards";
import type { KeyboardLayout, KeyDefinition } from "@/lib/keyboards";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Command,
  Option,
} from "lucide-react";

interface KeyboardProps {
  layout: KeyboardLayout;
  lastPressedKey: string | null;
  text: string;
  currentCharIndex: number;
}

const Keyboard = ({
  layout,
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
    Win: <Command size={16} />,
    Alt: <Option size={16} />,
    "↑": <ArrowUp size={16} />,
    "↓": <ArrowDown size={16} />,
    "←": <ArrowLeft size={16} />,
    "→": <ArrowRight size={16} />,
  };

  const words = useMemo(() => text.split(" "), [text]);
  const isArrowTraining = useMemo(
    () => words.every((word) => word.startsWith("Arrow")),
    [words]
  );

  useEffect(() => {
    if (lastPressedKey) {
      const key = lastPressedKey.toLowerCase();
      setPressedKey(key);
      const timer = setTimeout(() => setPressedKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [lastPressedKey]);

  const getKeyStyle = (key: KeyDefinition) => {
    let style: React.CSSProperties = {};
    style.gridColumn = `span ${key.colSpan || (key.label ? 2 : 1)}`;
    if (key.rowSpan) {
      style.gridRow = `span ${key.rowSpan}`;
    }
    return style;
  };

  const keyToLabelMap: { [key: string]: string } = {
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
  };

  const getKeyClass = (key: KeyDefinition) => {
    const targetChar =
      text &&
      text.length > 0 &&
      currentCharIndex < (isArrowTraining ? words.length : text.length)
        ? isArrowTraining
          ? words[currentCharIndex]
          : text[currentCharIndex]
        : null;

    let isTargetKey = false;
    if (targetChar) {
      if (isArrowTraining) {
        isTargetKey = key.label === keyToLabelMap[targetChar];
      } else {
        isTargetKey =
          key.label?.toLowerCase() === targetChar.toLowerCase() ||
          (key.label === "Space" && targetChar === " ") ||
          (key.label === "Shift" &&
            targetChar.toUpperCase() === targetChar &&
            /[a-z]/i.test(targetChar));
      }
    }

    const isPressed =
      pressedKey === key.label?.toLowerCase() ||
      (pressedKey === " " && key.label === "Space");

    return cn(
      "rounded-md flex items-center justify-center p-2 text-sm font-medium transition-all duration-100 ease-in-out",
      "shadow-sm border border-border bg-secondary/50",
      `row-span-${key.rowSpan || 1}`,
      `col-span-${key.colSpan || 2}`,
      isPressed ? "scale-95 bg-primary text-accent-foreground" : "",
      isTargetKey && "bg-accent/20 ring-2 ring-primary"
    );
  };

  const maxCols = keyboardLayout.reduce((max, row) => {
    const rowCols = row.reduce(
      (sum, key) => sum + (key.colSpan || (key.label ? 2 : 1)),
      0
    );
    return Math.max(max, rowCols);
  }, 0);

  return (
    <div
      className={`grid grid-cols-${maxCols} gap-2 p-4 bg-muted/20 rounded-lg justify-center`}
      style={{
        gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
        gridAutoRows: "auto",
      }}
    >
      {keyboardLayout.flat().map((key, index) => (
        <div
          key={index}
          className={key.label ? getKeyClass(key) : ""}
          style={getKeyStyle(key)}
        >
          {key.label ? keyIcons[key.label] || key.label : ""}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
