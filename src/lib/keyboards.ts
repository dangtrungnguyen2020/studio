export type KeyboardLayout = "QWERTY" | "DVORAK" | "AZERTY" | "TKL" | "75%" | "Full-size" | "60%" | "Numpad";
export type Difficulty = "very-easy" | "easy" | "medium" | "hard" | "expert" | "custom" | "arrow-training" | "numpad-training";
export type KeyboardTheme = 'default' | 'retro' | '80s-kid' | 'carbon';

export const THEMES: { name: string, value: KeyboardTheme, description: string }[] = [
    { name: 'Default', value: 'default', description: 'A clean, modern look with a dark background and vibrant accents.' },
    { name: 'Retro', value: 'retro', description: 'Classic beige and gray tones for a nostalgic, vintage feel.' },
    { name: '80s Kid', value: '80s-kid', description: 'Bright, bold, and neon colors that scream 1980s.' },
    { name: 'Carbon', value: 'carbon', description: 'A sleek, dark theme with orange accents, inspired by carbon fiber.' },
];

export const KEYBOARD_LAYOUTS: Record<KeyboardLayout, string[][]> = {
  QWERTY: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    [' ', ' ', ' ', 'Space', ' ', ' ', ' ']
  ],
  DVORAK: [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '[', ']', 'Backspace'],
    ['Tab', "'", ',', '.', 'p', 'y', 'f', 'g', 'c', 'r', 'l', '/', '=', '\\'],
    ['CapsLock', 'a', 'o', 'e', 'u', 'i', 'd', 'h', 't', 'n', 's', '-', 'Enter'],
    ['Shift', ';', 'q', 'j', 'k', 'x', 'b', 'm', 'w', 'v', 'z', 'Shift'],
    [' ', ' ', ' ', 'Space', ' ', ' ', ' ']
  ],
  AZERTY: [
    ['²', '&', 'é', '"', "'", '(', '-', 'è', '_', 'ç', 'à', ')', '=', 'Backspace'],
    ['Tab', 'a', 'z', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '^', '$', '*'],
    ['CapsLock', 'q', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'ù', 'Enter'],
    ['Shift', '<', 'w', 'x', 'c', 'v', 'b', 'n', '?', '.', '/', '!', 'Shift'],
    [' ', ' ', ' ', 'Space', ' ', ' ', ' ']
  ],
  "TKL": [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Alt', 'Fn', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
  ],
  "75%": [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Alt', 'Fn', 'ArrowLeft', 'ArrowUp', 'ArrowDown', 'ArrowRight']
  ],
  "Full-size": [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'NumLock', '/', '*', '-'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', '7', '8', '9', '+'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter', '4', '5', '6'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift', 'ArrowUp', '1', '2', '3', 'Enter'],
    ['Ctrl', 'Alt', 'Space', 'Alt', 'Fn', 'ArrowLeft', 'ArrowDown', 'ArrowRight', '0', '.']
  ],
  "60%": [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', 'Space', 'Alt', 'Fn']
  ],
  "Numpad": [
    ['NumLock', '/', '*', '-'],
    ['7', '8', '9', '+'],
    ['4', '5', '6'],
    ['1', '2', '3', 'Enter'],
    ['0', '.']
  ],
};
