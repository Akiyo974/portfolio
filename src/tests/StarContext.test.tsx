import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StarProvider, useStar } from '../contexts/StarContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <StarProvider>{children}</StarProvider>
);

describe('StarContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initialise trois étoiles à trouver', () => {
    const { result } = renderHook(() => useStar(), { wrapper });

    expect(result.current.totalStars).toBe(3);
    expect(result.current.collectedStars).toBe(0);
    expect(result.current.stars).toEqual({ hero: false, contact: false, footer: false });
  });

  it('collecte une étoile', () => {
    const { result } = renderHook(() => useStar(), { wrapper });

    act(() => {
      result.current.toggleStar('hero');
    });

    expect(result.current.stars.hero).toBe(true);
    expect(result.current.collectedStars).toBe(1);
  });

  it('une étoile trouvée le reste (pas de dé-collecte)', () => {
    const { result } = renderHook(() => useStar(), { wrapper });

    act(() => {
      result.current.toggleStar('hero');
      result.current.toggleStar('hero');
    });

    expect(result.current.stars.hero).toBe(true);
    expect(result.current.collectedStars).toBe(1);
  });

  it('compte toutes les étoiles et se réinitialise', () => {
    const { result } = renderHook(() => useStar(), { wrapper });

    act(() => {
      result.current.toggleStar('hero');
      result.current.toggleStar('contact');
      result.current.toggleStar('footer');
    });
    expect(result.current.collectedStars).toBe(3);

    act(() => {
      result.current.resetStars();
    });
    expect(result.current.collectedStars).toBe(0);
  });

  it('conserve la progression entre deux visites', () => {
    const first = renderHook(() => useStar(), { wrapper });
    act(() => {
      first.result.current.toggleStar('footer');
    });
    first.unmount();

    const second = renderHook(() => useStar(), { wrapper });
    expect(second.result.current.stars.footer).toBe(true);
  });
});
