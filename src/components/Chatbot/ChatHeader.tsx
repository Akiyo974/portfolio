import React from 'react';
import { MessageCircle, X, MinusSquare, Maximize2 } from 'lucide-react';

interface ChatHeaderProps {
  botName: string;
  isMinimized: boolean;
  onMinimize: () => void;
  onClose: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({
  botName,
  isMinimized,
  onMinimize,
  onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-white" />
        <span className="font-medium text-white">{botName}</span>
      </div>
      <div className="flex gap-1">
        <button
          onClick={onMinimize}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label={isMinimized ? "Agrandir" : "Réduire"}
        >
          {isMinimized ? (
            <Maximize2 className="w-4 h-4 text-white" />
          ) : (
            <MinusSquare className="w-4 h-4 text-white" />
          )}
        </button>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Fermer"
        >
          <X className="w-4 h-4 text-white" />
        </button>
      </div>
    </div>
  );
};