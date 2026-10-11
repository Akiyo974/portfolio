import React from 'react';

/**
 * Étiquette de section façon "[ 01 / 04 ] · À PROPOS"
 */
export const SectionLabel: React.FC<{ index: number; total: number; children: React.ReactNode; className?: string }> = ({
  index,
  total,
  children,
  className = '',
}) => (
  <div className={`flex items-center gap-3 label ${className}`}>
    <span className="h-3 w-px bg-paper" aria-hidden="true" />
    <span aria-hidden="true" className="shrink-0 whitespace-nowrap">
      [ <span className="text-paper">{String(index).padStart(2, '0')}</span> / {String(total).padStart(2, '0')} ]
    </span>
    <span aria-hidden="true">·</span>
    <span>{children}</span>
  </div>
);

/**
 * Image tramée (halftone) qui révèle l'original au survol.
 */
export const DitherImage: React.FC<{
  src: string;
  original?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: 'lazy' | 'eager';
}> = ({ src, original, alt, className = '', imgClassName = 'object-cover', loading = 'lazy' }) => (
  <div className={`group/dither relative overflow-hidden bg-ink ${className}`}>
    <img
      src={src}
      alt={alt}
      loading={loading}
      decoding="async"
      className={`absolute inset-0 h-full w-full ${imgClassName} transition-opacity duration-500 ${original ? 'group-hover/dither:opacity-0' : ''}`}
    />
    {original && (
      <img
        src={original}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className={`absolute inset-0 h-full w-full ${imgClassName} opacity-0 grayscale transition-all duration-700 group-hover/dither:opacity-100 group-hover/dither:grayscale-0`}
      />
    )}
    <span className="pointer-events-none absolute inset-0 border border-line" aria-hidden="true" />
  </div>
);

/** Petite rangée "clé : valeur" en mono */
export const MetaRow: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div className="flex items-baseline justify-between gap-4 border-b border-line py-2 font-mono text-[11px] uppercase tracking-[0.08em]">
    <span className="text-paper/55">{k}</span>
    <span className="text-right text-paper/90">{v}</span>
  </div>
);
