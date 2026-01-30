import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import Footer from '../components/Footer';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Helmet>
        <title>{t('privacy.title')} | Christen Dijoux</title>
        <meta name="description" content={t('privacy.metaDescription')} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-20 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-8">{t('privacy.title')}</h1>
          
          <div className="space-y-8 text-gray-300 leading-relaxed">
            <section>
              <p className="text-sm text-gray-400 mb-8">
                {t('privacy.lastUpdated')}: 19 novembre 2025
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.intro.title')}</h2>
              <p>{t('privacy.intro.content')}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.dataCollected.title')}</h2>
              
              <h3 className="text-xl font-semibold text-white mb-3 mt-6">{t('privacy.dataCollected.analytics.title')}</h3>
              <p className="mb-2">{t('privacy.dataCollected.analytics.description')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('privacy.dataCollected.analytics.items.ip')}</li>
                <li>{t('privacy.dataCollected.analytics.items.browser')}</li>
                <li>{t('privacy.dataCollected.analytics.items.pages')}</li>
                <li>{t('privacy.dataCollected.analytics.items.location')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">{t('privacy.dataCollected.contact.title')}</h3>
              <p className="mb-2">{t('privacy.dataCollected.contact.description')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('privacy.dataCollected.contact.items.name')}</li>
                <li>{t('privacy.dataCollected.contact.items.email')}</li>
                <li>{t('privacy.dataCollected.contact.items.message')}</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mb-3 mt-6">{t('privacy.dataCollected.errors.title')}</h3>
              <p className="mb-2">{t('privacy.dataCollected.errors.description')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('privacy.dataCollected.errors.items.errors')}</li>
                <li>{t('privacy.dataCollected.errors.items.browser')}</li>
                <li>{t('privacy.dataCollected.errors.items.interactions')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.purpose.title')}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.purpose.items.improve')}</li>
                <li>{t('privacy.purpose.items.respond')}</li>
                <li>{t('privacy.purpose.items.fix')}</li>
                <li>{t('privacy.purpose.items.analyze')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.thirdParty.title')}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Google Analytics 4</h3>
                  <p>{t('privacy.thirdParty.ga4')}</p>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">EmailJS</h3>
                  <p>{t('privacy.thirdParty.emailjs')}</p>
                  <a 
                    href="https://www.emailjs.com/legal/privacy-policy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Sentry</h3>
                  <p>{t('privacy.thirdParty.sentry')}</p>
                  <a 
                    href="https://sentry.io/privacy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Supabase</h3>
                  <p>{t('privacy.thirdParty.supabase')}</p>
                  <a 
                    href="https://supabase.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.cookies.title')}</h2>
              <p className="mb-4">{t('privacy.cookies.description')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>_ga, _ga_*</strong>: {t('privacy.cookies.items.ga')}</li>
                <li><strong>cookie_consent</strong>: {t('privacy.cookies.items.consent')}</li>
                <li><strong>lang</strong>: {t('privacy.cookies.items.lang')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.rights.title')}</h2>
              <p className="mb-4">{t('privacy.rights.description')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.rights.items.access')}</li>
                <li>{t('privacy.rights.items.rectification')}</li>
                <li>{t('privacy.rights.items.deletion')}</li>
                <li>{t('privacy.rights.items.opposition')}</li>
                <li>{t('privacy.rights.items.portability')}</li>
              </ul>
              <p className="mt-4">
                {t('privacy.rights.contact')}: <a href="mailto:christendijoux@gmail.com" className="text-blue-400 hover:text-blue-300 underline">christendijoux@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.retention.title')}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.retention.items.analytics')}</li>
                <li>{t('privacy.retention.items.contact')}</li>
                <li>{t('privacy.retention.items.errors')}</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">{t('privacy.changes.title')}</h2>
              <p>{t('privacy.changes.description')}</p>
            </section>

            <section className="pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-400">
                {t('privacy.contact.title')}: <a href="mailto:christendijoux@gmail.com" className="text-blue-400 hover:text-blue-300 underline">christendijoux@gmail.com</a>
              </p>
            </section>
          </div>
        </div>

        <Footer variant="minimal" />
      </div>
    </>
  );
}
