import React from 'react';
import { Message } from './types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`max-w-[80%] p-3 rounded-lg ${
          message.isBot
            ? 'bg-white/10 text-white'
            : 'bg-white text-black'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-50 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};