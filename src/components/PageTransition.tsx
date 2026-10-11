import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const ease = [0.76, 0, 0.24, 1] as const;


/**
 * Transition de page : rideau noir qui couvre puis découvre l'écran.
 */
export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const location = useLocation();
  // Pas de rideau sur la toute première page affichée (le préchargeur s'en charge)
  const [initialKey] = React.useState(location.key);
  const skipCurtain = location.key === initialKey;

  useEffect(() => {
    // Force immediate scroll to top
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname]);

  return (
    <motion.div key={location.pathname} initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 1 }}>
      {children}
      {/* sortie : le rideau monte depuis le bas */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] origin-bottom border-t border-line bg-stage"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 1 }}
        transition={{ duration: 0.55, ease }}
      />
      {/* entrée : le rideau se retire vers le haut */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[95] flex origin-top items-center justify-center border-b border-line bg-stage"
        initial={skipCurtain ? false : { scaleY: 1 }}
        animate={{ scaleY: 0 }}
        exit={{ scaleY: 0 }}
        transition={{ duration: 0.65, ease, delay: 0.05 }}
      >
        <span className="label text-paper/70">{location.pathname === '/' ? 'Index' : location.pathname.split('/').filter(Boolean).join(' / ')}</span>
      </motion.div>
    </motion.div>
  );
};
