import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Github, Linkedin, X, ArrowRight, ArrowUpRight, Star } from 'lucide-react';
import { useStar } from '../contexts/StarContext';
import emailjs from 'emailjs-com';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SectionLabel } from './ui/Editorial';
import { SplitText } from './ui/Kinetic';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { stars, toggleStar } = useStar();
  const formRef = useRef<HTMLFormElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupType, setPopupType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        '.contact-content',
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    emailjs.sendForm(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      formRef.current!,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY
    ).then(
      () => {
        setPopupMessage(t('contact.successMessage'));
        setPopupType('success');
        setPopupVisible(true);
        formRef.current?.reset();
        setFormData({ name: '', email: '', message: '' });
      },
      (error) => {
        setPopupMessage(t('contact.errorMessage'));
        setPopupType('error');
        setPopupVisible(true);
        console.error(error.text);
      }
    );

    // Masquer le popup après 3 secondes
    setTimeout(() => {
      setPopupVisible(false);
    }, 3000);
  };

  const inputClass =
    'w-full border-b border-line bg-transparent px-0 py-3 text-paper placeholder:text-paper/30 focus:border-paper focus:outline-none transition-colors';
  const contactLinks = [
    { icon: Mail, label: 'Email', value: 'christen.dijoux@gmail.com', href: 'mailto:christen.dijoux@gmail.com' },
    { icon: Phone, label: 'Tel', value: '+1 (418) 376-2612', href: 'tel:+14183762612' },
    { icon: MapPin, label: 'Base', value: 'Saguenay, Québec, Canada' },
  ];

  return (
    <section ref={sectionRef} className="relative w-full scroll-mt-16 overflow-hidden border-t border-line bg-ink px-4 py-20 text-paper sm:px-6 md:px-10 md:py-28" id="contact">
      <img
        src="/assets/art/globe-halftone.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -right-40 top-10 hidden w-[620px] opacity-25 lg:block"
      />
      <div className="contact-content relative">
        <SectionLabel index={3} total={4}>{t('ui.contactKicker')}</SectionLabel>
        <SplitText as="h2" text={t('ui.contactTitle')} className="display mt-6 block text-[clamp(3rem,9vw,9rem)]" />
        <a
          href="mailto:christen.dijoux@gmail.com"
          data-cursor={t('ui.cursorWrite')}
          className="group mt-6 inline-flex max-w-full items-center gap-4 border-b border-line pb-2 font-display text-[clamp(1.6rem,4.4vw,4.6rem)] font-light leading-none text-paper/80 transition-colors hover:border-paper hover:text-paper"
        >
          <span className="truncate">christen.dijoux@gmail.com</span>
          <ArrowUpRight className="h-[0.7em] w-[0.7em] shrink-0 transition-transform duration-500 group-hover:-translate-y-1 group-hover:translate-x-1" aria-hidden="true" />
        </a>

        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Informations de contact */}
          <div className="lg:col-span-5">
            <h3 className="heading text-3xl md:text-4xl">{t('contact.subtitle')}</h3>
            <p className="mt-4 max-w-md leading-relaxed text-paper/70">{t('contact.description')}</p>

            <ul className="mt-8 border-t border-line">
              {contactLinks.map(({ icon: Icon, label, value, href }) => {
                const content = (
                  <>
                    <span className="label w-14">{label}</span>
                    <Icon className="h-4 w-4 text-paper/50" aria-hidden="true" />
                    <span className="flex-1 font-mono text-[13px]">{value}</span>
                    {href && (
                      <ArrowUpRight
                        className="h-4 w-4 text-paper/55 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        aria-hidden="true"
                      />
                    )}
                  </>
                );
                return (
                  <li key={label} className="border-b border-line">
                    {href ? (
                      <a href={href} className="group flex items-center gap-4 py-4 text-paper/80 transition-colors hover:text-paper">
                        {content}
                      </a>
                    ) : (
                      <div className="flex items-center gap-4 py-4 text-paper/80">{content}</div>
                    )}
                  </li>
                );
              })}
            </ul>

            <div className="mt-6 flex gap-2">
              <a
                href="https://github.com/Akiyo974"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                aria-label="Profil GitHub de Christen Dijoux"
              >
                <Github className="h-3.5 w-3.5" aria-hidden="true" />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/christen-dijoux"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost"
                aria-label="Profil LinkedIn de Christen Dijoux"
              >
                <Linkedin className="h-3.5 w-3.5" aria-hidden="true" />
                <span>LinkedIn</span>
              </a>
            </div>
          </div>

          {/* Formulaire de contact */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="contact-form crosshair space-y-8 border border-line bg-ink/80 p-5 backdrop-blur-sm md:p-8 lg:col-span-6 lg:col-start-7"
          >
            <div className="label flex items-center justify-between">
              <span aria-hidden="true">
                {'>'} new_message <span className="animate-blink">_</span>
              </span>
              {/* Étoile cachée n° 2 de la chasse */}
              <button
                type="button"
                onClick={() => toggleStar('contact')}
                className="p-1 transition-transform duration-300 hover:scale-125 focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
                aria-label={stars.contact ? t('game.starFound', { defaultValue: 'Étoile trouvée' }) : t('game.hiddenStar', { defaultValue: 'Étoile cachée' })}
                aria-pressed={stars.contact}
              >
                <Star className={`h-3.5 w-3.5 transition-colors ${stars.contact ? 'fill-paper text-paper' : 'fill-transparent text-paper/40'}`} />
              </button>
            </div>
            <div>
              <label htmlFor="name" className="label block">01 · {t('contact.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                className={inputClass}
                placeholder={t('contact.namePlaceholder')}
                value={formData.name}
                onChange={(e) => {
                  const onlyLetters = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s'-]/g, '');
                  setFormData({
                    ...formData,
                    name: onlyLetters
                  });
                }}
                required
                aria-required="true"
                aria-label="Entrez votre nom complet"
              />
            </div>

            <div>
              <label htmlFor="email" className="label block">02 · {t('contact.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                className={inputClass}
                placeholder={t('contact.emailPlaceholder')}
                value={formData.email}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label="Entrez votre adresse email"
                aria-describedby="email-hint"
              />
              <span id="email-hint" className="sr-only">Format attendu : votre.email@exemple.com</span>
            </div>

            <div>
              <label htmlFor="message" className="label block">03 · {t('contact.message')}</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                maxLength={1000}
                className={`${inputClass} resize-none`}
                placeholder={t('contact.messagePlaceholder')}
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label="Entrez votre message"
                aria-describedby="message-counter"
              />
              <div id="message-counter" className="mt-2 text-right font-mono text-[11px] text-paper/55">
                {formData.message.length} / 1000 caractères
              </div>
            </div>

            <button type="submit" className="btn-solid w-full py-4" data-magnetic aria-label="Envoyer le formulaire de contact">
              {t('contact.send')} <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>
        </div>

        {/* Popup personnalisé */}
        {popupVisible && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="popup-message"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="crosshair relative w-80 border border-line bg-ink p-6 md:w-96">
              <button
                onClick={() => setPopupVisible(false)}
                className="absolute right-3 top-3 text-paper/50 transition-colors hover:text-paper focus:outline-none focus-visible:ring-1 focus-visible:ring-paper"
                aria-label="Fermer la notification"
              >
                <X size={18} aria-hidden="true" />
              </button>
              <p className="label">{popupType === 'success' ? '✓ 200 OK' : '× ERROR'}</p>
              <h3 id="popup-message" className={`heading mt-3 text-2xl ${popupType === 'success' ? 'text-paper' : 'text-red-400'}`}>
                {popupMessage}
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
