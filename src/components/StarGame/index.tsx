import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { STAR_GAME_OPEN_EVENT, useStar } from '../../contexts/StarContext';
import { getLenis } from '../../lib/motion';
import {
  GAME_SECONDS,
  fetchLeaderboard,
  getBestScore,
  saveBestScore,
  startRun,
  submitScore,
  type LeaderboardEntry,
} from '../../lib/leaderboard';

const DitherHero = lazy(() => import('../webgl/DitherHero'));

type Phase = 'intro' | 'play' | 'over';

interface GameStar {
  id: number;
  x: number; // %
  y: number; // %
  golden: boolean;
  ttl: number; // ms
}

interface Pop {
  id: number;
  x: number;
  y: number;
  text: string;
}

const COMBO_WINDOW = 900;
let uid = 0;

/** Étoile à quatre branches (trame du site) */
const Sparkle: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0z" fill="currentColor" />
  </svg>
);

const LeaderboardTable: React.FC<{ entries: LeaderboardEntry[] | null; highlight?: string }> = ({ entries, highlight }) => {
  const { t } = useTranslation();
  if (!entries) {
    return <p className="label border border-line p-4">{t('game.offline', { defaultValue: 'Classement en ligne indisponible — votre record est gardé sur cet appareil.' })}</p>;
  }
  const rows = Array.from({ length: 10 }, (_, i) => entries[i]);
  return (
    <ol className="border-t border-line">
      {rows.map((e, i) => (
        <li
          key={e?.id ?? `empty-${i}`}
          className={`grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-3 border-b border-line py-2 font-mono text-[13px] uppercase tracking-[0.08em] ${
            e && e.id === highlight ? 'bg-paper text-ink' : i < 3 && e ? 'text-paper' : 'text-paper/60'
          }`}
        >
          <span className="pl-2">{String(i + 1).padStart(2, '0')}</span>
          <span>{e?.nickname ?? '———'}</span>
          <span className="pr-2 tabular-nums">{e ? String(e.score).padStart(3, '0') : '000'}</span>
        </li>
      ))}
    </ol>
  );
};

export const StarGame = () => {
  const { t } = useTranslation();
  const { collectedStars, totalStars } = useStar();
  const [open, setOpen] = useState(false);
  const [phase, setPhase] = useState<Phase>('intro');
  const [stars, setStars] = useState<GameStar[]>([]);
  const [pops, setPops] = useState<Pop[]>([]);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [nickname, setNickname] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ rank: number; id?: string } | null>(null);

  const tokenRef = useRef<string | null>(null);
  const startRef = useRef(0);
  const lastHitRef = useRef(0);
  const comboRef = useRef(0);
  const scoreRef = useRef(0);
  const prevCollected = useRef(collectedStars);

  // Ouverture : quand la dernière étoile est trouvée, ou à la demande (footer)
  useEffect(() => {
    const was = prevCollected.current;
    prevCollected.current = collectedStars;
    if (was < totalStars && collectedStars === totalStars) {
      const timer = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, [collectedStars, totalStars]);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener(STAR_GAME_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(STAR_GAME_OPEN_EVENT, onOpen);
  }, []);

  // Pendant le jeu : pas de défilement, Échap pour quitter
  useEffect(() => {
    if (!open) return;
    setPhase('intro');
    setBest(getBestScore());
    fetchLeaderboard().then(setEntries);
    document.documentElement.style.overflow = 'hidden';
    getLenis()?.stop();
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.documentElement.style.overflow = '';
      getLenis()?.start();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const spawn = useCallback((elapsed: number): GameStar => {
    // Les étoiles vivent de moins en moins longtemps au fil de la partie
    const progress = Math.min(1, elapsed / (GAME_SECONDS * 1000));
    return {
      id: ++uid,
      x: 6 + Math.random() * 88,
      y: 14 + Math.random() * 76,
      golden: Math.random() < 0.12,
      ttl: 2600 - progress * 1200 + Math.random() * 500,
    };
  }, []);

  const start = async () => {
    setScore(0);
    scoreRef.current = 0;
    setCombo(0);
    comboRef.current = 0;
    lastHitRef.current = 0;
    setPops([]);
    setNewRecord(false);
    setSubmitted(null);
    setNickname('');
    setTimeLeft(GAME_SECONDS);
    startRef.current = performance.now();
    setStars(Array.from({ length: 5 }, () => spawn(0)));
    setPhase('play');
    tokenRef.current = await startRun();
  };

  // Boucle de jeu : expiration, apparition, chrono
  useEffect(() => {
    if (phase !== 'play') return;
    const born = new Map<number, number>();
    const tick = window.setInterval(() => {
      const now = performance.now();
      const elapsed = now - startRef.current;
      const left = Math.max(0, GAME_SECONDS - elapsed / 1000);
      setTimeLeft(left);

      if (lastHitRef.current && now - lastHitRef.current > COMBO_WINDOW && comboRef.current > 0) {
        comboRef.current = 0;
        setCombo(0);
      }

      if (left <= 0) {
        window.clearInterval(tick);
        setStars([]);
        setPhase('over');
        return;
      }

      setStars((prev) => {
        const alive = prev.filter((s) => {
          if (!born.has(s.id)) born.set(s.id, now);
          return now - (born.get(s.id) ?? now) < s.ttl;
        });
        const target = elapsed > 10000 ? 7 : 5;
        while (alive.length < target) alive.push(spawn(elapsed));
        return alive.length === prev.length && alive.every((s, i) => s === prev[i]) ? prev : alive;
      });
    }, 100);
    return () => window.clearInterval(tick);
  }, [phase, spawn]);

  // Fin de partie : record local + confettis monochromes
  useEffect(() => {
    if (phase !== 'over') return;
    const record = saveBestScore(scoreRef.current);
    setNewRecord(record && scoreRef.current > 0);
    setBest(getBestScore());
    if (record && scoreRef.current > 0 && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.7 }, colors: ['#f2f2ee', '#9a9a96', '#5c5c5a'], shapes: ['square'], scalar: 0.8 });
    }
  }, [phase]);

  const hit = (star: GameStar, e: React.MouseEvent | React.KeyboardEvent) => {
    const now = performance.now();
    const chained = lastHitRef.current && now - lastHitRef.current <= COMBO_WINDOW;
    comboRef.current = chained ? Math.min(comboRef.current + 1, 12) : 1;
    lastHitRef.current = now;
    const mult = 1 + Math.floor((comboRef.current - 1) / 3); // x1 → x4
    const points = (star.golden ? 3 : 1) * Math.min(mult, 4);
    scoreRef.current += points;
    setScore(scoreRef.current);
    setCombo(comboRef.current);
    setStars((prev) => prev.filter((s) => s.id !== star.id).concat(spawn(now - startRef.current)));

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const pop = { id: ++uid, x: rect.left + rect.width / 2, y: rect.top, text: `+${points}` };
    setPops((p) => [...p, pop]);
    window.setTimeout(() => setPops((p) => p.filter((x) => x.id !== pop.id)), 700);
  };

  const send = async () => {
    if (nickname.length !== 3 || submitting) return;
    setSubmitting(true);
    const res = await submitScore(nickname, scoreRef.current, tokenRef.current);
    setSubmitting(false);
    tokenRef.current = null;
    if (res) {
      setEntries(res.entries);
      const mine = res.entries.find((e) => e.nickname === nickname && e.score === scoreRef.current);
      setSubmitted({ rank: res.rank, id: mine ? String(mine.id) : undefined });
    } else {
      setSubmitted({ rank: 0 });
    }
  };

  const mult = Math.min(1 + Math.floor((Math.max(combo, 1) - 1) / 3), 4);
  const canSubmit = phase === 'over' && scoreRef.current > 0 && tokenRef.current !== null && !submitted;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="star-game"
          role="dialog"
          aria-modal="true"
          aria-label={t('game.title', { defaultValue: 'Jeu des étoiles' })}
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[80] overflow-hidden bg-ink text-paper"
          data-lenis-prevent
        >
          <Suspense fallback={null}>
            <DitherHero centered className="opacity-[0.18]" />
          </Suspense>
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />

          {/* Barre supérieure */}
          <div className="relative z-20 flex items-center justify-between border-b border-line bg-ink/80 px-4 py-3 backdrop-blur-md sm:px-6 md:px-10">
            <p className="label">
              <span className="text-paper">✦</span> {t('game.title', { defaultValue: 'Jeu des étoiles' })}
            </p>
            {phase === 'play' && (
              <div className="flex items-center gap-6 font-mono text-[12px] uppercase tracking-[0.1em]" aria-live="off">
                <span>
                  {t('game.score', { defaultValue: 'Score' })} <span className="tabular-nums text-paper">{String(score).padStart(3, '0')}</span>
                </span>
                <span className={combo >= 4 ? 'text-paper' : 'text-paper/55'}>×{mult}</span>
                <span className={`tabular-nums ${timeLeft <= 5 ? 'animate-pulse text-paper' : ''}`}>{timeLeft.toFixed(1)}s</span>
              </div>
            )}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="p-1.5 text-paper/70 transition-colors hover:text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
              aria-label={t('game.close', { defaultValue: 'Fermer le jeu' })}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          {phase === 'play' && (
            <div className="relative z-20 h-px w-full bg-line">
              <div className="h-px bg-paper transition-[width] duration-100 ease-linear" style={{ width: `${(timeLeft / GAME_SECONDS) * 100}%` }} />
            </div>
          )}

          {/* Intro */}
          {phase === 'intro' && (
            <div className="relative z-10 flex h-[calc(100%-3.5rem)] items-center overflow-y-auto px-4 py-10 sm:px-6 md:px-10">
              <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2 lg:items-end">
                <div>
                  <p className="label mb-4">{t('game.unlocked', { defaultValue: '3 / 3 étoiles trouvées — jeu débloqué' })}</p>
                  <h2 className="display text-[clamp(3.5rem,10vw,9rem)]">{t('game.headline', { defaultValue: 'Chasse aux signaux' })}</h2>
                  {best > 0 && (
                    <p className="label mt-6">
                      {t('game.best', { defaultValue: 'Votre record' })} · <span className="text-paper">{best}</span>
                    </p>
                  )}
                </div>
                <div className="border border-line bg-ink/80 p-5 backdrop-blur-md md:p-6">
                  <ol className="space-y-4">
                    {[
                      t('game.rule1', { defaultValue: `${GAME_SECONDS} secondes pour attraper un maximum d'étoiles. Elles disparaissent de plus en plus vite.` }),
                      t('game.rule2', { defaultValue: 'Les étoiles inversées (carré blanc) valent 3 points.' }),
                      t('game.rule3', { defaultValue: 'Enchaînez les clics rapides : le multiplicateur monte jusqu’à ×4.' }),
                    ].map((rule, i) => (
                      <li key={i} className="grid grid-cols-[2rem_1fr] gap-2 text-paper/85">
                        <span className="label pt-0.5 text-paper">0{i + 1}</span>
                        <span className="leading-relaxed">{rule}</span>
                      </li>
                    ))}
                  </ol>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <button type="button" onClick={start} className="btn-solid" data-magnetic autoFocus>
                      {t('game.start', { defaultValue: 'Lancer la partie' })}
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
                      {t('game.later', { defaultValue: 'Plus tard' })}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Partie */}
          {phase === 'play' && (
            <div className="absolute inset-0 top-[3.5rem] z-10">
              {stars.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={(e) => hit(s, e)}
                  className="star-life absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
                  style={{ left: `${s.x}%`, top: `${s.y}%`, animationDuration: `${s.ttl}ms` }}
                  aria-label={s.golden ? t('game.goldenStar', { defaultValue: 'Étoile bonus' }) : t('game.star', { defaultValue: 'Étoile' })}
                >
                  {s.golden ? (
                    <span className="flex h-10 w-10 items-center justify-center bg-paper text-ink shadow-[0_0_30px_rgba(242,242,238,0.5)]">
                      <Sparkle className="h-6 w-6" />
                    </span>
                  ) : (
                    <Sparkle className="h-7 w-7 text-paper drop-shadow-[0_0_10px_rgba(242,242,238,0.6)]" />
                  )}
                </button>
              ))}
            </div>
          )}
          {pops.map((p) => (
            <span
              key={p.id}
              className="star-pop pointer-events-none fixed z-30 -translate-x-1/2 font-display text-3xl text-paper"
              style={{ left: p.x, top: p.y }}
              aria-hidden="true"
            >
              {p.text}
            </span>
          ))}

          {/* Fin de partie */}
          {phase === 'over' && (
            <div className="relative z-10 h-[calc(100%-3.5rem)] overflow-y-auto px-4 py-10 sm:px-6 md:px-10">
              <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
                <div>
                  <p className="label">{t('game.over', { defaultValue: 'Partie terminée' })}</p>
                  <p className="display mt-2 text-[clamp(7rem,22vw,16rem)] leading-[0.8] tabular-nums" aria-live="polite">
                    {String(score).padStart(3, '0')}
                  </p>
                  <p className="label mt-4">
                    {newRecord
                      ? t('game.newRecord', { defaultValue: 'Nouveau record personnel !' })
                      : `${t('game.best', { defaultValue: 'Votre record' })} · ${best}`}
                  </p>

                  {canSubmit && (
                    <form
                      className="mt-8 max-w-sm"
                      onSubmit={(e) => {
                        e.preventDefault();
                        send();
                      }}
                    >
                      <label htmlFor="game-nickname" className="label mb-2 block">
                        {t('game.enterNickname', { defaultValue: 'Vos initiales (3 lettres)' })}
                      </label>
                      <div className="flex gap-2">
                        <input
                          id="game-nickname"
                          value={nickname}
                          onChange={(e) => setNickname(e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3))}
                          maxLength={3}
                          autoComplete="off"
                          placeholder="AAA"
                          className="w-28 border-b border-line bg-transparent py-2 text-center font-display text-4xl uppercase tracking-[0.2em] text-paper placeholder:text-paper/25 focus:border-paper focus:outline-none"
                          autoFocus
                        />
                        <button type="submit" disabled={nickname.length !== 3 || submitting} className="btn-solid disabled:opacity-40">
                          {submitting ? '…' : t('game.submit', { defaultValue: 'Enregistrer' })}
                        </button>
                      </div>
                    </form>
                  )}
                  {submitted && (
                    <p className="label mt-8 text-paper">
                      {submitted.rank > 0
                        ? t('game.rank', { defaultValue: 'Classé n° {{rank}}', rank: submitted.rank })
                        : t('game.submitError', { defaultValue: "Le score n'a pas pu être enregistré." })}
                    </p>
                  )}

                  <div className="mt-8 flex flex-wrap gap-2">
                    <button type="button" onClick={start} className="btn-solid" data-magnetic>
                      {t('game.restart', { defaultValue: 'Rejouer' })}
                    </button>
                    <button type="button" onClick={() => setOpen(false)} className="btn-ghost">
                      {t('game.backToSite', { defaultValue: 'Retour au site' })}
                    </button>
                  </div>
                </div>

                <div>
                  <p className="label mb-3">{t('game.leaderboard', { defaultValue: 'Classement' })} · Top 10</p>
                  <LeaderboardTable entries={entries} highlight={submitted?.id} />
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
