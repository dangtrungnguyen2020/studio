"use client";

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { KEYBOARD_LAYOUTS } from '@/lib/keyboards';
import type { KeyboardLayout } from '@/lib/keyboards';

interface KeyboardProps {
  layout: KeyboardLayout;
  lastPressedKey: string | null;
  text: string;
  currentCharIndex: number;
}

const Keyboard = ({ layout, lastPressedKey, text, currentCharIndex }: KeyboardProps) => {
  const keyboardLayout = KEYBOARD_LAYOUTS[layout];
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  useEffect(() => {
    if (lastPressedKey) {
      const key = lastPressedKey.toLowerCase();
      setPressedKey(key);
      const timer = setTimeout(() => setPressedKey(null), 150);
      return () => clearTimeout(timer);
    }
  }, [lastPressedKey]);
  
  const getKeyClass = (key: string) => {
    const targetChar = text && currentCharIndex < text.length ? text[currentCharIndex] : null;
    const isTargetKey = key.toLowerCase() === (targetChar && targetChar.toLowerCase()) || (key === 'Space' && targetChar === ' ');

    let widthClass = 'w-12';

    if (key.length > 1) {
      if (key === 'Backspace' || key === 'Enter' || key === 'CapsLock') {
        widthClass = 'flex-grow';
      } else if (key === 'Shift') {
        widthClass = 'w-28';
      } else if (key === 'Tab') {
        widthClass = 'w-20';
      } else if (key === 'Space') {
        widthClass = 'w-1/2';
      }
    }
    
    const isPressed = pressedKey === key.toLowerCase() || (pressedKey === ' ' && key === 'Space');

    
    return cn(
      'h-12 rounded-md flex items-center justify-center p-2 text-sm font-medium transition-all duration-100 ease-in-out',
      'bg-card border border-border shadow-sm',
      'hover:bg-muted',
      isPressed ? 'bg-primary text-primary-foreground scale-95' : 'bg-muted/40',
      widthClass,
      isTargetKey && 'bg-yellow-300 ring-2 ring-yellow-500' // Highlight the target key
    );
  };
  
  return (
    <div className="flex flex-col gap-2 p-4 bg-muted/20 rounded-lg">
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-2">
          {row.map((key, keyIndex) => (
            key === ' ' ? <div key={keyIndex} className="w-12"></div> :
            <div key={keyIndex} className={getKeyClass(key)}>
              {key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
