import React, { useState } from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { Message } from './types';

interface ChatWindowProps {
  botName: string;
  welcomeMessage: string;
  position: 'bottom-right' | 'bottom-left';
  onClose: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  botName,
  welcomeMessage,
  position,
  onClose,
}) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: welcomeMessage,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  return (
    <div
      className={`fixed ${positionClass} bottom-4 w-80 md:w-96 ${
        isMinimized ? 'h-12' : 'h-[480px]'
      } bg-black border border-white/10 rounded-lg shadow-lg flex flex-col transition-all duration-300 z-50`}
    >
      <ChatHeader
        botName={botName}
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized(!isMinimized)}
        onClose={onClose}
      />

      {!isMinimized && (
        <>
          <ChatMessages
            messages={messages}
            isTyping={isTyping}
          />
          <ChatInput
            messages={messages}
            setMessages={setMessages}
            isTyping={isTyping}
            setIsTyping={setIsTyping}
          />
        </>
      )}
    </div>
  );
};