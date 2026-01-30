import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Github, Linkedin, X } from 'lucide-react';
import emailjs from 'emailjs-com';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const ContactSection: React.FC = () => {
  const { t } = useTranslation();
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
      (result) => {
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

  return (
    <section ref={sectionRef} className="w-full py-24 px-8 bg-black text-white" id="contact">
      <div className="max-w-6xl mx-auto contact-content">
        <h2 className="text-5xl font-bold mb-12 text-center">{t('contact.title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Informations de contact */}
          <div className="space-y-8">
            <h3 className="text-2xl font-semibold mb-6">{t('contact.subtitle')}</h3>
            <p className="text-white/60 mb-8 text-lg">
              {t('contact.description')}
            </p>

            <div className="space-y-6">
              <a href="mailto:christen.dijoux@gmail.com" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                <Mail className="w-6 h-6" />
                <span>christen.dijoux@gmail.com</span>
              </a>

              <a href="tel:+14183762612" className="flex items-center gap-4 text-white/60 hover:text-white transition-colors">
                <Phone className="w-6 h-6" />
                <span>+1 (418) 376-2612</span>
              </a>

              <div className="flex items-center gap-4 text-white/60">
                <MapPin className="w-6 h-6" />
                <span>Saguenay, Québec, Canada</span>
              </div>

              <div className="flex gap-6 pt-4">
                <a
                  href="https://github.com/Akiyo974"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                  aria-label="Profil GitHub de Christen Dijoux"
                >
                  <Github className="w-6 h-6" />
                  <span>GitHub</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/christen-dijoux"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                  aria-label="Profil LinkedIn de Christen Dijoux"
                >
                  <Linkedin className="w-6 h-6" />
                  <span>LinkedIn</span>
                </a>
              </div>

            </div>
          </div>

          {/* Formulaire de contact */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2">{t('contact.name')}</label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-colors"
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
              <label htmlFor="email" className="block text-sm font-medium mb-2">{t('contact.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-colors"
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
              <label htmlFor="message" className="block text-sm font-medium mb-2">{t('contact.message')}</label>
              <textarea
                id="message"
                name="message"
                rows={6}
                maxLength={1000}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/20 transition-colors resize-none"
                placeholder={t('contact.messagePlaceholder')}
                value={formData.message}
                onChange={handleChange}
                required
                aria-required="true"
                aria-label="Entrez votre message"
                aria-describedby="message-counter"
              />
              <div id="message-counter" className="text-xs text-white/40 mt-1 text-right">
                {formData.message.length} / 1000 caractères
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-6 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              aria-label="Envoyer le formulaire de contact"
            >
              {t('contact.send')}
            </button>
          </form>
        </div>

        {/* Popup personnalisé */}
        {popupVisible && (
          <div 
            className={`fixed inset-0 flex items-center justify-center z-50 bg-black/50`} 
            role="dialog" 
            aria-modal="true" 
            aria-labelledby="popup-message"
            aria-live="assertive"
            aria-atomic="true"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96 relative">
              <button
                onClick={() => setPopupVisible(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 rounded"
                aria-label="Fermer la notification"
              >
                <X size={20} aria-hidden="true" />
              </button>
              <h3 id="popup-message" className={`text-lg font-medium ${popupType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                {popupMessage}
              </h3>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
