import React, { useEffect, useRef } from 'react';
import { Message } from './types';
import { MessageBubble } from './MessageBubble';

interface ChatMessagesProps {
  messages: Message[];
  isTyping: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({
  messages,
  isTyping,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto">
      {messages.map((message, index) => (
        <MessageBubble key={index} message={message} />
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-white/10 text-white rounded-lg px-4 py-2">
            <p className="text-sm">En train d'écrire...</p>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};