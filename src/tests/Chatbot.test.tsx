import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Chatbot } from '../components/Chatbot/Chatbot';

vi.mock('../components/Chatbot/botLogic/messageHandler', () => ({
  handleMessage: (message: string) => {
    if (/bonjour|salut|hello/i.test(message)) {
      return "Bonjour ! Comment puis-je vous aider ?";
    }
    if (/projet/i.test(message)) {
      return "Je peux vous parler de CTREQ, Webana, AkiProject et AkiMusic.";
    }
    return "Je ne suis pas sûr de comprendre.";
  }
}));

describe('Chatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('devrait afficher le bouton de chat', () => {
    render(<Chatbot />);
    const chatButton = screen.getByRole('button', { name: /chat/i });
    expect(chatButton).toBeInTheDocument();
  });

  it('devrait ouvrir la fenêtre de chat au clic', async () => {
    render(<Chatbot />);
    const chatButton = screen.getByRole('button', { name: /chat/i });
    
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Tapez votre message/i)).toBeInTheDocument();
    });
  });

  it('devrait afficher le message de bienvenue à l\'ouverture', async () => {
    const welcomeMessage = "Bonjour ! Je suis l'assistant virtuel.";
    render(<Chatbot welcomeMessage={welcomeMessage} />);
    
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByText(welcomeMessage)).toBeInTheDocument();
    });
  });

  it('devrait envoyer un message et recevoir une réponse', async () => {
    render(<Chatbot />);
    
    // Ouvrir le chat
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Tapez votre message/i);
      expect(input).toBeInTheDocument();
    });
    
    // Envoyer un message
    const input = screen.getByPlaceholderText(/Tapez votre message/i);
    fireEvent.change(input, { target: { value: 'Bonjour' } });
    
    const sendButton = screen.getByRole('button', { name: /envoyer/i });
    fireEvent.click(sendButton);
    
    // Vérifier la réponse
    await waitFor(() => {
      expect(screen.getByText(/Comment puis-je vous aider/i)).toBeInTheDocument();
    });
  });

  it('devrait utiliser le nom du bot personnalisé', async () => {
    const customName = "Aki Assistant";
    render(<Chatbot botName={customName} />);
    
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByText(customName)).toBeInTheDocument();
    });
  });

  it('devrait fermer la fenêtre de chat', async () => {
    render(<Chatbot />);
    
    // Ouvrir le chat
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Tapez votre message/i)).toBeInTheDocument();
    });
    
    // Fermer le chat
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/Tapez votre message/i)).not.toBeInTheDocument();
    });
  });

  it('devrait ne pas envoyer de message vide', async () => {
    render(<Chatbot />);
    
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Tapez votre message/i);
      expect(input).toBeInTheDocument();
    });
    
    const sendButton = screen.getByRole('button', { name: /envoyer/i });
    const initialMessagesCount = screen.getAllByRole('listitem').length;
    
    // Essayer d'envoyer sans texte
    fireEvent.click(sendButton);
    
    // Le nombre de messages ne devrait pas changer
    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(initialMessagesCount);
    });
  });
});
