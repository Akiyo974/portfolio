import React, { useEffect, useRef, useState } from 'react';
import DitherHero from '../webgl/DitherHero';
import { SplitText, ScrollWords, useProximityWeight } from '../ui/Kinetic';
import { PixelImage } from '../ui/PixelImage';
import { Counter } from '../ui/Counter';
import { ManifestoBand } from '../ManifestoBand';
import { NEGATIVE_EVENT } from '../NegativeMode';
import { labComponents, type DemoId, type Lang } from '../../data/lab';

/**
 * Monte son contenu seulement près de l'écran, et le démonte quand il s'éloigne :
 * le Lab affiche plusieurs canvas / contextes WebGL, on n'en garde que quelques-uns actifs.
 */
export const LazyMount: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '300px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={className}>
      {on && children}
    </div>
  );
};

const Replay: React.FC<{ onClick: () => void; lang: Lang }> = ({ onClick, lang }) => (
  <button type="button" onClick={onClick} className="chip absolute bottom-3 right-3 z-10 bg-ink/80 backdrop-blur-sm">
    ↺ {lang === 'fr' ? 'Rejouer' : 'Replay'}
  </button>
);

const KineticDemo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const ref = useRef<HTMLHeadingElement>(null);
  const [k, setK] = useState(0);
  useProximityWeight(ref, { min: 200, max: 850, radius: 220 });
  return (
    <div className="flex h-full items-center justify-center p-6">
      <h3 ref={ref} className="display text-center text-[clamp(3rem,9vw,7.5rem)] [font-variation-settings:'wght'_200]">
        <SplitText key={k} as="span" text={lang === 'fr' ? 'Approche' : 'Come closer'} className="block" />
      </h3>
      <Replay lang={lang} onClick={() => setK((v) => v + 1)} />
    </div>
  );
};

const PixelDemo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [k, setK] = useState(0);
  return (
    <>
      <PixelImage key={k} src="/assets/art/ctreq-halftone.png" original="/assets/ctreq.webp" alt="CTREQ" className="h-full w-full" />
      <Replay lang={lang} onClick={() => setK((v) => v + 1)} />
    </>
  );
};

const CounterDemo: React.FC<{ lang: Lang }> = ({ lang }) => {
  const [k, setK] = useState(0);
  return (
    <div className="flex h-full items-center justify-center gap-10">
      {[
        [labComponents.length, lang === 'fr' ? 'Composants' : 'Components'],
        [64, lang === 'fr' ? 'Seuils' : 'Thresholds'],
        [2, lang === 'fr' ? 'Couleurs' : 'Colours'],
      ].map(([v, l]) => (
        <div key={`${l}-${k}`}>
          <Counter value={v as number} className="display block text-[clamp(3rem,7vw,6rem)]" />
          <p className="label mt-1">{l}</p>
        </div>
      ))}
      <Replay lang={lang} onClick={() => setK((v) => v + 1)} />
    </div>
  );
};

const CursorDemo: React.FC<{ lang: Lang }> = ({ lang }) => (
  <div className="flex h-full flex-col items-center justify-center gap-6 p-6">
    <div className="flex flex-wrap justify-center gap-3">
      <button type="button" data-magnetic className="btn-ghost">data-magnetic</button>
      <span data-cursor={lang === 'fr' ? 'Voir' : 'View'} className="flex h-24 w-36 items-center justify-center border border-dashed border-line font-mono text-[11px] uppercase text-paper/60">
        data-cursor
      </span>
    </div>
    <p className="label max-w-xs text-center">
      {lang === 'fr' ? 'Souris uniquement — sur tactile, le curseur système reste.' : 'Mouse only — on touch screens the system cursor stays.'}
    </p>
  </div>
);

const NegativeDemo: React.FC<{ lang: Lang }> = ({ lang }) => (
  <div className="flex h-full flex-col items-center justify-center gap-5 p-6">
    <button type="button" data-magnetic onClick={() => window.dispatchEvent(new Event(NEGATIVE_EVENT))} className="btn-solid">
      ◐ {lang === 'fr' ? 'Inverser le site' : 'Flip the site'}
    </button>
    <p className="label text-center">↑ ↑ ↓ ↓ ← → ← → B A</p>
  </div>
);

export const LabDemo: React.FC<{ id: DemoId; lang: Lang }> = ({ id, lang }) => {
  switch (id) {
    case 'dither-hero':
      return <DitherHero centered scrollLinked={false} />;
    case 'kinetic':
      return <KineticDemo lang={lang} />;
    case 'scroll-words':
      return (
        <div className="flex h-full items-center p-6 md:p-10">
          <ScrollWords
            className="heading text-[clamp(1.6rem,3vw,2.6rem)]"
            text={
              lang === 'fr'
                ? 'Faites défiler la page : chaque mot s’allume à son tour, au rythme exact de votre lecture.'
                : 'Scroll the page: each word lights up in turn, at the exact pace of your reading.'
            }
          />
        </div>
      );
    case 'pixel-image':
      return <PixelDemo lang={lang} />;
    case 'manifesto':
      return (
        <div className="flex h-full items-center">
          <div className="w-full">
            <ManifestoBand />
          </div>
        </div>
      );
    case 'cursor':
      return <CursorDemo lang={lang} />;
    case 'negative':
      return <NegativeDemo lang={lang} />;
    case 'counter':
      return <CounterDemo lang={lang} />;
    default:
      return null;
  }
};
