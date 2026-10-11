import React from 'react';
import { Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProjectFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedLanguage: string | null;
    setSelectedLanguage: (language: string | null) => void;
    availableLanguages: string[];
}

/**
 * Recherche + filtres par langage en puces.
 */
export const ProjectFilter: React.FC<ProjectFilterProps> = ({
    searchTerm,
    setSearchTerm,
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
}) => {
    const { t } = useTranslation();
    const chip = (active: boolean) =>
        `px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] border transition-colors ${
            active ? 'border-paper bg-paper text-ink' : 'border-line text-paper/60 hover:border-paper/60 hover:text-paper'
        }`;

    return (
        <div className="mb-10 grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-end">
            <label className="relative block lg:col-span-4">
                <span className="label mb-2 block">{t('ui.search')}</span>
                <Search className="pointer-events-none absolute bottom-3 left-0 h-4 w-4 text-paper/55" aria-hidden="true" />
                <input
                    type="text"
                    placeholder={t('ui.searchPlaceholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full border-b border-line bg-transparent py-2.5 pl-7 pr-8 text-paper placeholder:text-paper/30 transition-colors focus:border-paper focus:outline-none"
                />
                {searchTerm && (
                    <button
                        type="button"
                        onClick={() => setSearchTerm('')}
                        className="absolute bottom-3 right-0 text-paper/55 hover:text-paper"
                        aria-label={t('ui.clearSearch')}
                    >
                        <X className="h-4 w-4" />
                    </button>
                )}
            </label>

            <div className="lg:col-span-8">
                <span className="label mb-2 block">{t('ui.filterLanguage')}</span>
                <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('ui.filterLanguage')}>
                    <button type="button" onClick={() => setSelectedLanguage(null)} className={chip(selectedLanguage === null)} aria-pressed={selectedLanguage === null}>
                        {t('ui.all')}
                    </button>
                    {availableLanguages.map((language) => (
                        <button
                            key={language}
                            type="button"
                            onClick={() => setSelectedLanguage(selectedLanguage === language ? null : language)}
                            className={chip(selectedLanguage === language)}
                            aria-pressed={selectedLanguage === language}
                        >
                            {language}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
