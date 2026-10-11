import { useEffect } from 'react';
import { acquireLenis, releaseLenis, scrollToTarget } from '../lib/motion';

/**
 * Initialise le défilement fluide (Lenis partagé, synchronisé avec GSAP ScrollTrigger)
 * et gère les liens `data-scroll-to="id"`.
 * @example
 * function MyComponent() {
 *   useLenis();
 *   return <div>Content</div>;
 * }
 */
export const useLenis = () => {
  useEffect(() => {
    acquireLenis();

    const handleAnchorClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest('a, button');
      const targetId = anchor?.getAttribute('data-scroll-to');
      if (targetId && document.getElementById(targetId)) {
        e.preventDefault();
        scrollToTarget(targetId);
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      releaseLenis();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};
