"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { cn } from "@/lib/classname-utils";
import { containerVariants, itemVariants } from "@/lib/motion-variants";

type ResultScreenProps = {
  score: number;
  attempts: { correct: boolean; hand: string }[];
  onRestart: () => void;
};

export default function ResultScreen({
  score,
  attempts,
  onRestart,
}: ResultScreenProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-md"
      >
        <Card className="border-0 bg-slate-800/50 backdrop-blur-sm text-white shadow-xl">
          <CardHeader>
            <motion.div variants={itemVariants}>
              <CardTitle className="text-3xl font-bold text-center text-primary">
                Game Over!
              </CardTitle>
            </motion.div>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div variants={itemVariants} className="text-center">
              <h2 className="text-2xl font-bold">Your Score: {score}</h2>
              <p className="text-slate-300">
                You correctly identified {score} poker hands
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="font-semibold mb-2">Your Attempts:</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {attempts.length > 0 ? (
                  attempts.map((attempt, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded-md text-sm ${
                        attempt.correct
                          ? "bg-green-500/20 border border-green-500/30"
                          : "bg-red-500/20 border border-red-500/30"
                      }`}
                    >
                      <span className="font-medium">{attempt.hand}</span>
                      <span className="float-right">
                        {attempt.correct ? "✓" : "✗"}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-center">
                    No attempts recorded
                  </p>
                )}
              </div>
            </motion.div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <motion.div variants={itemVariants} className="w-full">
              <Button onClick={onRestart} className="w-full">
                Play Again
              </Button>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
              <Link
                href="/stats"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full"
                )}
              >
                View Stats
              </Link>
            </motion.div>
            <motion.div variants={itemVariants} className="w-full">
              <Link
                href="/"
                className={cn(
                  buttonVariants({ variant: "secondary" }),
                  "w-full"
                )}
              >
                Back to Home
              </Link>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
