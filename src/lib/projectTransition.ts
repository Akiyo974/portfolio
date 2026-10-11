import { useCallback } from 'react';
import type React from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';

/**
 * Transition « image partagée » vers une étude de cas :
 * l'image tramée du projet s'agrandit depuis sa position jusqu'au plein écran,
 * la page change dessous (sans rideau), puis l'image se retire vers le haut.
 */
let overlay: HTMLDivElement | null = null;
let pending = false;

/** Lu par PageTransition (sans le consommer : le rendu peut être rejoué) : pas de rideau d'entrée. */
export const isImageTransitionPending = () => pending;

const zoomToFullscreen = (from: HTMLElement, src: string) =>
  new Promise<void>((resolve) => {
    const r = from.getBoundingClientRect();
    overlay?.remove();
    overlay = document.createElement('div');
    overlay.setAttribute('aria-hidden', 'true');
    Object.assign(overlay.style, {
      position: 'fixed',
      left: `${r.left}px`,
      top: `${r.top}px`,
      width: `${r.width}px`,
      height: `${r.height}px`,
      zIndex: '96',
      backgroundColor: '#050505',
      backgroundImage: `url("${src}")`,
      backgroundSize: 'cover',
      backgroundPosition: 'center top',
      pointerEvents: 'none',
      willChange: 'left, top, width, height',
    } satisfies Partial<CSSStyleDeclaration>);
    document.body.appendChild(overlay);
    // Filet de sécurité : si l'animation est suspendue (onglet en arrière-plan…), on navigue quand même
    window.setTimeout(resolve, 1200);
    gsap.to(overlay, {
      left: 0,
      top: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      duration: 0.75,
      ease: 'expo.inOut',
      onComplete: resolve,
    });
  });

/** Appelé par l'étude de cas une fois affichée : l'image se retire vers le haut. */
export const finishImageTransition = () => {
  pending = false;
  const el = overlay;
  if (!el) return;
  overlay = null;
  gsap.to(el, {
    clipPath: 'inset(0% 0% 100% 0%)',
    duration: 0.85,
    ease: 'expo.inOut',
    delay: 0.1,
    onComplete: () => el.remove(),
  });
};

/**
 * Gestionnaire de clic pour les liens vers une étude de cas.
 * Clic normal uniquement (pas de nouvel onglet, pas de mouvement réduit) ; sinon navigation classique.
 */
export const useProjectTransition = () => {
  const navigate = useNavigate();
  return useCallback(
    (e: React.MouseEvent, id: string, imageEl?: HTMLElement | null) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || reduce) return;
      const from = imageEl ?? (e.currentTarget as HTMLElement);
      e.preventDefault();
      pending = true;
      void zoomToFullscreen(from, `/assets/art/${id}-halftone.png`).then(() => navigate(`/project/${id}`));
    },
    [navigate]
  );
};
