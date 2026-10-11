import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function LegalNoticePage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('legal.title')} | Christen Dijoux</title>
        <meta name="description" content={t('legal.metaDescription')} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-ink text-paper">
        <div className="px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <h1 className="display mb-14 text-[clamp(3.2rem,9vw,9rem)]">{t('legal.title')}</h1>
          
          <div className="max-w-3xl space-y-12 leading-relaxed text-paper/70 lg:ml-[25%]">
            <section>
              <p className="label mb-8">
                {t('legal.lastUpdated')}: 19 novembre 2025
              </p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.editor.title')}</h2>
              <div className="space-y-2">
                <p><strong>{t('legal.editor.name')}:</strong> Christen Dijoux</p>
                <p><strong>{t('legal.editor.type')}:</strong> {t('legal.editor.typeValue')}</p>
                <p><strong>{t('legal.editor.location')}:</strong> Saguenay, Québec, Canada</p>
                <p><strong>{t('legal.editor.email')}:</strong> <a href="mailto:christen.dijoux@gmail.com" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">christen.dijoux@gmail.com</a></p>
                <p><strong>{t('legal.editor.website')}:</strong> <a href="https://christendijoux.com" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">https://christendijoux.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.hosting.title')}</h2>
              <div className="space-y-2">
                <p><strong>{t('legal.hosting.provider')}:</strong> {t('legal.hosting.providerName')}</p>
                <p><strong>Adresse:</strong> {t('legal.hosting.address')}</p>
                <p><strong>Téléphone:</strong> {t('legal.hosting.phone')}</p>
                <p><strong>Site web:</strong> <a href={t('legal.hosting.website')} target="_blank" rel="noopener noreferrer" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">{t('legal.hosting.website')}</a></p>
              </div>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.intellectual.title')}</h2>
              <p className="mb-4">{t('legal.intellectual.copyright')}</p>
              <p className="mb-4">{t('legal.intellectual.usage')}</p>
              <p>{t('legal.intellectual.projects')}</p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.personalData.title')}</h2>
              <p className="mb-4">{t('legal.personalData.description')}</p>
              <p>
                {t('legal.personalData.link')}: <a href="/privacy-policy" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">{t('legal.personalData.linkText')}</a>
              </p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.liability.title')}</h2>
              <p className="mb-4">{t('legal.liability.content')}</p>
              <p className="mb-4">{t('legal.liability.links')}</p>
              <p>{t('legal.liability.availability')}</p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.applicable.title')}</h2>
              <p>{t('legal.applicable.law')}</p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('legal.technologies.title')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">{t('legal.technologies.frontend')}</h3>
                  <ul className="text-sm space-y-1">
                    <li>React 18</li>
                    <li>TypeScript</li>
                    <li>Vite</li>
                    <li>TailwindCSS</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">{t('legal.technologies.animation')}</h3>
                  <ul className="text-sm space-y-1">
                    <li>GSAP</li>
                    <li>Three.js</li>
                    <li>Lenis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">{t('legal.technologies.services')}</h3>
                  <ul className="text-sm space-y-1">
                    <li>Google Analytics</li>
                    <li>Sentry</li>
                    <li>EmailJS</li>
                    <li>Supabase</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-line">
              <p className="text-sm text-paper/50">
                {t('legal.contact.title')}: <a href="mailto:christen.dijoux@gmail.com" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">christen.dijoux@gmail.com</a>
              </p>
            </section>
          </div>
        </div>

        <Footer variant="minimal" />
      </div>
    </>
  );
}
