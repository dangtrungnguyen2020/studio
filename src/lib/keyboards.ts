export type KeyboardLayout = "QWERTY" | "DVORAK" | "AZERTY" | "TKL" | "75%";
export type Difficulty = "easy" | "medium" | "hard";

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
    ['Ctrl', 'Alt', ' ', 'Space', ' ', 'Alt', 'Ctrl']
  ],
  "75%": [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'],
    ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter'],
    ['Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift'],
    ['Ctrl', 'Alt', ' ', 'Space', ' ', 'Alt']
  ],
};
