import React, { useState, useEffect, useCallback } from 'react';
import { useStar } from '../../contexts/StarContext';
import { supabase, type LeaderboardEntry } from '../../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { GameHeader } from './GameHeader';
import { GameIntro } from './GameIntro';
import { GamePlay } from './GamePlay';
import { GameOver } from './GameOver';
import { GameTutorial } from './GameTutorial';

interface GameStar {
  id: number;
  x: number;
  y: number;
  isGolden: boolean;
}

export const StarGame = () => {
  const { collectedStars, totalStars } = useStar();
  const [isActive, setIsActive] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [gameStars, setGameStars] = useState<GameStar[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [gameOver, setGameOver] = useState(false);
  const [nickname, setNickname] = useState('');
  const [showNickname, setShowNickname] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isTop3, setIsTop3] = useState(false);

  const createStar = useCallback(() => {
    const isGolden = Math.random() < 0.1; // 10% de chance d'être une étoile dorée
    return {
      id: Date.now() + Math.random(),
      x: Math.random() * (window.innerWidth - 100),
      y: Math.random() * (window.innerHeight - 100),
      isGolden,
    };
  }, []);

  const initializeStars = useCallback(() => {
    const initialStars = Array.from({ length: 5 }, () => createStar());
    setGameStars(initialStars);
  }, [createStar]);

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    const colors = ['#FFD700', '#FFA500', '#FF4500'];

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.8 },
        colors: colors
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.8 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const startGame = () => {
    setShowIntro(false);
    setScore(0);
    setTimeLeft(15);
    setGameOver(false);
    setShowNickname(false);
    setNickname('');
    setShowLeaderboard(false);
    setIsTop3(false);
    initializeStars();
  };

  const collectStar = (id: number, isGolden: boolean) => {
    setScore(prev => prev + (isGolden ? 2 : 1));
    setGameStars(prev => {
      const remaining = prev.filter(star => star.id !== id);
      return [...remaining, createStar()];
    });
  };

  const fetchLeaderboard = async () => {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .limit(5);

    if (!error && data) {
      setLeaderboard(data);
      setShowLeaderboard(true);
    }
  };

  const submitScore = async () => {
    if (nickname.length !== 3) return;
    
    setIsSubmitting(true);
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([{ 
        nickname: nickname.toUpperCase(), 
        score,
        created_at: new Date().toISOString()
      }])
      .select();

    if (!error) {
      await fetchLeaderboard();
      setShowNickname(false);

      const { data: topScores } = await supabase
        .from('leaderboard')
        .select('score')
        .order('score', { ascending: false })
        .limit(3);

      if (topScores && topScores.some(topScore => topScore.score <= score)) {
        setIsTop3(true);
        triggerConfetti();
      }
    }
    setIsSubmitting(false);
  };

  useEffect(() => {
    if (collectedStars === totalStars) {
      const timer = setTimeout(() => {
        setIsActive(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [collectedStars, totalStars]);

  useEffect(() => {
    if (!gameOver && !showIntro && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      setShowNickname(true);
      fetchLeaderboard();
    }
  }, [timeLeft, gameOver, showIntro]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 overflow-y-auto"
      >
        <GameHeader onClose={() => setIsActive(false)} />

        {showIntro ? (
          <GameIntro
            onStartGame={startGame}
            onShowTutorial={() => setShowTutorial(true)}
            onClose={() => setIsActive(false)}
          />
        ) : !gameOver ? (
          <GamePlay
            score={score}
            timeLeft={timeLeft}
            gameStars={gameStars}
            onCollectStar={collectStar}
          />
        ) : (
          <GameOver
            score={score}
            isTop3={isTop3}
            showNickname={showNickname}
            nickname={nickname}
            setNickname={setNickname}
            isSubmitting={isSubmitting}
            onSubmitScore={submitScore}
            onRestart={startGame}
            onClose={() => setIsActive(false)}
            leaderboard={leaderboard}
          />
        )}

        {showTutorial && (
          <GameTutorial
            onClose={() => setShowTutorial(false)}
            onStartGame={startGame}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};