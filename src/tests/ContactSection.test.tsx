import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ContactSection } from '../components/ContactSection';
import { StarProvider } from '../contexts/StarContext';

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
});
