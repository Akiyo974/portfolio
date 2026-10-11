import { describe, expect, it } from 'vitest';
import en from '../i18n/locales/en.json';
import fr from '../i18n/locales/fr.json';

// Toute clé absente d'une langue retomberait sur la langue de repli (anglais) :
// une page française afficherait alors du texte anglais.
const keys = (o: Record<string, unknown>, prefix = ''): string[] =>
  Object.entries(o).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v) ? keys(v as Record<string, unknown>, `${prefix}${k}.`) : [`${prefix}${k}`]
  );

describe('traductions FR / EN', () => {
  it('ont exactement les mêmes clés', () => {
    const enKeys = new Set(keys(en));
    const frKeys = new Set(keys(fr));
    expect([...enKeys].filter((k) => !frKeys.has(k))).toEqual([]);
    expect([...frKeys].filter((k) => !enKeys.has(k))).toEqual([]);
  });
});
