"use client";

import { DEFAULT_TIME_LEFT } from "@/app/game/page";
import { motion } from "framer-motion";

type TimerProps = {
  timeLeft: number;
};

export default function Timer({ timeLeft }: TimerProps) {
  // Calculate percentage for progress bar
  const percentage = (timeLeft / DEFAULT_TIME_LEFT) * 100;

  // Determine color based on time left
  const getColor = () => {
    if (timeLeft > 50) return "bg-green-500";
    if (timeLeft > 20) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="flex flex-col items-end">
      <div className="text-white text-xl font-bold mb-1">Time: {timeLeft}s</div>
      <div className="w-40 h-3 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${getColor()}`}
          initial={{ width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
    </div>
  );
}
