import { describe, it, expect } from 'vitest';
import { normalizeText } from '../utils/textUtils';

/**
 * Test suite for text utility functions
 */
describe('Text Utils', () => {
  describe('normalizeText', () => {
    it('should convert text to lowercase', () => {
      expect(normalizeText('HELLO')).toBe('hello');
    });

    it('should remove accents from characters', () => {
      expect(normalizeText('café')).toBe('cafe');
      expect(normalizeText('naïve')).toBe('naive');
    });

    it('should trim whitespace', () => {
      expect(normalizeText('  hello  ')).toBe('hello');
    });

    it('should handle empty strings', () => {
      expect(normalizeText('')).toBe('');
    });
  });
});
