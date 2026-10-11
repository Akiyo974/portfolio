import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Chatbot } from '../components/Chatbot/Chatbot';

vi.mock('../components/Chatbot/botLogic/messageHandler', () => ({
  handleMessage: (message: string) => {
    if (/bonjour|salut|hello/i.test(message)) {
      return 'Bonjour ! Comment puis-je vous aider ?';
    }
    if (/projet/i.test(message)) {
      return 'Je peux vous parler de CTREQ, Webana, AkiProject et AkiMusic.';
    }
    return 'Je ne suis pas sûr de comprendre.';
  }
}));

describe('Chatbot', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('devrait suivre le viewport visuel lorsque le clavier réduit la zone visible', async () => {
    const viewport = Object.assign(new EventTarget(), { width: 390, height: 844, offsetTop: 0, offsetLeft: 0 });
    vi.stubGlobal('visualViewport', viewport);
    const removeListener = vi.spyOn(viewport, 'removeEventListener');
    const { unmount } = render(<Chatbot />);
    fireEvent.click(screen.getByRole('button', { name: /chat/i }));

    const panel = await screen.findByRole('dialog');
    expect(panel).toHaveStyle({ '--chat-viewport-width': '390px', '--chat-viewport-height': '844px' });

    viewport.height = 360;
    act(() => viewport.dispatchEvent(new Event('resize')));
    expect(panel).toHaveStyle({ '--chat-viewport-height': '360px' });

    viewport.offsetTop = 120;
    viewport.offsetLeft = 5;
    act(() => viewport.dispatchEvent(new Event('scroll')));
    expect(panel).toHaveStyle({ '--chat-viewport-top': '120px', '--chat-viewport-left': '5px' });

    viewport.width = 844;
    viewport.height = 390;
    fireEvent(window, new Event('resize'));
    expect(panel).toHaveStyle({ '--chat-viewport-width': '844px', '--chat-viewport-height': '390px' });

    unmount();
    expect(removeListener).toHaveBeenCalledWith('resize', expect.any(Function));
    expect(removeListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('devrait fonctionner sans API VisualViewport', async () => {
    vi.stubGlobal('visualViewport', undefined);
    render(<Chatbot />);
    fireEvent.click(screen.getByRole('button', { name: /chat/i }));
    expect(await screen.findByRole('dialog')).toHaveStyle({
      '--chat-viewport-width': `${window.innerWidth}px`,
      '--chat-viewport-height': `${window.innerHeight}px`,
    });
  });

  it('devrait rendre le focus au bouton de chat après Échap', async () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByRole('button', { name: /chat/i }));
    await screen.findByRole('textbox');
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(screen.getByRole('button', { name: /chat/i })).toHaveFocus());
  });

  it('devrait agrandir un panneau réduit lors du passage au format mobile', async () => {
    render(<Chatbot />);
    fireEvent.click(screen.getByRole('button', { name: /chat/i }));
    const panel = await screen.findByRole('dialog');
    fireEvent.click(screen.getByRole('button', { name: 'Réduire' }));
    expect(panel).toHaveAttribute('data-minimized', 'true');

    vi.stubGlobal('innerWidth', 390);
    fireEvent(window, new Event('resize'));
    expect(panel).toHaveAttribute('data-minimized', 'false');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
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
      expect(screen.getByRole('textbox')).toBeInTheDocument();
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
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
    
    // Envoyer un message
    const input = screen.getByRole('textbox');
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
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
    
    // Fermer le chat
    const closeButton = screen.getByRole('button', { name: /fermer/i });
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });

  it('devrait ne pas envoyer de message vide', async () => {
    render(<Chatbot />);
    
    const chatButton = screen.getByRole('button', { name: /chat/i });
    fireEvent.click(chatButton);
    
    await waitFor(() => {
      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
    });
    
    const sendButton = screen.getByRole('button', { name: /envoyer/i });
    expect(sendButton).toBeDisabled();
    
    // Essayer d'envoyer sans texte
    fireEvent.click(sendButton);
    
    // Le bouton reste desactive sans saisie
    await waitFor(() => {
      expect(sendButton).toBeDisabled();
    });
  });
});
