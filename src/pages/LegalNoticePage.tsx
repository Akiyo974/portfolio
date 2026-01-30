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

      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">{t('legal.title')}</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <p className="text-sm text-gray-400 mb-8">
                {t('legal.lastUpdated')}: 19 novembre 2025
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.editor.title')}</h2>
              <div className="space-y-2">
                <p><strong>{t('legal.editor.name')}:</strong> Christen Dijoux</p>
                <p><strong>{t('legal.editor.type')}:</strong> {t('legal.editor.typeValue')}</p>
                <p><strong>{t('legal.editor.location')}:</strong> Saguenay, Québec, Canada</p>
                <p><strong>{t('legal.editor.email')}:</strong> <a href="mailto:christendijoux@gmail.com" className="text-blue-400 hover:text-blue-300 underline">christendijoux@gmail.com</a></p>
                <p><strong>{t('legal.editor.website')}:</strong> <a href="https://christendijoux.com" className="text-blue-400 hover:text-blue-300 underline">https://christendijoux.com</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.hosting.title')}</h2>
              <div className="space-y-2">
                <p><strong>{t('legal.hosting.provider')}:</strong> {t('legal.hosting.providerName')}</p>
                <p><strong>Adresse:</strong> {t('legal.hosting.address')}</p>
                <p><strong>Téléphone:</strong> {t('legal.hosting.phone')}</p>
                <p><strong>Site web:</strong> <a href={t('legal.hosting.website')} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">{t('legal.hosting.website')}</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.intellectual.title')}</h2>
              <p className="mb-4">{t('legal.intellectual.copyright')}</p>
              <p className="mb-4">{t('legal.intellectual.usage')}</p>
              <p>{t('legal.intellectual.projects')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.personalData.title')}</h2>
              <p className="mb-4">{t('legal.personalData.description')}</p>
              <p>
                {t('legal.personalData.link')}: <a href="/privacy-policy" className="text-blue-400 hover:text-blue-300 underline">{t('legal.personalData.linkText')}</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.liability.title')}</h2>
              <p className="mb-4">{t('legal.liability.content')}</p>
              <p className="mb-4">{t('legal.liability.links')}</p>
              <p>{t('legal.liability.availability')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.applicable.title')}</h2>
              <p>{t('legal.applicable.law')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('legal.technologies.title')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('legal.technologies.frontend')}</h3>
                  <ul className="text-sm space-y-1">
                    <li>React 18</li>
                    <li>TypeScript</li>
                    <li>Vite</li>
                    <li>TailwindCSS</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('legal.technologies.animation')}</h3>
                  <ul className="text-sm space-y-1">
                    <li>GSAP</li>
                    <li>Three.js</li>
                    <li>Lenis</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{t('legal.technologies.services')}</h3>
                  <ul className="text-sm space-y-1">
                    <li>Google Analytics</li>
                    <li>Sentry</li>
                    <li>EmailJS</li>
                    <li>Supabase</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                {t('legal.contact.title')}: <a href="mailto:christendijoux@gmail.com" className="text-blue-400 hover:text-blue-300 underline">christendijoux@gmail.com</a>
              </p>
            </section>
          </div>
        </div>

        <Footer variant="minimal" />
      </div>
    </>
  );
}
