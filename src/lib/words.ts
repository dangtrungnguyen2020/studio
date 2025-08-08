import type { Difficulty } from './keyboards';

const easyWords = "the of to and a in is it you that he was for on are with as I his they be at one have this from or had by hot but some what there we can out other were all your when up use word how said an each she".split(" ");
const mediumWords = "people my than first water been call who oil its now find long down day did get come made may part time if about many then them write would like so these her look two more has see could no way been that was for on are".split(" ");
const hardWords = "government think said point next end world system city case area general high number part place small group different fact night public really company service important form development".split(" ");

const generateWords = (count: number, difficulty: Difficulty): string => {
  let words;
  switch (difficulty) {
    case 'easy':
      words = easyWords;
      break;
    case 'medium':
      words = mediumWords;
      break;
    case 'hard':
      words = hardWords;
      break;
    default:
      words = mediumWords;
  }
  
  let result = [];
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }
  return result.join(" ");
};

export const generate = (difficulty: Difficulty) => {
  let wordCount = 30;
  if (difficulty === 'easy') wordCount = 20;
  if (difficulty === 'hard') wordCount = 40;
  
  return generateWords(wordCount, difficulty);
};

export const generateCustom = (text: string) => {
    if (!text || text.trim().length === 0) {
        return "Please enter some custom text to begin the test.";
    }
    return text.trim().replace(/\s+/g, ' ');
}
