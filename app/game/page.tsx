"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hand } from "pokersolver";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GameCard from "@/components/game-card";
import { generateDeck, dealCards, getHandOptions } from "@/lib/game-utils";
import { shareGameStats } from "@/queries/share-game-stats";
import { useUser } from "@/store/use-user";
import ResultScreen from "./_components/result-screen";
import Timer from "@/components/timer";
import { redirect } from "next/navigation";

export const DEFAULT_TIME_LEFT = 100;
const DEFAULT_SCORE = 0;
const CORRECT_ANSWER_TIME_BONUS = 5;

export default function GamePage() {
  const user = useUser();

  if (!user.id) {
    return redirect("/");
  }

  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_LEFT);
  const [score, setScore] = useState(DEFAULT_SCORE);
  const [attempts, setAttempts] = useState<
    { correct: boolean; hand: string }[]
  >([]);
  const [currentHand, setCurrentHand] = useState<string[]>([]);
  const [options, setOptions] = useState<string[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [isDealing, setIsDealing] = useState(true);
  const [randomWord, setRandomWord] = useState("");

  // Initialize game
  useEffect(() => {
    startNewRound();
  }, []);

  async function handleGameOver() {
    await shareGameStats(user, {
      score,
      attempts,
    });
    setGameOver(true);
  }

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleGameOver();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const startNewRound = async () => {
    setIsDealing(true);

    // Deal new cards
    const deck = generateDeck();
    const hand = dealCards(deck, 5);
    setCurrentHand(hand);

    // Get hand ranking and options
    const solvedHand = Hand.solve(hand);
    const correctHandName = solvedHand.name;
    setCorrectAnswer(correctHandName);

    const handOptions = getHandOptions(correctHandName);
    setOptions(handOptions);

    // Fetch random word for funny message
    try {
      const response = await fetch("/api/random-word");
      const data = await response.json();
      if (data.word) {
        setRandomWord(data.word);
        generateFunnyMessage(data.word);
      }
    } catch (error) {
      console.error("Failed to fetch random word:", error);
    }

    setIsDealing(false);
  };

  const generateFunnyMessage = (word: string) => {
    const messages = [
      `Is your poker face as ${word} as your guessing skills?`,
      `That was ${word}-tastic!`,
      `Even a ${word} could've guessed that one!`,
      `You're more ${word} than I expected!`,
      `That's what I call a ${word} move!`,
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  const handleAnswer = (selectedOption: string) => {
    const isCorrect = selectedOption === correctAnswer;

    // Update score and time
    if (isCorrect) {
      setScore(score + 1);
      setTimeLeft(timeLeft + CORRECT_ANSWER_TIME_BONUS);
    }

    // Record attempt
    setAttempts([
      ...attempts,
      {
        correct: isCorrect,
        hand: correctAnswer,
      },
    ]);

    // Start new round
    startNewRound();
  };

  const restartGame = () => {
    setTimeLeft(DEFAULT_TIME_LEFT);
    setScore(DEFAULT_SCORE);
    setAttempts([]);
    setGameOver(false);
    startNewRound();
  };

  if (gameOver) {
    return (
      <ResultScreen score={score} attempts={attempts} onRestart={restartGame} />
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="w-full max-w-4xl flex flex-col items-center gap-6">
        <div className="w-full flex justify-between items-center">
          <div className="text-white text-xl font-bold">Score: {score}</div>
          <Timer timeLeft={timeLeft} />
        </div>

        <Card className="w-full bg-slate-800/50 backdrop-blur-sm border-0 p-6 text-white">
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold text-center">
              What hand is this?
            </h2>

            <div className="flex justify-center flex-wrap gap-2">
              <AnimatePresence mode="popLayout">
                {currentHand.map((card, index) => (
                  <motion.div
                    key={`${card}-${index}`}
                    initial={{ opacity: 0, y: 50, rotateY: 180 }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      rotateY: 0,
                      transition: {
                        delay: index * 0.1,
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    }}
                    exit={{ opacity: 0, scale: 0.8, y: 50 }}
                    layout
                  >
                    <GameCard card={card} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
              {options.map((option) => (
                <Button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  disabled={isDealing}
                  variant="secondary"
                >
                  {option}
                </Button>
              ))}
            </div>

            {randomWord && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-sm text-slate-300 italic mt-2"
              >
                {message}
              </motion.div>
            )}
          </div>
        </Card>
      </div>
    </main>
  );
}
