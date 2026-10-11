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

      <div className="min-h-screen bg-ink text-paper">
        <div className="px-4 py-16 sm:px-6 md:px-10 md:py-24">
          <h1 className="display mb-14 text-[clamp(3.2rem,9vw,9rem)]">{t('privacy.title')}</h1>
          
          <div className="max-w-3xl space-y-12 leading-relaxed text-paper/70 lg:ml-[25%]">
            <section>
              <p className="label mb-8">
                {t('privacy.lastUpdated')}: 19 novembre 2025
              </p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.intro.title')}</h2>
              <p>{t('privacy.intro.content')}</p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.dataCollected.title')}</h2>
              
              <h3 className="label mb-3 mt-8 text-paper">{t('privacy.dataCollected.analytics.title')}</h3>
              <p className="mb-2">{t('privacy.dataCollected.analytics.description')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('privacy.dataCollected.analytics.items.ip')}</li>
                <li>{t('privacy.dataCollected.analytics.items.browser')}</li>
                <li>{t('privacy.dataCollected.analytics.items.pages')}</li>
                <li>{t('privacy.dataCollected.analytics.items.location')}</li>
              </ul>

              <h3 className="label mb-3 mt-8 text-paper">{t('privacy.dataCollected.contact.title')}</h3>
              <p className="mb-2">{t('privacy.dataCollected.contact.description')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('privacy.dataCollected.contact.items.name')}</li>
                <li>{t('privacy.dataCollected.contact.items.email')}</li>
                <li>{t('privacy.dataCollected.contact.items.message')}</li>
              </ul>

              <h3 className="label mb-3 mt-8 text-paper">{t('privacy.dataCollected.errors.title')}</h3>
              <p className="mb-2">{t('privacy.dataCollected.errors.description')}</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{t('privacy.dataCollected.errors.items.errors')}</li>
                <li>{t('privacy.dataCollected.errors.items.browser')}</li>
                <li>{t('privacy.dataCollected.errors.items.interactions')}</li>
              </ul>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.purpose.title')}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.purpose.items.improve')}</li>
                <li>{t('privacy.purpose.items.respond')}</li>
                <li>{t('privacy.purpose.items.fix')}</li>
                <li>{t('privacy.purpose.items.analyze')}</li>
              </ul>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.thirdParty.title')}</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">Google Analytics 4</h3>
                  <p>{t('privacy.thirdParty.ga4')}</p>
                  <a 
                    href="https://policies.google.com/privacy" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">EmailJS</h3>
                  <p>{t('privacy.thirdParty.emailjs')}</p>
                  <a 
                    href="https://www.emailjs.com/legal/privacy-policy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">Sentry</h3>
                  <p>{t('privacy.thirdParty.sentry')}</p>
                  <a 
                    href="https://sentry.io/privacy/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper"
                  >
                    {t('privacy.thirdParty.viewPolicy')}
                  </a>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-paper mb-2">{t('privacy.thirdParty.starGameTitle')}</h3>
                  <p>{t('privacy.thirdParty.starGame')}</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.cookies.title')}</h2>
              <p className="mb-4">{t('privacy.cookies.description')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>_ga, _ga_*</strong>: {t('privacy.cookies.items.ga')}</li>
                <li><strong>cookie_consent</strong>: {t('privacy.cookies.items.consent')}</li>
                <li><strong>lang</strong>: {t('privacy.cookies.items.lang')}</li>
              </ul>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.rights.title')}</h2>
              <p className="mb-4">{t('privacy.rights.description')}</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.rights.items.access')}</li>
                <li>{t('privacy.rights.items.rectification')}</li>
                <li>{t('privacy.rights.items.deletion')}</li>
                <li>{t('privacy.rights.items.opposition')}</li>
                <li>{t('privacy.rights.items.portability')}</li>
              </ul>
              <p className="mt-4">
                {t('privacy.rights.contact')}: <a href="mailto:christen.dijoux@gmail.com" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">christen.dijoux@gmail.com</a>
              </p>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.retention.title')}</h2>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>{t('privacy.retention.items.analytics')}</li>
                <li>{t('privacy.retention.items.contact')}</li>
                <li>{t('privacy.retention.items.errors')}</li>
              </ul>
            </section>

            <section>
              <h2 className="heading mb-5 border-t border-line pt-6 text-[clamp(1.8rem,3vw,2.6rem)] text-paper">{t('privacy.changes.title')}</h2>
              <p>{t('privacy.changes.description')}</p>
            </section>

            <section className="pt-8 border-t border-line">
              <p className="text-sm text-paper/50">
                {t('privacy.contact.title')}: <a href="mailto:christen.dijoux@gmail.com" className="text-paper underline decoration-paper/30 underline-offset-4 hover:decoration-paper">christen.dijoux@gmail.com</a>
              </p>
            </section>
          </div>
        </div>

        <Footer variant="minimal" />
      </div>
    </>
  );
}
