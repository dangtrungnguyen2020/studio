
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { KEYBOARD_LAYOUTS } from "@/lib/keyboards";
import type { KeyboardLayout, KeyDefinition } from "@/lib/keyboards";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Command,
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

  const getKeyStyle = (key: KeyDefinition) => {
    let style: React.CSSProperties = {};
    if (key.colSpan) {
      style.gridColumn = `span ${key.colSpan}`;
    }
    if (key.rowSpan) {
      style.gridRow = `span ${key.rowSpan}`;
    }
    return style;
  };

  const getKeyClass = (key: KeyDefinition) => {
    const targetChar =
      text && text.length > 0 && currentCharIndex < text.length
        ? text[currentCharIndex]
        : null;
    let isTargetKey = false;
    if (targetChar) {
      isTargetKey =
        key.label.toLowerCase() === targetChar.toLowerCase() ||
        (key.label === "Space" && targetChar === " ") ||
        (key.label === "Shift" &&
          targetChar.toUpperCase() === targetChar &&
          /[a-z]/i.test(targetChar));
    }

    const isPressed =
      pressedKey === key.label.toLowerCase() ||
      (pressedKey === " " && key.label === "Space");

    return cn(
      "h-12 rounded-md flex items-center justify-center p-2 text-sm font-medium transition-all duration-100 ease-in-out",
      "shadow-sm border border-border",
      "bg-secondary/50 hover:bg-secondary",
      isPressed ? "scale-95 bg-primary text-primary-foreground" : "",
      isTargetKey && "bg-accent text-accent-foreground ring-2 ring-primary"
    );
  };

  const maxCols = keyboardLayout.reduce((max, row) => {
    const rowCols = row.reduce((sum, key) => sum + (key.colSpan || 1), 0);
    return Math.max(max, rowCols);
  }, 0);

  return (
    <div
      className={`grid gap-1 p-4 bg-muted/20 rounded-lg justify-center`}
      style={{
        gridTemplateColumns: `repeat(${maxCols}, minmax(0, 1fr))`,
        gridAutoRows: "auto",
      }}
    >
      {keyboardLayout.flat().map((key, index) => (
        <div key={index} className={getKeyClass(key)} style={getKeyStyle(key)}>
          {keyIcons[key.label] || key.label}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
