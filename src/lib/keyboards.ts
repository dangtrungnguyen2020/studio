
export type KeyboardLayout =
  | "QWERTY"
  | "DVORAK"
  | "AZERTY"
  | "TKL"
  | "75%"
  | "Full-size"
  | "60%"
  | "Numpad";
export type Difficulty =
  | "very-easy"
  | "easy"
  | "medium"
  | "hard"
  | "expert"
  | "custom"
  | "arrow-training"
  | "numpad-training";

export interface KeyDefinition {
  label: string;
  colSpan?: number;
  rowSpan?: number;
}

export const KEYBOARD_LAYOUTS: Record<KeyboardLayout, KeyDefinition[][]> = {
  QWERTY: [
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace", colSpan: 2 },
    ],
    [
      { label: "Tab", colSpan: 2 }, { label: "q" }, { label: "w" }, { label: "e" }, { label: "r" }, { label: "t" }, { label: "y" }, { label: "u" }, { label: "i" }, { label: "o" }, { label: "p" }, { label: "[" }, { label: "]" }, { label: "\\" },
    ],
    [
      { label: "CapsLock", colSpan: 2 }, { label: "a" }, { label: "s" }, { label: "d" }, { label: "f" }, { label: "g" }, { label: "h" }, { label: "j" }, { label: "k" }, { label: "l" }, { label: ";" }, { label: "'" }, { label: "Enter", colSpan: 2 },
    ],
    [
      { label: "Shift", colSpan: 3 }, { label: "z" }, { label: "x" }, { label: "c" }, { label: "v" }, { label: "b" }, { label: "n" }, { label: "m" }, { label: "," }, { label: "." }, { label: "/" }, { label: "Shift" },
    ],
    [
      {label: "Space", colSpan: 15}
    ],
  ],
  DVORAK: [
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "[" }, { label: "]" }, { label: "Backspace", colSpan: 2 },
    ],
    [
      { label: "Tab", colSpan: 2 }, { label: "'" }, { label: "," }, { label: "." }, { label: "p" }, { label: "y" }, { label: "f" }, { label: "g" }, { label: "c" }, { label: "r" }, { label: "l" }, { label: "/" }, { label: "=" }, { label: "\\" },
    ],
    [
      { label: "CapsLock", colSpan: 2 }, { label: "a" }, { label: "o" }, { label: "e" }, { label: "u" }, { label: "i" }, { label: "d" }, { label: "h" }, { label: "t" }, { label: "n" }, { label: "s" }, { label: "-" }, { label: "Enter", colSpan: 2 },
    ],
    [
      { label: "Shift", colSpan: 2 }, { label: ";" }, { label: "q" }, { label: "j" }, { label: "k" }, { label: "x" }, { label: "b" }, { label: "m" }, { label: "w" }, { label: "v" }, { label: "z" }, { label: "Shift" },
    ],
    [
      {label: "Space", colSpan: 15}
    ],
  ],
  AZERTY: [
    [
      { label: "²" }, { label: "&" }, { label: "é" }, { label: '"' }, { label: "'" }, { label: "(" }, { label: "-" }, { label: "è" }, { label: "_" }, { label: "ç" }, { label: "à" }, { label: ")" }, { label: "=" }, { label: "Backspace", colSpan: 2 },
    ],
    [
      { label: "Tab", colSpan: 2 }, { label: "a" }, { label: "z" }, { label: "e" }, { label: "r" }, { label: "t" }, { label: "y" }, { label: "u" }, { label: "i" }, { label: "o" }, { label: "p" }, { label: "^" }, { label: "$" }, { label: "*" },
    ],
    [
      { label: "CapsLock", colSpan: 2 }, { label: "q" }, { label: "s" }, { label: "d" }, { label: "f" }, { label: "g" }, { label: "h" }, { label: "j" }, { label: "k" }, { label: "l" }, { label: "m" }, { label: "ù" }, { label: "Enter", colSpan: 2 },
    ],
    [
      { label: "Shift", colSpan: 2 }, { label: "<" }, { label: "w" }, { label: "x" }, { label: "c" }, { label: "v" }, { label: "b" }, { label: "n" }, { label: "?" }, { label: "." }, { label: "/" }, { label: "!" }, { label: "Shift" },
    ],
    [
      {label: "Space", colSpan: 15}
    ],
  ],
  TKL: [
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace" },
    ],
    [
      { label: "Tab" }, { label: "q" }, { label: "w" }, { label: "e" }, { label: "r" }, { label: "t" }, { label: "y" }, { label: "u" }, { label: "i" }, { label: "o" }, { label: "p" }, { label: "[" }, { label: "]" }, { label: "\\" },
    ],
    [
      { label: "CapsLock" }, { label: "a" }, { label: "s" }, { label: "d" }, { label: "f" }, { label: "g" }, { label: "h" }, { label: "j" }, { label: "k" }, { label: "l" }, { label: ";" }, { label: "'" }, { label: "Enter" },
    ],
    [
      { label: "Shift" }, { label: "z" }, { label: "x" }, { label: "c" }, { label: "v" }, { label: "b" }, { label: "n" }, { label: "m" }, { label: "," }, { label: "." }, { label: "/" }, { label: "Shift" },
    ],
    [
      { label: "Ctrl" }, { label: "Alt" }, { label: "Space", colSpan: 5 }, { label: "Alt" }, { label: "Fn" }, { label: "ArrowLeft" }, { label: "ArrowUp" }, { label: "ArrowDown" }, { label: "ArrowRight" },
    ],
  ],
  "75%": [
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace" },
    ],
    [
      { label: "Tab" }, { label: "q" }, { label: "w" }, { label: "e" }, { label: "r" }, { label: "t" }, { label: "y" }, { label: "u" }, { label: "i" }, { label: "o" }, { label: "p" }, { label: "[" }, { label: "]" },
    ],
    [
      { label: "CapsLock" }, { label: "a" }, { label: "s" }, { label: "d" }, { label: "f" }, { label: "g" }, { label: "h" }, { label: "j" }, { label: "k" }, { label: "l" }, { label: ";" }, { label: "'" }, { label: "Enter" },
    ],
    [
      { label: "Shift" }, { label: "z" }, { label: "x" }, { label: "c" }, { label: "v" }, { label: "b" }, { label: "n" }, { label: "m" }, { label: "," }, { label: "." }, { label: "/" }, { label: "Shift" },
    ],
    [
      { label: "Ctrl" }, { label: "Alt" }, { label: "Space", colSpan: 5 }, { label: "Alt" }, { label: "Fn" }, { label: "ArrowLeft" }, { label: "ArrowUp" }, { label: "ArrowDown" }, { label: "ArrowRight" },
    ],
  ],
  "Full-size": [
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace" }, { label: "NumLock" }, { label: "/" }, { label: "*" }, { label: "-" },
    ],
    [
      { label: "Tab" }, { label: "q" }, { label: "w" }, { label: "e" }, { label: "r" }, { label: "t" }, { label: "y" }, { label: "u" }, { label: "i" }, { label: "o" }, { label: "p" }, { label: "[" }, { label: "]" }, { label: "\\" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "+", rowSpan: 2 },
    ],
    [
      { label: "CapsLock" }, { label: "a" }, { label: "s" }, { label: "d" }, { label: "f" }, { label: "g" }, { label: "h" }, { label: "j" }, { label: "k" }, { label: "l" }, { label: ";" }, { label: "'" }, { label: "Enter" }, { label: "4" }, { label: "5" }, { label: "6" },
    ],
    [
      { label: "Shift" }, { label: "z" }, { label: "x" }, { label: "c" }, { label: "v" }, { label: "b" }, { label: "n" }, { label: "m" }, { label: "," }, { label: "." }, { label: "/" }, { label: "Shift" }, { label: "ArrowUp" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "Enter", rowSpan: 2 },
    ],
    [
      { label: "Ctrl" }, { label: "Alt" }, { label: "Space", colSpan: 5 }, { label: "Alt" }, { label: "Fn" }, { label: "ArrowLeft" }, { label: "ArrowDown" }, { label: "ArrowRight" }, { label: "0", colSpan: 2 }, { label: "." },
    ],
  ],
  "60%": [
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace" },
    ],
    [
      { label: "Tab" }, { label: "q" }, { label: "w" }, { label: "e" }, { label: "r" }, { label: "t" }, { label: "y" }, { label: "u" }, { label: "i" }, { label: "o" }, { label: "p" }, { label: "[" }, { label: "]" }, { label: "\\" },
    ],
    [
      { label: "CapsLock" }, { label: "a" }, { label: "s" }, { label: "d" }, { label: "f" }, { label: "g" }, { label: "h" }, { label: "j" }, { label: "k" }, { label: "l" }, { label: ";" }, { label: "'" }, { label: "Enter" },
    ],
    [
      { label: "Shift" }, { label: "z" }, { label: "x" }, { label: "c" }, { label: "v" }, { label: "b" }, { label: "n" }, { label: "m" }, { label: "," }, { label: "." }, { label: "/" }, { label: "Shift" },
    ],
    [
      { label: "Ctrl" }, { label: "Alt" }, { label: "Space", colSpan: 7 }, { label: "Alt" }, { label: "Fn" },
    ],
  ],
  Numpad: [
      [{ label: "7" }, { label: "8" }, { label: "9" }], 
      [{ label: "4" }, { label: "5" }, { label: "6" }], 
      [{ label: "1" }, { label: "2" }, { label: "3" }], 
      [{ label: "0", colSpan: 3 }]
    ],
};
