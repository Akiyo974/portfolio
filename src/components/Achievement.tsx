import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STAR_LOCATIONS, useStar } from '../contexts/StarContext';

/**
 * Notification de progression de la chasse aux étoiles, avec un indice pour la suivante.
 */
export const Achievement = () => {
  const { t } = useTranslation();
  const { stars, collectedStars, totalStars } = useStar();
  const [show, setShow] = useState(false);
  const prev = useRef(collectedStars);

  useEffect(() => {
    const increased = collectedStars > prev.current;
    prev.current = collectedStars;
    if (!increased) return;
    setShow(true);
    const timer = setTimeout(() => setShow(false), 4200);
    return () => clearTimeout(timer);
  }, [collectedStars]);

  if (!show) return null;

  const complete = collectedStars === totalStars;
  const next = STAR_LOCATIONS.find((l) => !stars[l]);
  const hints: Record<string, string> = {
    hero: t('game.hintHero', { defaultValue: "Indice : tout en haut de l'accueil." }),
    contact: t('game.hintContact', { defaultValue: 'Indice : près du formulaire de contact.' }),
    footer: t('game.hintFooter', { defaultValue: 'Indice : tout en bas de la page.' }),
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4" role="status" aria-live="polite" aria-atomic="true">
      <div className="animate-fade-in crosshair w-full max-w-sm border border-line bg-ink/95 p-4 backdrop-blur-md">
        <div className="flex items-baseline justify-between">
          <p className="label text-paper">✦ {t('game.found', { defaultValue: 'Étoile trouvée' })}</p>
          <p className="font-mono text-[12px] tabular-nums text-paper">
            {collectedStars} / {totalStars}
          </p>
        </div>
        <div className="mt-3 flex gap-1" aria-hidden="true">
          {Array.from({ length: totalStars }, (_, i) => (
            <span key={i} className={`h-1 flex-1 ${i < collectedStars ? 'bg-paper' : 'bg-line'}`} />
          ))}
        </div>
        <p className="mt-3 text-sm text-paper/80">
          {complete ? t('game.unlockedToast', { defaultValue: 'Toutes les étoiles sont trouvées — un jeu se débloque…' }) : next ? hints[next] : ''}
        </p>
      </div>
    </div>
  );
};
