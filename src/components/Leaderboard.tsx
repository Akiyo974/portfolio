import React from 'react';
import { Trophy, Star } from 'lucide-react';
import type { LeaderboardEntry } from '../lib/supabase';

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const getMedalColor = (position: number): string => {
  switch (position) {
    case 0: return 'text-yellow-400';
    case 1: return 'text-gray-300';
    case 2: return 'text-amber-600';
    default: return 'text-white/60';
  }
};

const getBackgroundGradient = (position: number): string => {
  switch (position) {
    case 0: return 'bg-gradient-to-r from-yellow-400/20 via-yellow-400/10 to-transparent';
    case 1: return 'bg-gradient-to-r from-gray-300/20 via-gray-300/10 to-transparent';
    case 2: return 'bg-gradient-to-r from-amber-600/20 via-amber-600/10 to-transparent';
    default: return 'bg-white/5';
  }
};

const getMedalEmoji = (position: number): string => {
  switch (position) {
    case 0: return '🥇';
    case 1: return '🥈';
    case 2: return '🥉';
    default: return '';
  }
};

export const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => {
  // Créer un tableau de 5 entrées, en remplissant les entrées manquantes avec des valeurs vides
  const displayedEntries = Array(5).fill(null).map((_, index) => 
    entries[index] || {
      id: `empty-${index}`,
      nickname: '---',
      score: 0,
      created_at: new Date().toISOString()
    }
  );

  return (
    <div className="w-full bg-white/10 rounded-2xl p-4 sm:p-6 backdrop-blur-md border border-white/20 shadow-xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-yellow-400/20 rounded-xl">
          <Trophy className="w-6 h-6 text-yellow-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Meilleurs scores</h3>
          <p className="text-xs text-white/60">Top 5</p>
        </div>
      </div>

      <div className="space-y-2">
        {displayedEntries.map((entry, index) => (
          <div
            key={entry.id}
            className={`group flex items-center justify-between p-3 rounded-xl transition-all duration-300 
              hover:scale-[1.02] hover:shadow-lg ${getBackgroundGradient(index)}`}
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                {index <= 2 ? (
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/10 
                    group-hover:scale-110 transition-transform ${getMedalColor(index)}`}>
                    <span className="text-lg" aria-label={`Position ${index + 1}`}>
                      {getMedalEmoji(index)}
                    </span>
                  </div>
                ) : (
                  <div className={`w-8 h-8 flex items-center justify-center rounded-full bg-white/10 
                    font-bold text-base ${getMedalColor(index)}`}>
                    #{index + 1}
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-wide text-white group-hover:text-white/90 transition-colors">
                  {entry.nickname}
                </span>
                <span className="text-xs text-white/60">
                  {entry.nickname !== '---' ? new Date(entry.created_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric'
                  }) : '---'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-1">
                  <span className="font-bold text-lg text-white group-hover:text-white/90 transition-colors">
                    {entry.score}
                  </span>
                  <Star className={`w-4 h-4 ${getMedalColor(index)} fill-current`} />
                </div>
                <span className="text-xs text-white/60">étoiles</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10">
        <p className="text-center text-xs text-white/60">
          Collectez plus d'étoiles pour grimper dans le classement !
        </p>
      </div>
    </div>
  );
};