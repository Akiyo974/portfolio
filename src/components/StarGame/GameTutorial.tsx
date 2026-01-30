import React from 'react';
import { Star, Trophy } from 'lucide-react';

interface GameTutorialProps {
  onClose: () => void;
  onStartGame: () => void;
}

export const GameTutorial: React.FC<GameTutorialProps> = ({ onClose, onStartGame }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black p-6 rounded-xl max-w-lg w-full">
        <h3 className="text-xl font-bold mb-4">Comment jouer ?</h3>
        <ul className="space-y-4 mb-6">
          <li className="flex items-start gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-full">
              <Star className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-medium">Collectez les étoiles</p>
              <p className="text-sm text-gray-600">Cliquez sur les étoiles blanches pour gagner 1 point</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-full">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <p className="font-medium">Étoiles dorées</p>
              <p className="text-sm text-gray-600">Les étoiles dorées sont plus rares et valent 2 points !</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-full">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="font-medium">Marquez des points</p>
              <p className="text-sm text-gray-600">Collectez un maximum d'étoiles pour battre les records</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <div className="p-2 bg-yellow-400/20 rounded-full flex items-center justify-center text-lg font-bold text-yellow-400">
              15
            </div>
            <div>
              <p className="font-medium">Contre la montre</p>
              <p className="text-sm text-gray-600">Vous avez 15 secondes pour collecter un maximum d'étoiles</p>
            </div>
          </li>
        </ul>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border-2 border-black rounded-lg hover:bg-black/5 transition-colors"
          >
            Retour
          </button>
          <button
            onClick={() => {
              onClose();
              onStartGame();
            }}
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors"
          >
            Commencer
          </button>
        </div>
      </div>
    </div>
  );
};