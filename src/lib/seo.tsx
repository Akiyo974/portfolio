export const SITE_URL = 'https://christendijoux.com';

/** Fil d'Ariane JSON-LD (à placer dans <Seo>). */
export const breadcrumb = (items: { name: string; path: string }[]) => (
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
    })}
  </script>
);
