import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { StarProvider, useStar } from '../contexts/StarContext';
import { ReactNode } from 'react';

const wrapper = ({ children }: { children: ReactNode }) => (
  <StarProvider>{children}</StarProvider>
);

describe('StarContext', () => {
  it('should initialize with correct default values', () => {
    const { result } = renderHook(() => useStar(), { wrapper });
    
    expect(result.current.totalStars).toBe(2);
    expect(result.current.collectedStars).toBe(0);
    expect(result.current.stars).toEqual({ hero: false, footer: false });
  });

  it('should toggle star state', () => {
    const { result } = renderHook(() => useStar(), { wrapper });
    
    act(() => {
      result.current.toggleStar('hero');
    });
    
    expect(result.current.stars.hero).toBe(true);
    expect(result.current.collectedStars).toBe(1);
  });

  it('should untoggle star when toggled twice', () => {
    const { result } = renderHook(() => useStar(), { wrapper });
    
    act(() => {
      result.current.toggleStar('hero');
      result.current.toggleStar('hero');
    });
    
    expect(result.current.stars.hero).toBe(false);
    expect(result.current.collectedStars).toBe(0);
  });

  it('should count collected stars correctly', () => {
    const { result } = renderHook(() => useStar(), { wrapper });
    
    act(() => {
      result.current.toggleStar('hero');
      result.current.toggleStar('footer');
    });
    
    expect(result.current.collectedStars).toBe(2);
    expect(result.current.totalStars).toBe(2);
  });
});
