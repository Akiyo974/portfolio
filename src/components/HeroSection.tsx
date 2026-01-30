import React, { useEffect, useRef, lazy, Suspense, useState } from 'react';
import { gsap } from 'gsap';
import { useTranslation } from 'react-i18next';
import { useLocalTime } from '../hooks/useLocalTime';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { Star } from 'lucide-react';
import { useStar } from '../contexts/StarContext';

const ThreeScene = lazy(() => import('./ThreeScene'));

export const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const localTime = useLocalTime();
  const [hours, minutes] = localTime.split(':');
  const { stars, toggleStar } = useStar();
  const prefersReducedMotion = useReducedMotion();
  const animationsRef = useRef<gsap.core.Tween[]>([]);
  const [shouldLoadThree, setShouldLoadThree] = useState(false);
  
  // Charger ThreeScene uniquement après interaction utilisateur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100 && !shouldLoadThree) {
        setShouldLoadThree(true);
        window.removeEventListener('scroll', handleScroll);
      }
    };
    
    const handleInteraction = () => {
      setShouldLoadThree(true);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleScroll);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('mousemove', handleInteraction, { once: true, passive: true });
    window.addEventListener('touchstart', handleInteraction, { once: true, passive: true });
    
    // Fallback: charger après 3s si aucune interaction
    const timeout = setTimeout(() => setShouldLoadThree(true), 3000);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearTimeout(timeout);
    };
  }, [shouldLoadThree]);

  useEffect(() => {
    const content = contentRef.current;
    const container = containerRef.current;

    if (content && container) {
      const contentTween = gsap.set(content, { opacity: 1 });
      animationsRef.current.push(contentTween);

      const elements = container.querySelectorAll('.animate-in');
      const elementsTween = gsap.fromTo(elements,
        {
          y: prefersReducedMotion ? 0 : 30,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: prefersReducedMotion ? 0.3 : 1,
          stagger: prefersReducedMotion ? 0 : 0.1,
          delay: prefersReducedMotion ? 0 : 0.2,
          ease: "power4.out"
        }
      );
      animationsRef.current.push(elementsTween);
    }

    return () => {
      // Cleanup all animations
      animationsRef.current.forEach(tween => tween.kill());
      animationsRef.current = [];
    };
  }, [prefersReducedMotion]);

  const handleStarClick = () => {
    toggleStar('hero');
    if (!prefersReducedMotion) {
      const starElement = document.querySelector('.star-icon');
      if (starElement) {
        const starTween = gsap.from(starElement, {
          scale: 0.5,
          duration: 0.3,
          ease: "back.out(1.7)"
        });
        animationsRef.current.push(starTween);
      }
    }
  };

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden">
      {shouldLoadThree && (
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <ThreeScene />
        </Suspense>
      )}

      <div ref={contentRef} className="relative z-10 h-full text-white opacity-0">
        <div ref={containerRef} className="absolute top-0 left-0 right-0 pt-8">
          <div className="w-full grid grid-cols-3 text-left px-8">
            <div className="flex flex-col">
              <h2 className="animate-in text-2xl font-bold tracking-tight text-white">Christen</h2>
              <h2 className="animate-in text-2xl tracking-tight text-white">Dijoux</h2>
            </div>

            <div className="flex flex-col">
              <p className="animate-in text-base text-white">{t('hero.location')}</p>
              <p className="animate-in text-base text-white">{t('hero.region')}</p>
            </div>

            <div className="flex flex-col">
              <p className="animate-in text-base text-white">{t('hero.role')}</p>
              <p className="animate-in text-base mb-4 text-white">{t('hero.roleDetail')}</p>

              <div className="animate-in flex flex-col mt-32">
                <p className="text-7xl font-bold leading-tight text-white">
                  {hours}
                  <span className="text-2xl ml-1">h</span>
                </p>
                <p className="text-7xl font-bold leading-tight text-white">
                  {minutes}
                  <span className="text-2xl ml-1">m</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleStarClick}
          className="animate-in absolute top-4 right-4 md:top-8 md:right-8 p-2 hover:scale-110 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded"
          aria-label={stars.hero ? "Retirer l'étoile" : "Ajouter l'étoile"}
        >
          <Star
            className={`star-icon w-6 h-6 md:w-8 md:h-8 text-white transition-colors duration-300 ${
              stars.hero ? 'fill-white' : 'fill-transparent'
            }`}
          />
        </button>

        <div className="animate-in absolute bottom-0 left-0 right-0 px-8 pb-8">
          <picture>
            <source
              srcSet="/assets/logo-400.webp 400w, /assets/logo-800.webp 800w, /assets/logo.webp 1364w"
              sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1364px"
              type="image/webp"
            />
            <img
              src="/assets/logo-800.webp"
              srcSet="/assets/logo-400.webp 400w, /assets/logo-800.webp 800w, /assets/logo.webp 1364w"
              sizes="(max-width: 768px) 400px, (max-width: 1024px) 800px, 1364px"
              alt="Logo Christen Dijoux"
              width="1364"
              height="129"
              fetchPriority="high"
              decoding="async"
              className="w-full mb-8"
            />
          </picture>
          <div className="w-full h-px bg-white/20 mb-8"></div>
          <div className="text-sm uppercase tracking-widest text-white">
            {t('hero.tagline')} — {new Date().getFullYear()}
          </div>
        </div>
      </div>
    </section>
  );
};