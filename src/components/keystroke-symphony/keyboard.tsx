
"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { KEYBOARD_LAYOUTS } from "@/lib/keyboards";
import type { KeyboardLayout } from "@/lib/keyboards";
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

  const getKeyStyle = (key: string, layout: KeyboardLayout) => {
    let style: React.CSSProperties = {};
    if (layout === 'Numpad' || layout === 'TKL' || layout === 'QWERTY' || layout === 'DVORAK' || layout === 'AZERTY') {
      // These layouts can use a more dynamic grid approach
      if (key === 'Space') style.gridColumn = 'span 6';
      if (key === 'Backspace') style.gridColumn = 'span 2';
      if (key === 'Tab') style.gridColumn = 'span 2';
      if (key === 'CapsLock') style.gridColumn = 'span 2';
      if (key === 'Enter') style.gridColumn = 'span 2';
      if (key === 'Shift') style.gridColumn = 'span 3';
    }
    return style;
  }

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

    const isPressed =
      pressedKey === key.toLowerCase() ||
      (pressedKey === " " && key === "Space");

    return cn(
      "h-12 rounded-md flex items-center justify-center p-2 text-sm font-medium transition-all duration-100 ease-in-out",
      "shadow-sm border border-border",
      "bg-secondary/50 hover:bg-secondary",
      isPressed ? "scale-95 bg-primary text-primary-foreground" : "",
      isTargetKey && "bg-accent text-accent-foreground ring-2 ring-primary"
    );
  };

  return (
    <div
      className={`grid gap-1 p-4 bg-muted/20 rounded-lg justify-center`}
      style={{
        gridTemplateColumns: `repeat(${keyboardLayout[0].length}, minmax(0, 1fr))`,
        gridAutoRows: 'auto',
      }}
    >
      {keyboardLayout.flat().map((key, index) => (
        <div 
          key={index}
          className={getKeyClass(key)}
          style={getKeyStyle(key, layout)}
        >
          {keyIcons[key] || key}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
