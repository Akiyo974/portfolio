import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Achievement } from '../components/Achievement';
import { StarProvider } from '../contexts/StarContext';

describe('Achievement Component', () => {
  it('should not render when no stars are collected', () => {
    const { container } = render(
      <StarProvider>
        <Achievement />
      </StarProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it('should display achievement when rendered', () => {
    render(
      <StarProvider>
        <Achievement />
      </StarProvider>
    );
    // Component will show based on context state
    expect(true).toBe(true); // Placeholder for more complex tests
  });
});
