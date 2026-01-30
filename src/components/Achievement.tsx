import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useStar } from '../contexts/StarContext';

export const Achievement = () => {
  const { collectedStars, totalStars } = useStar();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (collectedStars > 0) {
      setShow(true);
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [collectedStars]);

  if (!show) return null;

  return (
    <div 
      className="fixed inset-x-0 top-8 mx-auto z-50 flex justify-center items-center"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="bg-white text-black px-8 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-fade-in max-w-sm mx-4">
        <div className="p-2 bg-black/5 rounded-full">
          <Star className="w-6 h-6 fill-black" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-lg">
            {collectedStars} sur {totalStars} étoiles
          </span>
          <span className="text-sm text-black/60">
            Continuez à explorer !
          </span>
        </div>
      </div>
    </div>
  );
};