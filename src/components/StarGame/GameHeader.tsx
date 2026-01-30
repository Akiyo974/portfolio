import React from 'react';
import { X } from 'lucide-react';

interface GameHeaderProps {
  onClose: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ onClose }) => {
  return (
    <div className="fixed top-4 right-4">
      <button
        onClick={onClose}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
        aria-label="Fermer le jeu"
      >
        <X className="w-6 h-6 text-white" />
      </button>
    </div>
  );
};