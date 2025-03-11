"use client";

import { motion } from "framer-motion";

type GameCardProps = {
  card: string;
};

export default function GameCard({ card }: GameCardProps) {
  const suit = card.charAt(card.length - 1);
  const value = card.slice(0, -1);

  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case "h":
        return "♥";
      case "d":
        return "♦";
      case "c":
        return "♣";
      case "s":
        return "♠";
      default:
        console.warn("Unknown suit:", suit);
        return "?";
    }
  };

  const getSuitColor = (suit: string) => {
    return suit === "h" || suit === "d" ? "text-red-500" : "text-black";
  };

  const getCardValue = (value: string) => {
    switch (value) {
      case "A":
        return "A";
      case "K":
        return "K";
      case "Q":
        return "Q";
      case "J":
        return "J";
      case "T":
        return "10";
      default:
        return value;
    }
  };

  return (
    <motion.div
      className="w-16 h-24 md:w-20 md:h-28 bg-white rounded-lg flex flex-col items-center justify-center relative shadow-lg overflow-hidden"
      whileHover={{ scale: 1.05 }}
    >
      <div
        className={`absolute top-1 left-1 text-lg font-bold ${getSuitColor(
          suit
        )}`}
      >
        {getCardValue(value)}
      </div>
      <div className={`text-4xl ${getSuitColor(suit)}`}>
        {getSuitSymbol(suit)}
      </div>
      <div
        className={`absolute bottom-1 right-1 text-lg font-bold ${getSuitColor(
          suit
        )} rotate-180`}
      >
        {getCardValue(value)}
      </div>
    </motion.div>
  );
}
