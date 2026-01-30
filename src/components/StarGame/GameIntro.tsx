import React from 'react';
import { Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface GameIntroProps {
  onStartGame: () => void;
  onShowTutorial: () => void;
  onClose: () => void;
}

export const GameIntro: React.FC<GameIntroProps> = ({
  onStartGame,
  onShowTutorial,
  onClose,
}) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="bg-white text-black p-6 rounded-xl text-center w-full max-w-lg mx-auto shadow-2xl">
        <div className="p-4 bg-yellow-400/20 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center">
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Félicitations !</h2>
        <p className="text-base mb-6 text-gray-600">
          Vous avez découvert le jeu secret des étoiles ! Collectez autant d'étoiles que possible en 15 secondes.
        </p>
        <div className="space-y-4">
          <button
            onClick={onShowTutorial}
            className="w-full px-6 py-4 bg-black text-white rounded-xl font-semibold hover:bg-black/90 transition-colors"
          >
            Comment jouer ?
          </button>
          <button
            onClick={onStartGame}
            className="w-full px-6 py-4 bg-yellow-400 text-black rounded-xl font-semibold hover:bg-yellow-500 transition-colors"
          >
            Commencer le jeu
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-4 border-2 border-black rounded-xl font-semibold hover:bg-black/5 transition-colors"
          >
            Peut-être plus tard
          </button>
        </div>
      </div>
    </motion.div>
  );
};