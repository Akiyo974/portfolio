import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * Star collection context for gamification features
 * Manages star collection state across the portfolio
 */
interface StarContextType {
  /** Object mapping location IDs to their collected state */
  stars: { [key: string]: boolean };
  /** Function to toggle star collection at a specific location */
  toggleStar: (location: string) => void;
  /** Total number of collectible stars */
  totalStars: number;
  /** Number of stars currently collected */
  collectedStars: number;
}

const StarContext = createContext<StarContextType | undefined>(undefined);

export const StarProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stars, setStars] = useState<{ [key: string]: boolean }>({
    hero: false,
    footer: false,
  });

  const toggleStar = (location: string) => {
    setStars(prev => ({
      ...prev,
      [location]: !prev[location]
    }));
  };

  const totalStars = Object.keys(stars).length;
  const collectedStars = Object.values(stars).filter(Boolean).length;

  return (
    <StarContext.Provider value={{ stars, toggleStar, totalStars, collectedStars }}>
      {children}
    </StarContext.Provider>
  );
};

/**
 * Hook to access star collection context
 * Must be used within a StarProvider
 * @throws Error if used outside of StarProvider
 * @returns StarContextType with star state and actions
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