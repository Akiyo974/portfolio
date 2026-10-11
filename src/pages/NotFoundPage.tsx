import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft } from 'lucide-react';
import { SplitText } from '../components/ui/Kinetic';

const DitherHero = lazy(() => import('../components/webgl/DitherHero'));

export function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <main className="grain relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-ink text-paper">
      <Helmet>
        <title>404 | Christen Dijoux</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <Suspense fallback={null}>
        <DitherHero centered />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050505_75%)]" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col justify-between px-4 py-8 sm:px-6 md:px-10">
        <div className="label flex justify-between">
          <span>Error · 404</span>
          <span>{t('ui.lostSignal')}</span>
        </div>

        <div className="text-center">
          <SplitText as="h1" trigger="intro" text="404" className="display block text-[clamp(8rem,32vw,30rem)] leading-[0.8] mix-blend-difference" />
          <p className="heading mx-auto mt-4 max-w-xl text-[clamp(1.5rem,3vw,2.5rem)]">{t('ui.notFoundTitle')}</p>
          <p className="mx-auto mt-3 max-w-md text-paper/60">{t('ui.notFoundText')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <Link to="/" className="btn-solid" data-magnetic>
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> {t('ui.backHome')}
            </Link>
            <Link to="/projects" className="btn-ghost" data-magnetic>
              {t('projects.allProjects')}
            </Link>
          </div>
        </div>

        <p className="label text-center">© {new Date().getFullYear()} Christen Dijoux</p>
      </div>
    </main>
  );
}
