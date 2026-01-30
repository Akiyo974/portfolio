/**
 * Normalizes text by converting to lowercase, removing accents, and trimming whitespace
 * @param text - The text to normalize
 * @returns Normalized text string
 * @example
 * normalizeText('Café') // returns 'cafe'
 */
export const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};
