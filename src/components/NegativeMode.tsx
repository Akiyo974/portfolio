import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/** Événement déclenché par 5 tapotements sur le logo « CD » (mobile). */
export const NEGATIVE_EVENT = 'cd:negative';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

type ViewTransitionDocument = Document & { startViewTransition?: (cb: () => void) => unknown };

/**
 * Easter egg : le « négatif ». Konami code (ou 5 tapotements sur le logo) inverse tout le site
 * avec un dévoilement circulaire ; le même geste le remet à l'endroit.
 */
export const NegativeMode: React.FC = () => {
  const { t } = useTranslation();
  const [toast, setToast] = useState<null | 'on' | 'off'>(null);

  useEffect(() => {
    const toggle = () => {
      const root = document.documentElement;
      const apply = () => setToast(root.classList.toggle('negative') ? 'on' : 'off');
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const doc = document as ViewTransitionDocument;
      if (doc.startViewTransition && !reduce) doc.startViewTransition(apply);
      else apply();
      window.setTimeout(() => setToast(null), 3600);
    };

    let pos = 0;
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      pos = key === KONAMI[pos] ? pos + 1 : key === KONAMI[0] ? 1 : 0;
      if (pos === KONAMI.length) {
        pos = 0;
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener(NEGATIVE_EVENT, toggle);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener(NEGATIVE_EVENT, toggle);
    };
  }, []);

  if (toast === null) return null;
  const on = toast === 'on';

  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center px-4" role="status" aria-live="polite">
      <div className="animate-fade-in crosshair w-full max-w-sm border border-line bg-ink/95 p-4 backdrop-blur-md">
        <p className="label text-paper">◐ {on ? t('ui.negativeOn') : t('ui.negativeOff')}</p>
        <p className="mt-2 text-sm text-paper/70">{on ? t('ui.negativeHint') : t('ui.negativeBye')}</p>
      </div>
    </div>
  );
};

export default NegativeMode;
