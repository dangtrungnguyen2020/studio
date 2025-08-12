export type KeyboardLayout = "QWERTY" | "DVORAK" | "AZERTY" | "TKL" | "75%" | "Full-size" | "60%" | "Numpad";
export type Difficulty = "easy" | "medium" | "hard";
export type KeyboardTheme = 'default' | 'retro' | '80s-kid' | 'carbon';

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
