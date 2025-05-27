import { useState } from "react";
import { motion } from "framer-motion";
import { Card as CardType } from "@/types/Card";

interface CardProps {
  card: CardType;
  onAnswer?: (correct: boolean) => void;
}

export const Card = ({ card, onAnswer }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div
      className="w-80 h-48 cursor-pointer perspective-1000"
      onClick={handleFlip}
      animate={{ rotateY: isFlipped ? 180 : 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative w-full h-full">
        <div
          className={`absolute w-full h-full bg-white rounded-lg shadow-lg p-6 backface-hidden
          ${isFlipped ? "hidden" : "block"}`}
        >
          <h3 className="text-xl font-bold text-center">{card.frontText}</h3>
        </div>
        <div
          className={`absolute w-full h-full bg-blue-100 rounded-lg shadow-lg p-6 backface-hidden
          ${isFlipped ? "block" : "hidden"}`}
        >
          <h3 className="text-xl font-bold text-center">{card.backText}</h3>
        </div>
      </div>
    </motion.div>
  );
};
