import React from 'react';

export type MessageType = {
  content: string;
  isBot: boolean;
  timestamp: Date;
};

interface ChatMessageProps {
  message: MessageType;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-3`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 ${
          message.isBot
            ? 'bg-gray-100 text-gray-900'
            : 'bg-black text-white'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className={`text-[10px] mt-1 block ${
          message.isBot ? 'text-gray-500' : 'text-gray-300'
        }`}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};