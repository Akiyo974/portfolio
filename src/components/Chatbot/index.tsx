import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, MinusSquare, Maximize2 } from 'lucide-react';
import { handleMessage } from './botLogic/messageHandler';

interface ChatbotProps {
  botName?: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
}

interface Message {
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC<ChatbotProps> = ({
  botName = 'Assistant',
  welcomeMessage = 'Bonjour ! Comment puis-je vous aider aujourd\'hui ?',
  position = 'bottom-right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      content: welcomeMessage,
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      content: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await handleMessage(inputMessage);
      const botResponse: Message = {
        content: response,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      const errorResponse: Message = {
        content: "Désolé, je n'ai pas pu traiter votre message. Veuillez réessayer.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const positionClass = position === 'bottom-right' ? 'right-4' : 'left-4';

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed ${positionClass} bottom-4 p-3 bg-black border border-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50`}
        aria-label="Ouvrir le chat"
      >
        <MessageCircle className="w-5 h-5 text-white" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${positionClass} bottom-4 w-80 md:w-96 ${
        isMinimized ? 'h-12' : 'h-[480px]'
      } bg-black border border-white/10 rounded-lg shadow-lg flex flex-col transition-all duration-300 z-50`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-white" />
          <span className="font-medium text-white">{botName}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
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
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            aria-label="Fermer"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div 
            className="flex-1 p-4 space-y-4 overflow-y-auto"
            role="log"
            aria-live="polite"
            aria-atomic="false"
            aria-label="Historique de conversation"
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isBot
                      ? 'bg-white/10 text-white'
                      : 'bg-white text-black'
                  }`}
                  role="article"
                  aria-label={message.isBot ? 'Message du chatbot' : 'Votre message'}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-50 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start" role="status" aria-live="polite">
                <div className="bg-white/10 text-white rounded-lg px-4 py-2">
                  <p className="text-sm">En train d'écrire...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tapez votre message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-colors"
                aria-label="Saisir un message pour le chatbot"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="p-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
                aria-label="Envoyer le message"
              >
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};