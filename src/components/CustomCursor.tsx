import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const cursor = cursorRef.current;
    const cursorDot = cursorDotRef.current;
    if (!cursor || !cursorDot) return;

    const onMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) {
        gsap.set(cursor, { x: e.clientX, y: e.clientY });
        gsap.set(cursorDot, { x: e.clientX, y: e.clientY });
      } else {
        gsap.to(cursor, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.6,
          ease: 'power2.out',
        });
        
        gsap.to(cursorDot, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.1,
        });
      }
    };

    const onMouseEnterLink = () => {
      cursor?.classList.add('cursor-hover');
    };

    const onMouseLeaveLink = () => {
      cursor?.classList.remove('cursor-hover');
    };

    document.addEventListener('mousemove', onMouseMove);

    // Add hover effect to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, [role="button"]');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', onMouseEnterLink);
      el.addEventListener('mouseleave', onMouseLeaveLink);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactiveElements.forEach((el) => {
        el.removeEventListener('mouseenter', onMouseEnterLink);
        el.removeEventListener('mouseleave', onMouseLeaveLink);
      });
    };
  }, []);

  // Ne pas afficher le curseur personnalisé si l'utilisateur préfère réduire les animations
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="cursor-follower fixed pointer-events-none z-50 w-8 h-8 -ml-4 -mt-4 rounded-full 
                   border border-white/30 transition-transform duration-300 ease-out hidden md:block"
      />
      <div
        ref={cursorDotRef}
        className="cursor-dot fixed pointer-events-none z-50 w-1 h-1 -ml-0.5 -mt-0.5 
                   bg-white rounded-full hidden md:block"
      />
    </>
  );
};
