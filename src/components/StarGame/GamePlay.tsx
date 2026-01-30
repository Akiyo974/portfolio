import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

interface Star {
  id: number;
  x: number;
  y: number;
  isGolden: boolean;
}

interface GamePlayProps {
  score: number;
  timeLeft: number;
  gameStars: Star[];
  onCollectStar: (id: number, isGolden: boolean) => void;
}

export const GamePlay: React.FC<GamePlayProps> = ({
  score,
  timeLeft,
  gameStars,
  onCollectStar,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full h-screen"
    >
      <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-3 rounded-full z-10 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Star className="w-4 h-4" />
          <span className="font-bold text-base">{score}</span>
        </div>
        <div className="w-px h-4 bg-white/20" />
        <div className="flex items-center gap-2">
          <span className={`font-bold text-base ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
            {timeLeft}s
          </span>
        </div>
      </div>
      
      {gameStars.map(star => (
        <motion.button
          key={star.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          onClick={() => onCollectStar(star.id, star.isGolden)}
          className="absolute p-2 hover:scale-125 transition-transform duration-300 cursor-pointer"
          style={{ 
            left: `${star.x}px`, 
            top: `${star.y}px`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <Star 
            className={`w-6 h-6 text-white fill-white animate-pulse ${
              star.isGolden ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]' : ''
            }`}
          />
          {star.isGolden && (
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-400/20"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.button>
      ))}
    </motion.div>
  );
};