import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useInRouterContext } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp, ArrowUpRight, Download, Maximize2, Minus, RotateCcw, X } from 'lucide-react';
import { handleMessage } from './botLogic/messageHandler';
import { welcome } from './botLogic/brain';
import { BotAction, BotContext, BotReply, Lang } from './botLogic/types';
import { scrollToTarget } from '../../lib/motion';

interface ChatbotProps {
  botName?: string;
  welcomeMessage?: string;
  position?: 'bottom-right' | 'bottom-left';
}

interface Message {
  id: number;
  isBot: boolean;
  text: string;
  actions?: BotAction[];
  suggestions?: string[];
  time: string;
}

const STORAGE_KEY = 'cd-chat-v2';
const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
let uid = 0;

const loadSession = (): { messages: Message[]; context: BotContext } | null => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    uid = Math.max(uid, ...data.messages.map((m: Message) => m.id), 0);
    return data;
  } catch {
    return null;
  }
};

const saveSession = (messages: Message[], context: BotContext) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, context }));
  } catch {
    /* stockage indisponible */
  }
};

/** Action sous une réponse : route interne, lien externe, ancre ou téléchargement. */
const ActionButton: React.FC<{ action: BotAction; onNavigate: () => void }> = ({ action, onNavigate }) => {
  const inRouter = useInRouterContext();
  const cls =
    'inline-flex items-center gap-1.5 border border-line px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-paper/80 transition-colors hover:border-paper hover:bg-paper hover:text-ink focus:outline-none focus-visible:ring-1 focus-visible:ring-paper';

  if (action.scrollTo) {
    const target = action.scrollTo;
    const onHome = typeof window !== 'undefined' && window.location.pathname === '/';
    if (onHome || !inRouter) {
      return (
        <button
          type="button"
          className={cls}
          onClick={() => {
            scrollToTarget(target);
            onNavigate();
          }}
        >
          {action.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
        </button>
      );
    }
    return (
      <Link to={`/#${target}`} className={cls} onClick={onNavigate}>
        {action.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    );
  }

  if (action.to) {
    return inRouter ? (
      <Link to={action.to} className={cls} onClick={onNavigate}>
        {action.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </Link>
    ) : (
      <a href={action.to} className={cls}>
        {action.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
      </a>
    );
  }

  const external = action.href && /^https?:/.test(action.href);
  return (
    <a
      href={action.href}
      className={cls}
      download={action.download || undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
    >
      {action.label}
      {action.download ? <Download className="h-3 w-3" aria-hidden="true" /> : <ArrowUpRight className="h-3 w-3" aria-hidden="true" />}
    </a>
  );
};

/**
 * Assistant du portfolio : réponses locales (aucune donnée envoyée à un service externe),
 * bilingue, avec actions et suggestions contextuelles.
 */
export const Chatbot: React.FC<ChatbotProps> = ({ botName = 'Assistant', welcomeMessage, position = 'bottom-right' }) => {
  const { t, i18n } = useTranslation();
  const lang: Lang = i18n?.language?.startsWith('en') ? 'en' : 'fr';

  const makeWelcome = (): Message => {
    const w = welcome(lang);
    return { id: ++uid, isBot: true, text: welcomeMessage ?? w.text, suggestions: w.suggestions, time: now() };
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = loadSession()?.messages;
    // conversation non commencée : on régénère l'accueil (langue courante)
    return saved && saved.length > 1 ? saved : [makeWelcome()];
  });
  const [context, setContext] = useState<BotContext>(() => loadSession()?.context ?? {});
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const [viewport, setViewport] = useState<{ width: number; height: number; top: number; left: number } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const visualViewport = window.visualViewport;
    const updateViewport = () => {
      setViewport({
        width: visualViewport?.width ?? window.innerWidth,
        height: visualViewport?.height ?? window.innerHeight,
        top: visualViewport?.offsetTop ?? 0,
        left: visualViewport?.offsetLeft ?? 0,
      });
      if (window.innerWidth < 768) setIsMinimized(false);
    };
    updateViewport();
    window.addEventListener('resize', updateViewport);
    visualViewport?.addEventListener('resize', updateViewport);
    visualViewport?.addEventListener('scroll', updateViewport);
    return () => {
      window.removeEventListener('resize', updateViewport);
      visualViewport?.removeEventListener('resize', updateViewport);
      visualViewport?.removeEventListener('scroll', updateViewport);
    };
  }, [isOpen]);

  useEffect(() => saveSession(messages, context), [messages, context]);

  // Changement de langue avant toute question : accueil traduit
  useEffect(() => {
    setMessages((prev) => (prev.length === 1 && prev[0].isBot ? [makeWelcome()] : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isTyping, isOpen, isMinimized]);

  useEffect(() => {
    if (isOpen && !isMinimized) inputRef.current?.focus();
  }, [isOpen, isMinimized]);

  // Invitation discrète, une fois par session, sur grand écran
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('cd-chat-teaser') === '1';
    } catch {
      seen = true;
    }
    if (seen || !window.matchMedia?.('(min-width: 1024px)').matches) return;
    const timer = window.setTimeout(() => setTeaser(true), 9000);
    return () => clearTimeout(timer);
  }, []);

  // …puis elle s'efface seule après 8 s pour ne pas masquer le contenu
  useEffect(() => {
    if (!teaser) return;
    const timer = window.setTimeout(() => dismissTeaser(), 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teaser]);

  const dismissTeaser = () => {
    setTeaser(false);
    try {
      sessionStorage.setItem('cd-chat-teaser', '1');
    } catch {
      /* stockage indisponible */
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || isTyping) return;
    setMessages((prev) => [...prev, { id: ++uid, isBot: false, text, time: now() }]);
    setInput('');
    setIsTyping(true);
    try {
      const result: unknown = await handleMessage(text, lang, context);
      // compatibilité : un gestionnaire peut aussi renvoyer une simple chaîne
      let reply: BotReply;
      if (typeof result === 'string') reply = { text: result };
      else {
        const r = result as { reply: BotReply; context?: BotContext };
        reply = r.reply;
        if (r.context) setContext(r.context);
      }
      setMessages((prev) => [...prev, { id: ++uid, isBot: true, time: now(), ...reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: ++uid,
          isBot: true,
          time: now(),
          text: lang === 'fr' ? "Désolé, je n'ai pas pu traiter votre message. Réessayez." : "Sorry, I couldn't process that. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const reset = () => {
    setMessages([makeWelcome()]);
    setContext({});
  };

  const closeOnMobile = () => {
    if (window.matchMedia?.('(max-width: 767px)').matches) setIsOpen(false);
  };

  const side = position === 'bottom-right' ? 'right-4' : 'left-4';
  const lastBot = [...messages].reverse().find((m) => m.isBot);
  const viewportStyle: (React.CSSProperties & Record<string, string>) | undefined = viewport ? {
    '--chat-viewport-width': `${viewport.width}px`,
    '--chat-viewport-height': `${viewport.height}px`,
    '--chat-viewport-top': `${viewport.top}px`,
    '--chat-viewport-left': `${viewport.left}px`,
  } : undefined;

  return (
    <div className="print:hidden">
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            key="launcher"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-4 ${side} z-50 flex flex-col items-end gap-2`}
          >
            {teaser && (
              <div className="crosshair relative hidden max-w-[240px] lg:block border border-line bg-ink/95 p-3 pr-8 backdrop-blur-md">
                <p className="text-sm leading-snug text-paper/85">
                  {t('chatbot.teaser', { defaultValue: 'Une question sur mon travail ? Demandez à mon assistant.' })}
                </p>
                <button
                  type="button"
                  onClick={dismissTeaser}
                  className="absolute right-2 top-2 text-paper/55 hover:text-paper"
                  aria-label={t('chatbot.dismiss', { defaultValue: "Masquer l'invitation" })}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            <button
              ref={launcherRef}
              type="button"
              onClick={() => {
                setIsOpen(true);
                setIsMinimized(false);
                dismissTeaser();
              }}
              data-magnetic
              className="group flex items-center gap-3 border border-line bg-ink/90 p-2 sm:pr-4 backdrop-blur-md transition-colors hover:border-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
              /* Le nom accessible reprend le texte visible « CD Assistant » (WCAG 2.5.3) */
              aria-label={`CD ${botName} — ${t('chatbot.open', { defaultValue: 'Ouvrir le chat' })}`}
            >
              <span className="relative border border-paper/70 px-1 pt-0.5 font-display text-[15px] font-semibold leading-tight">
                CD
                <span className="absolute -right-1 -top-1 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-paper opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-paper" />
                </span>
              </span>
              {' '}
              <span className="label hidden text-paper/80 group-hover:text-paper sm:inline">{botName}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence onExitComplete={() => launcherRef.current?.focus({ preventScroll: true })}>
        {isOpen && (
          <motion.section
            key="panel"
            role="dialog"
            aria-label={botName}
            style={viewportStyle}
            data-minimized={isMinimized}
            initial={{ opacity: 0, y: 24, clipPath: 'inset(100% 0% 0% 0%)' }}
            animate={{ opacity: 1, y: 0, clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ opacity: 0, y: 24, clipPath: 'inset(100% 0% 0% 0%)' }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className={`chat-panel fixed z-50 flex min-w-0 flex-col overflow-hidden border border-line bg-ink/95 text-paper shadow-[0_30px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl inset-x-2 bottom-2 md:inset-x-auto md:bottom-4 ${position === 'bottom-right' ? 'md:right-4' : 'md:left-4'} md:w-[400px] ${
              isMinimized ? 'h-auto' : 'top-[4.25rem] md:top-auto md:h-[min(620px,calc(100dvh-6.5rem))]'
            }`}
          >
            {/* En-tête */}
            <header className="flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="border border-paper/70 px-1 pt-0.5 font-display text-[15px] font-semibold leading-tight">CD</span>
                <div className="min-w-0">
                  <p className="truncate font-mono text-[12px] uppercase tracking-[0.1em]">{botName}</p>
                  <p className="label flex items-center gap-1.5 text-[10px]">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-paper" aria-hidden="true" />
                    {t('chatbot.status', { defaultValue: 'En ligne · réponses locales' })}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={reset}
                  className="p-1.5 text-paper/60 transition-colors hover:text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
                  aria-label={t('chatbot.reset', { defaultValue: 'Nouvelle conversation' })}
                  title={t('chatbot.reset', { defaultValue: 'Nouvelle conversation' })}
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsMinimized((m) => !m)}
                  className="hidden p-1.5 text-paper/60 transition-colors hover:text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper md:block"
                  aria-label={isMinimized ? t('chatbot.expand', { defaultValue: 'Agrandir' }) : t('chatbot.minimize', { defaultValue: 'Réduire' })}
                >
                  {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-paper/60 transition-colors hover:text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
                  aria-label={t('chatbot.close', { defaultValue: 'Fermer' })}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </header>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div ref={listRef} role="log" aria-live="polite" className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5 [overflow-wrap:anywhere]" data-lenis-prevent>
                  {messages.map((m) =>
                    m.isBot ? (
                      <div key={m.id} className="max-w-[92%]">
                        <p className="label mb-1.5 text-[10px]">CD·BOT — {m.time}</p>
                        <div className="border-l border-paper/40 pl-3">
                          <p className={`whitespace-pre-line text-[14px] leading-relaxed text-paper/90 ${m === lastBot ? 'chat-reveal' : ''}`}>{m.text}</p>
                          {m.actions && m.actions.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                              {m.actions.map((a) => (
                                <ActionButton key={a.label} action={a} onNavigate={closeOnMobile} />
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div key={m.id} className="flex flex-col items-end">
                        <p className="label mb-1.5 text-[10px]">{lang === 'fr' ? 'Vous' : 'You'} — {m.time}</p>
                        <p className="max-w-[85%] whitespace-pre-line bg-paper px-3 py-2 text-[14px] leading-relaxed text-ink">{m.text}</p>
                      </div>
                    )
                  )}
                  {isTyping && (
                    <p className="label flex items-center gap-1" aria-label={t('chatbot.typing', { defaultValue: 'En train d’écrire…' })}>
                      <span className="text-paper/55">{'>'}</span> {lang === 'fr' ? 'analyse' : 'thinking'}
                      <span className="animate-blink text-paper">_</span>
                    </p>
                  )}
                </div>

                {/* Suggestions */}
                {!isTyping && lastBot?.suggestions && lastBot.suggestions.length > 0 && (
                  <div className="no-scrollbar flex shrink-0 gap-1.5 overflow-x-auto border-t border-line px-4 py-2.5" data-lenis-prevent>
                    {lastBot.suggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => send(sug)}
                        className="shrink-0 border border-line px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-paper/70 transition-colors hover:border-paper hover:text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}

                {/* Saisie */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send(input);
                  }}
                  className="flex shrink-0 items-center gap-2 border-t border-line px-4 py-3"
                >
                  <span className="font-mono text-paper/55" aria-hidden="true">›</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    maxLength={300}
                    placeholder={t('chatbot.placeholder', { defaultValue: 'Posez votre question…' })}
                    aria-label={t('chatbot.placeholder', { defaultValue: 'Posez votre question…' })}
                    className="min-w-0 flex-1 bg-transparent py-1.5 text-base md:text-[14px] text-paper placeholder:text-paper/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isTyping}
                    className="flex h-8 w-8 shrink-0 items-center justify-center bg-paper text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-30"
                    aria-label={t('chatbot.send', { defaultValue: 'Envoyer' })}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                </form>
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
};
