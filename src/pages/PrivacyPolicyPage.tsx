import { useTranslation } from 'react-i18next';
import { Seo } from '../components/Seo';
import { LegalLayout } from '../components/LegalLayout';
import { privacy } from '../data/legal';

export default function PrivacyPolicyPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo path="/privacy-policy" title={`${t('privacy.title')} | Christen Dijoux`} description={t('privacy.metaDescription')} />
      <LegalLayout doc={privacy} other={{ to: '/legal-notice', label: { fr: 'Mentions légales', en: 'Legal notice' } }} />
    </>
  );
}
