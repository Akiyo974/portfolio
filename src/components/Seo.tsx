import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SITE_URL } from '../lib/seo';

const DEFAULT_IMAGE = `${SITE_URL}/assets/art/og-cover.png`;

/**
 * Balises SEO d'une page : titre, description, canonical, hreflang FR/EN, Open Graph et Twitter.
 * Toutes les pages passent par ici : les balises statiques d'index.html (data-rh) sont remplacées,
 * jamais dupliquées. Le français est servi sur `?lang=fr` ; chaque langue est sa propre canonical.
 */
export const Seo: React.FC<{
  title: string;
  description: string;
  /** Chemin de la page, ex. "/lab" */
  path: string;
  image?: string;
  imageAlt?: string;
  type?: 'website' | 'article' | 'profile';
  noindex?: boolean;
  children?: React.ReactNode;
}> = ({ title, description, path, image, imageAlt, type = 'website', noindex = false, children }) => {
  const { i18n } = useTranslation();
  const fr = i18n.language?.startsWith('fr');
  const en = `${SITE_URL}${path}`;
  const frUrl = `${en}?lang=fr`;
  const self = fr ? frUrl : en;
  const img = image ? (image.startsWith('http') ? image : `${SITE_URL}${image}`) : DEFAULT_IMAGE;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large'} />
      {!noindex && <link rel="canonical" href={self} />}
      {!noindex && <link rel="alternate" hrefLang="en" href={en} />}
      {!noindex && <link rel="alternate" hrefLang="fr" href={frUrl} />}
      {!noindex && <link rel="alternate" hrefLang="x-default" href={en} />}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Christen Dijoux" />
      <meta property="og:locale" content={fr ? 'fr_CA' : 'en_CA'} />
      <meta property="og:url" content={self} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={img} />
      <meta property="og:image:alt" content={imageAlt ?? title} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={imageAlt ?? title} />
      {children}
    </Helmet>
  );
};

export default Seo;
