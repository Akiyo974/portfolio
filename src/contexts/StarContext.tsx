import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

/**
 * Chasse aux étoiles : 3 étoiles cachées dans le site débloquent le jeu.
 * La progression est conservée dans le navigateur.
 */
export const STAR_LOCATIONS = ['hero', 'contact', 'footer'] as const;
export type StarLocation = (typeof STAR_LOCATIONS)[number];

const STORAGE_KEY = 'cd-stars';
const OPEN_EVENT = 'cd:open-star-game';

interface StarContextType {
  /** État de collecte par emplacement */
  stars: Record<string, boolean>;
  /** Collecte l'étoile d'un emplacement (définitif jusqu'à réinitialisation) */
  toggleStar: (location: string) => void;
  /** Remet la chasse à zéro */
  resetStars: () => void;
  /** Nombre total d'étoiles à trouver */
  totalStars: number;
  /** Nombre d'étoiles trouvées */
  collectedStars: number;
  /** Ouvre le jeu (une fois débloqué) */
  openGame: () => void;
}

const empty = (): Record<string, boolean> => Object.fromEntries(STAR_LOCATIONS.map((l) => [l, false]));

const load = (): Record<string, boolean> => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (saved && typeof saved === 'object') return { ...empty(), ...saved };
  } catch {
    /* stockage indisponible */
  }
  return empty();
};

const StarContext = createContext<StarContextType | undefined>(undefined);

export const StarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stars, setStars] = useState<Record<string, boolean>>(load);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stars));
    } catch {
      /* stockage indisponible */
    }
  }, [stars]);

  const toggleStar = useCallback((location: string) => {
    setStars((prev) => (prev[location] ? prev : { ...prev, [location]: true }));
  }, []);

  const resetStars = useCallback(() => setStars(empty()), []);
  const openGame = useCallback(() => window.dispatchEvent(new CustomEvent(OPEN_EVENT)), []);

  const totalStars = Object.keys(stars).length;
  const collectedStars = Object.values(stars).filter(Boolean).length;

  return (
    <StarContext.Provider value={{ stars, toggleStar, resetStars, totalStars, collectedStars, openGame }}>
      {children}
    </StarContext.Provider>
  );
};

export const STAR_GAME_OPEN_EVENT = OPEN_EVENT;

/**
 * Accès au contexte des étoiles (doit être utilisé dans un StarProvider).
 * @example
 * const { stars, toggleStar, collectedStars } = useStar();
 */
export const useStar = () => {
  const context = useContext(StarContext);
  if (context === undefined) {
    throw new Error('useStar must be used within a StarProvider');
  }
  return context;
};
