// src/components/keystroke-symphony/game.tsx
"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { generate } from '@/lib/words';
import { Card, CardContent } from '../ui/card';
import Image from 'next/image';

type Word = {
  id: number;
  text: string;
  y: number;
  x: number;
};

type GameStatus = 'waiting' | 'playing' | 'won' | 'lost';

const Game = () => {
  const [status, setStatus] = useState<GameStatus>('waiting');
  const [playerHealth, setPlayerHealth] = useState(100);
  const [monsterHealth, setMonsterHealth] = useState(100);
  const [words, setWords] = useState<Word[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const gameLoopRef = useRef<NodeJS.Timeout>();
  const wordIdCounter = useRef(0);

  const difficulty = 'medium'; // Or make this selectable

  const resetGame = useCallback(() => {
    setStatus('playing');
    setPlayerHealth(100);
    setMonsterHealth(100);
    setWords([]);
    setInputValue('');
    setScore(0);
    wordIdCounter.current = 0;
    inputRef.current?.focus();
  }, []);
  
  // Start game
  useEffect(() => {
    if (status === 'playing') {
      inputRef.current?.focus();
      gameLoopRef.current = setInterval(() => {
        // Add new word
        if (Math.random() < 0.1) { // Adjust for word frequency
          const newWord: Word = {
            id: wordIdCounter.current++,
            text: generate(difficulty).split(' ')[0],
            y: 0,
            x: Math.random() * 80 + 10, // 10% to 90% of width
          };
          setWords(prev => [...prev, newWord]);
        }

        // Move words
        setWords(prevWords => 
          prevWords.map(word => ({ ...word, y: word.y + 1 })) // Adjust speed
            .filter(word => {
              if (word.y >= 100) {
                // Word reached the bottom
                setPlayerHealth(h => Math.max(0, h - 10));
                return false;
              }
              return true;
            })
        );
      }, 100);
    }
    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [status, difficulty]);

  // Check for win/loss
  useEffect(() => {
    if (playerHealth <= 0) {
      setStatus('lost');
    }
    if (monsterHealth <= 0) {
      setStatus('won');
    }
  }, [playerHealth, monsterHealth]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      const matchedWordIndex = words.findIndex(w => w.text === typedWord);
      
      if (matchedWordIndex !== -1) {
        setWords(prev => prev.filter((_, index) => index !== matchedWordIndex));
        setMonsterHealth(h => Math.max(0, h - 5));
        setScore(s => s + typedWord.length);
        setInputValue('');
      }
    } else {
      setInputValue(value);
    }
  };

  if (status === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-4">Word Wizards vs. Codezilla</h2>
        <p className="mb-6">Type the words falling from Codezilla to defeat it! Don't let them reach you.</p>
        <Button onClick={resetGame}>Start Game</Button>
      </div>
    );
  }

  if (status === 'won' || status === 'lost') {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-3xl font-bold mb-4">{status === 'won' ? 'You Win!' : 'Game Over'}</h2>
        <p className="text-xl mb-2">Final Score: {score}</p>
        <p className="mb-6">{status === 'won' ? 'You have defeated Codezilla!' : 'Codezilla has defeated you.'}</p>
        <Button onClick={resetGame}>Play Again</Button>
      </div>
    );
  }

  return (
    <Card className="w-full h-[500px] flex flex-col p-4" onClick={() => inputRef.current?.focus()}>
      {/* Health Bars & Score */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="text-sm font-semibold">Wizard</label>
          <Progress value={playerHealth} className="w-48" />
        </div>
        <div className="text-2xl font-bold text-primary">Score: {score}</div>
        <div>
           <label className="text-sm font-semibold text-right block">Codezilla</label>
           <Progress value={monsterHealth} className="w-48" />
        </div>
      </div>

      {/* Game Area */}
      <div className="relative flex-1 bg-muted/30 rounded-md overflow-hidden">
        {/* Monster */}
         <Image 
          data-ai-hint="monster"
          src="https://placehold.co/150x150.png"
          alt="Codezilla" 
          width={100} height={100}
          className="absolute top-0 left-1/2 -translate-x-1/2 z-10" 
        />
        {/* Words */}
        {words.map(word => (
          <span
            key={word.id}
            className="absolute font-mono bg-destructive/80 text-destructive-foreground px-2 py-1 rounded"
            style={{ top: `${word.y}%`, left: `${word.x}%`, transform: 'translateX(-50%)' }}
          >
            {word.text}
          </span>
        ))}
         {/* Player */}
        <Image 
          data-ai-hint="wizard"
          src="https://placehold.co/100x100.png"
          alt="Wizard" 
          width={80} height={80}
          className="absolute bottom-5 left-1/2 -translate-x-1/2" 
        />
      </div>

      {/* Input */}
      <div className="mt-4">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="w-full p-2 text-center text-lg font-mono rounded-md border bg-background"
          placeholder="Type words here and press space..."
          autoFocus
        />
      </div>
    </Card>
  );
};

export default Game;
