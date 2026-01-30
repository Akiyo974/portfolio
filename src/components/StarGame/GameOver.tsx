import React from 'react';
import { Trophy, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Leaderboard } from '../Leaderboard';
import type { LeaderboardEntry } from '../../lib/supabase';

interface GameOverProps {
  score: number;
  isTop3: boolean;
  showNickname: boolean;
  nickname: string;
  setNickname: (value: string) => void;
  isSubmitting: boolean;
  onSubmitScore: () => void;
  onRestart: () => void;
  onClose: () => void;
  leaderboard: LeaderboardEntry[];
}

export const GameOver: React.FC<GameOverProps> = ({
  score,
  isTop3,
  showNickname,
  nickname,
  setNickname,
  isSubmitting,
  onSubmitScore,
  onRestart,
  onClose,
  leaderboard,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Leaderboard */}
          <div className="lg:order-2">
            <Leaderboard entries={leaderboard} />
          </div>

          {/* Game Over Card */}
          <div className="lg:order-1">
            <motion.div 
              className="bg-gradient-to-br from-white to-gray-100 text-black rounded-2xl shadow-2xl relative overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Cercles décoratifs */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-yellow-100 rounded-full opacity-50" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-yellow-50 rounded-full opacity-50" />

              {/* Contenu */}
              <div className="relative z-10 p-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="mx-auto mb-6 w-24 h-24"
                >
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 w-full h-full rounded-2xl flex items-center justify-center shadow-lg transform -rotate-12">
                    <Trophy className="w-14 h-14 text-white" />
                  </div>
                </motion.div>

                <div className="text-center">
                  <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">
                    Partie terminée !
                  </h2>

                  {isTop3 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-gradient-to-r from-yellow-100 to-yellow-50 text-yellow-800 px-6 py-3 rounded-xl mb-6 shadow-inner mx-auto max-w-sm"
                    >
                      <p className="text-lg font-semibold">🎉 Félicitations ! 🎉</p>
                      <p className="text-sm">Vous êtes dans le top 3 !</p>
                    </motion.div>
                  )}

                  <div className="inline-flex items-center justify-center gap-3 mb-8 bg-black/5 py-4 px-8 rounded-xl">
                    <Star className="w-7 h-7 text-yellow-500" />
                    <p className="text-3xl font-bold">
                      Score : <span className="text-yellow-500">{score}</span>
                    </p>
                  </div>

                  {showNickname ? (
                    <div className="space-y-6 max-w-sm mx-auto">
                      <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                          Entrez votre pseudo (3 caractères)
                        </label>
                        <input
                          type="text"
                          id="nickname"
                          maxLength={3}
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value.toUpperCase())}
                          className="w-full px-4 py-3 bg-black text-white border-2 border-transparent rounded-xl focus:outline-none focus:border-yellow-400 transition-colors text-center text-2xl tracking-wider"
                          disabled={isSubmitting}
                          placeholder="AAA"
                        />
                      </div>
                      <div className="flex gap-4">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onSubmitScore}
                          disabled={nickname.length !== 3 || isSubmitting}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg font-medium"
                        >
                          {isSubmitting ? 'Enregistrement...' : 'Enregistrer le score'}
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={onClose}
                          className="px-6 py-3 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-colors duration-300 font-medium"
                        >
                          Fermer
                        </motion.button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 max-w-sm mx-auto">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onRestart}
                        className="w-full px-6 py-4 bg-gradient-to-r from-black to-gray-800 text-white rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg font-medium"
                      >
                        Rejouer
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onClose}
                        className="w-full px-6 py-4 border-2 border-black rounded-xl hover:bg-black hover:text-white transition-colors duration-300 font-medium"
                      >
                        Fermer
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};