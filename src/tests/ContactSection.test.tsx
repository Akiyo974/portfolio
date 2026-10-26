import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from '../components/ContactSection';
import { StarProvider } from '../contexts/StarContext';
import emailjs from '@emailjs/browser';

vi.mock('@emailjs/browser', () => ({ default: { sendForm: vi.fn() } }));

describe('ContactSection Component', () => {
  it('should render contact form with all fields', () => {
    render(<StarProvider><ContactSection /></StarProvider>);
    
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /envoyer/i })).toBeInTheDocument();
  });

  it('should validate name field to accept only letters', async () => {
    const user = userEvent.setup();
    render(<StarProvider><ContactSection /></StarProvider>);
    
    const nameInput = screen.getByLabelText(/nom/i) as HTMLInputElement;
    await user.type(nameInput, 'John123');
    
    // Numbers should be filtered out
    expect(nameInput.value).toBe('John');
  });

  it('should have required attributes on form fields', () => {
    render(<StarProvider><ContactSection /></StarProvider>);
    
    const nameInput = screen.getByLabelText(/nom/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);
    
    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(messageInput).toHaveAttribute('required');
  });

  it('should have proper ARIA labels for accessibility', () => {
    render(<StarProvider><ContactSection /></StarProvider>);
    
    expect(screen.getByLabelText(/entrez votre nom complet/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/entrez votre adresse email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/entrez votre message/i)).toBeInTheDocument();
  });

  describe('envoi', () => {
    // Réponse d'EmailJS que le test déclenche quand il veut
    const pendingSend = () => {
      let resolve!: () => void;
      vi.mocked(emailjs.sendForm).mockReturnValue(
        new Promise((r) => { resolve = () => r({ status: 200, text: 'OK' }); }),
      );
      return () => resolve();
    };
    const form = () => screen.getByRole('button', { name: /envoyer/i }).closest('form')!;

    beforeEach(() => {
      vi.mocked(emailjs.sendForm).mockReset();
    });

    it("n'envoie qu'une fois même si on valide deux fois pendant l'envoi", async () => {
      const respond = pendingSend();
      render(<StarProvider><ContactSection /></StarProvider>);

      fireEvent.submit(form());
      fireEvent.submit(form());

      expect(emailjs.sendForm).toHaveBeenCalledTimes(1);
      expect(screen.getByRole('button', { name: /envoyer/i })).toBeDisabled();
      await act(async () => respond());
      expect(screen.getByRole('button', { name: /envoyer/i })).toBeEnabled();
    });

    it('masque le message 3 s après la réponse, même si elle arrive tard', async () => {
      vi.useFakeTimers();
      try {
        const respond = pendingSend();
        render(<StarProvider><ContactSection /></StarProvider>);
        fireEvent.submit(form());

        // EmailJS répond au bout de 5 s : le message doit tout de même s'afficher
        await act(async () => { vi.advanceTimersByTime(5000); });
        await act(async () => respond());
        expect(screen.getByRole('dialog')).toBeInTheDocument();

        await act(async () => { vi.advanceTimersByTime(3000); });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      } finally {
        vi.useRealTimers();
      }
    });
  });
});
