import { describe, it, expect } from 'vitest';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { renderHook } from '@testing-library/react';

describe('useReducedMotion', () => {
  it('devrait retourner false par défaut', () => {
    // Mock de matchMedia
    window.matchMedia = (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(false);
  });

  it('devrait retourner true si prefers-reduced-motion est activé', () => {
    // Mock de matchMedia avec reduced motion activé
    window.matchMedia = (query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true,
    });

    const { result } = renderHook(() => useReducedMotion());
    expect(result.current).toBe(true);
  });
});
