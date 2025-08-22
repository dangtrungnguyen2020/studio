
export type KeyboardLayout =
  | "DVORAK"
  | "AZERTY"
  | "TKL"
  | "75%"
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
  label?: string;
  shifted?: string;
  colSpan?: number;
  rowSpan?: number;
}

export const KEYBOARD_LAYOUTS: Record<KeyboardLayout, KeyDefinition[][]> = {
  DVORAK: [
    [
      { label: "`", shifted: "~" }, { label: "1", shifted: "!" }, { label: "2", shifted: "@" }, { label: "3", shifted: "#" },
      { label: "4", shifted: "$" }, { label: "5", shifted: "%" }, { label: "6", shifted: "^" }, { label: "7", shifted: "&" },
      { label: "8", shifted: "*" }, { label: "9", shifted: "(" }, { label: "0", shifted: ")" }, { label: "[", shifted: "{" },
      { label: "]", shifted: "}" }, { label: "Backspace", colSpan: 3 },
    ],
    [
      { label: "Tab", colSpan: 3 }, { label: "'", shifted: '"' }, { label: ",", shifted: "<" }, { label: ".", shifted: ">" },
      { label: "P", shifted: "p" }, { label: "Y", shifted: "y" }, { label: "F", shifted: "f" }, { label: "G", shifted: "g" },
      { label: "C", shifted: "c" }, { label: "R", shifted: "r" }, { label: "L", shifted: "l" }, { label: "/", shifted: "?" },
      { label: "=", shifted: "+" }, { label: "\\", shifted: "|" },
    ],
    [
      { label: "Caps", colSpan: 4 }, { label: "A", shifted: "a" }, { label: "O", shifted: "o" }, { label: "E", shifted: "e" },
      { label: "U", shifted: "u" }, { label: "I", shifted: "i" }, { label: "D", shifted: "d" }, { label: "H", shifted: "h" },
      { label: "T", shifted: "t" }, { label: "N", shifted: "n" }, { label: "S", shifted: "s" }, { label: "-", shifted: "_" }, { label: "Enter", colSpan: 3 },
    ],
    [
      { label: "Shift", colSpan: 5 }, { label: ";", shifted: ":" }, { label: "Q", shifted: "q" }, { label: "J", shifted: "j" },
      { label: "K", shifted: "k" }, { label: "X", shifted: "x" }, { label: "B", shifted: "b" }, { label: "M", shifted: "m" },
      { label: "W", shifted: "w" }, { label: "V", shifted: "v" }, { label: "Z", shifted: "z" }, { label: "Shift", colSpan: 4 },
    ],
    [
      { label: "Ctrl" }, { label: "Win" }, { label: "Alt" }, { label: "Space", colSpan: 14 },
      { label: "AltGr" }, { label: "Win" }, { label: "Menu" }, { label: "Ctrl", colSpan: 3 } 
    ],
  ],
  AZERTY: [
    [
      { label: "²" }, { label: "&", shifted: "1" }, { label: "é", shifted: "2" }, { label: '"', shifted: "3" },
      { label: "'", shifted: "4" }, {label: "(", shifted: "5" }, { label: "-", shifted: "6" }, { label: "è", shifted: "7" },
      { label: "_", shifted: "8" }, { label: "ç", shifted: "9" }, { label: "à", shifted: "0" }, { label: ")", shifted: "°" },
      { label: "=", shifted: "+" }, { label: "Backspace", colSpan: 4 },
    ],
    [
      { label: "Tab", colSpan: 3 }, { label: "A", shifted: "a" }, { label: "Z", shifted: "z" }, { label: "E", shifted: "e" },
      { label: "R", shifted: "r" }, { label: "T", shifted: "t" }, { label: "Y", shifted: "y" }, { label: "U", shifted: "u" },
      { label: "I", shifted: "i" }, { label: "O", shifted: "o" }, { label: "P", shifted: "p" }, { label: "^", shifted: "¨" },
      { label: "$", shifted: "£" }, { label: "Enter", colSpan: 3 },
    ],
    [
      { label: "Caps", colSpan: 4 }, { label: "Q", shifted: "q" }, { label: "S", shifted: "s" }, { label: "D", shifted: "d" },
      { label: "F", shifted: "f" }, { label: "G", shifted: "g" }, { label: "H", shifted: "h" }, { label: "J", shifted: "j" },
      { label: "K", shifted: "k" }, { label: "L", shifted: "l" }, { label: "M", shifted: "m" }, { label: "ù", shifted: "%" },
      { label: "*", shifted: "µ", colSpan: 4 },
    ],
    [
      { label: "Shift", colSpan: 3 }, { label: "<", shifted: ">" },
      { label: "W", shifted: "w" }, { label: "X", shifted: "x" },
      { label: "C", shifted: "c" }, { label: "V", shifted: "v" },
      { label: "B", shifted: "b" }, { label: "N", shifted: "n" },
      { label: ",", shifted: "?" }, { label: ";", shifted: "." },
      { label: ":", shifted: "/" }, { label: "!", shifted: "§" },
      { label: "Shift", colSpan: 5 },
    ],
    [
      { label: "Ctrl" }, { label: "Fn" },
      { label: "Win" }, { label: "Alt" },
      { label: "Space", colSpan: 14 },
      { label: "AltGr" }, { label: "Win" },
      { label: "Menu" }, { label: "Ctrl" },
    ],
  ],
  "60%": [
      [
        { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" },
        { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" },
        { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace", colSpan: 4 }
      ],
      [
        { label: "Tab", colSpan: 3 }, { label: "Q" }, { label: "W" }, { label: "E" }, { label: "R" },
        { label: "T" }, { label: "Y" }, { label: "U" }, { label: "I" }, { label: "O" },
        { label: "P" }, { label: "[" }, { label: "]" }, { label: "\\", colSpan: 3 }
      ],
      [
        { label: "Caps", colSpan: 4 }, { label: "A" }, { label: "S" }, { label: "D" }, { label: "F" },
        { label: "G" }, { label: "H" }, { label: "J" }, { label: "K" }, { label: "L" },
        { label: ";" }, { label: "'" }, { label: "Enter", colSpan: 4 }
      ],
      [
        { label: "Shift", colSpan: 5 }, { label: "Z" }, { label: "X" }, { label: "C" }, { label: "V" },
        { label: "B" }, { label: "N" }, { label: "M" }, { label: "," }, { label: "." }, { label: "/" },
        { label: "Shift", colSpan: 5 }
      ],
      [
        { label: "Ctrl", colSpan: 3 }, { label: "Fn" }, { label: "Win" }, { label: "Alt" },
        { label: "Space", colSpan: 16 },
        { label: "Alt" }, { label: "Ctrl", colSpan: 3 }
      ]
  ],
  "75%": [
    // [
    //   { label: "Esc" }, { label: "F1" }, { label: "F2" }, { label: "F3" }, { label: "F4" },
    //   { label: "F5" }, { label: "F6" }, { label: "F7" }, { label: "F8" },
    //   { label: "F9" }, { label: "F10" }, { label: "F11" }, { label: "F12" }
    // ],
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" }, { label: "5" },
      { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" }, { label: "0" }, { label: "-" },
      { label: "=" }, { label: "Backspace", colSpan: 4 }, { label: "Home" }
    ],
    [
        { label: "Tab", colSpan: 3 }, { label: "Q" }, { label: "W" }, { label: "E" }, { label: "R" },
        { label: "T" }, { label: "Y" }, { label: "U" }, { label: "I" }, { label: "O" },
        { label: "P" }, { label: "[" }, { label: "]" }, { label: "\\", colSpan: 3 }, { label: "pgUp" }
    ],
    [
        { label: "Caps", colSpan: 4 }, { label: "A" }, { label: "S" }, { label: "D" }, { label: "F" },
        { label: "G" }, { label: "H" }, { label: "J" }, { label: "K" }, { label: "L" },
        { label: ";" }, { label: "'" }, { label: "Enter", colSpan: 4 }, { label: "pgDn" }
    ],
    [
        { label: "Shift", colSpan: 4 }, { label: "Z" }, { label: "X" }, { label: "C" }, { label: "V" },
        { label: "B" }, { label: "N" }, { label: "M" }, { label: "," }, { label: "." }, { label: "/" },
        { label: "Shift", colSpan: 4 }, { label: "↑" }, { label: "End" }
    ],
    [
        { label: "Ctrl" }, { label: "Fn" }, { label: "Win" }, { label: "Alt" },
        { label: "Space", colSpan: 12 },
        { label: "Alt" }, { label: "Menu" }, { label: "Ctrl" },
        { label: "←" }, { label: "↓" }, { label: "→" }
    ]
  ],
  TKL: [
    // [
    //   { label: "Esc" }, {}, { label: "F1" }, { label: "F2" }, { label: "F3" }, { label: "F4" },
    //   {}, { label: "F5" }, { label: "F6" }, { label: "F7" }, { label: "F8" },
    //   {}, { label: "F9" }, { label: "F10" }, { label: "F11" }, { label: "F12" },
    //   { label: "PrtSc" }, { label: "ScrLk" }, { label: "Pause" }
    // ],
    [
      { label: "`" }, { label: "1" }, { label: "2" }, { label: "3" }, { label: "4" },
      { label: "5" }, { label: "6" }, { label: "7" }, { label: "8" }, { label: "9" },
      { label: "0" }, { label: "-" }, { label: "=" }, { label: "Backspace", colSpan: 3 },
      { label: "Insert" }, { label: "Home" }, { label: "PgUp" }
    ],
    [
      { label: "Tab", colSpan: 3 }, { label: "Q" }, { label: "W" }, { label: "E" }, { label: "R" },
      { label: "T" }, { label: "Y" }, { label: "U" }, { label: "I" }, { label: "O" },
      { label: "P" }, { label: "[" }, { label: "]" }, { label: "\\", colSpan: 2 },
      { label: "Delete" }, { label: "End" }, { label: "PgDn" }
    ],
    [
      { label: "Caps", colSpan: 4 }, { label: "A" }, { label: "S" }, { label: "D" }, { label: "F" },
      { label: "G" }, { label: "H" }, { label: "J" }, { label: "K" }, { label: "L" },
      { label: ";" }, { label: "'" }, { label: "Enter", colSpan: 3 }, { colSpan: 5 }
    ],
    [
      { label: "Shift", colSpan: 5 }, { label: "Z" }, { label: "X" }, { label: "C" }, { label: "V" },
      { label: "B" }, { label: "N" }, { label: "M" }, { label: "," }, { label: "." }, { label: "/" },
      { label: "Shift", colSpan: 4 }, { colSpan: 2 }, { label: "↑" }, { colSpan: 2 }
    ],
    [
      { label: "Ctrl", colSpan: 3 }, { label: "Win" }, { label: "Alt" },
      { label: "Space", colSpan: 12 },
      { label: "Alt" }, { label: "Fn" }, { label: "Menu" }, { label: "Ctrl", colSpan: 4 },
      { label: "←" }, { label: "↓" }, { label: "→" }
    ]
  ],
  Numpad: [
    [{ label: "NuLoc" }, { label: "/" }, { label: "*" }, { label: "-" }],
    [{ label: "7" }, { label: "8" }, { label: "9" }, { label: "+", rowSpan: 2 }],
    [{ label: "4" }, { label: "5" }, { label: "6" }],
    [{ label: "1" }, { label: "2" }, { label: "3" }, { label: "Enter", rowSpan: 2 }],
    [{ label: "0", colSpan: 4 }, { label: "." }],
  ],
};
