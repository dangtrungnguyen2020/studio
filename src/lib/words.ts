import type { Difficulty } from "./keyboards";

const veryEasyChars = "abcdefghijklmnopqrstuvwxyz";
const easyWords =
  "the of to and a in is it you that he was for on are with as I his they be at one have this from or had by hot but some what there we can out other were all your when up use word how said an each she".split(
    " "
  );
const hardArticle =
  "In the heart of the digital age, where information flows ceaselessly, the ability to type quickly and accurately has become an indispensable skill. It is the bridge between thought and digital expression, a fundamental component of modern communication and productivity. Whether you are a student drafting an essay, a developer writing code, or a professional composing an email, your typing proficiency directly impacts your efficiency and the clarity of your message. This is not merely about speed; it is about precision, reducing errors, and ensuring that your ideas are conveyed as intended without the frustrating interruption of constant corrections.";
const expertParagraph =
  "The burgeoning field of quantum computing, with its complex algorithms like Shor's and Grover's, promises to revolutionize cryptography by rendering current standards (e.g., RSA-2048) obsolete. Researchers are exploring post-quantum cryptography (PQC) solutions, such as lattice-based (e.g., Kyber) and hash-based (e.g., SPHINCS+) schemes, to safeguard data integrity for the future. The transition will require a significant infrastructural overhaul, costing an estimated $1.2 billion over the next 5-7 years, impacting systems from secure boot (UEFI) to network protocols (TLS 1.3).";
const arrowKeys = ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const numpadKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const generateFourDigitNumber = (): string => {
  return (Math.floor(Math.random() * 9000) + 1000).toString();
};

export const generateWords = (count: number): string => {
  let result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * easyWords.length);
    result.push(easyWords[randomIndex]);
  }
  return result.join(" ");
};

const generateSequence = (keys: string[], count: number): string => {
  let result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * keys.length);
    result.push(keys[randomIndex]);
  }
  return result.join(" ");
};

export const generate = (difficulty: Difficulty): string => {
  switch (difficulty) {
    case "very-easy":
      return Array(50)
        .fill(0)
        .map(
          () => veryEasyChars[Math.floor(Math.random() * veryEasyChars.length)]
        )
        .join(" ");
    case "easy":
      return generateWords(20);
    case "medium":
      return Array(20).fill(0).map(generateFourDigitNumber).join(" ");
    case "hard":
      return hardArticle;
    case "expert":
      return expertParagraph;
    case "arrow-training":
      return generateSequence(arrowKeys, 36);
    case "numpad-training":
      return generateSequence(numpadKeys, 36);
    case "custom":
      return "Please enter some custom text to begin the test.";
    default:
      return generateWords(30);
  }
};

export const generateCustom = (text: string, t: any) => {
  if (!text || text.trim().length === 0) {
    return t("customTextPlaceholder");
  }
  return text.trim().replace(/\s+/g, " ");
};
