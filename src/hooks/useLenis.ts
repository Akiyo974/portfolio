import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';

/**
 * Custom hook to initialize and configure Lenis smooth scroll
 * Provides smooth scrolling with customizable easing and anchor link support
 * @example
 * function MyComponent() {
 *   useLenis();
 *   return <div>Content</div>;
 * }
 */
export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Add scroll to anchor functionality
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a, button');
      
      if (anchor && anchor.hasAttribute('data-scroll-to')) {
        e.preventDefault();
        const targetId = anchor.getAttribute('data-scroll-to');
        if (targetId) {
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            lenis.scrollTo(targetElement, {
              offset: 0,
              duration: 1.5,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenis.destroy();
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);
};