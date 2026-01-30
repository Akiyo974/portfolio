import React, { useState } from 'react';
import { SlidersHorizontal, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectFilterProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    selectedLanguage: string | null;
    setSelectedLanguage: (language: string | null) => void;
    availableLanguages: string[];
}

export const ProjectFilter: React.FC<ProjectFilterProps> = ({
    searchTerm,
    setSearchTerm,
    selectedLanguage,
    setSelectedLanguage,
    availableLanguages,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleLanguageSelection = (language: string | null) => {
        setSelectedLanguage(language);
        setIsDropdownOpen(false);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <motion.div 
                className="relative flex-1"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <Search className="w-5 h-5 text-white/40" />
                </div>
                <input
                    type="text"
                    placeholder="Rechercher un projet..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full pl-12 pr-10 py-3 bg-white/10 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300"
                />
                <AnimatePresence>
                    {searchTerm && (
                        <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-4 flex items-center"
                        >
                            <X className="w-5 h-5 text-white/40 hover:text-white transition-colors" />
                        </motion.button>
                    )}
                </AnimatePresence>
            </motion.div>
            <motion.div 
                className="relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
            >
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20"
                >
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="whitespace-nowrap">
                        {selectedLanguage ? `Langage : ${selectedLanguage}` : "Trier par langage"}
                    </span>
                </button>
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg rounded-xl shadow-xl border border-white/10 overflow-hidden z-10"
                        >
                            <div className="max-h-64 overflow-y-auto">
                                <motion.button
                                    whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                    onClick={() => handleLanguageSelection(null)}
                                    className="w-full px-4 py-3 text-left text-white"
                                >
                                    Tous les langages
                                </motion.button>
                                {availableLanguages.map((language) => (
                                    <motion.button
                                        key={language}
                                        whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                                        onClick={() => handleLanguageSelection(language)}
                                        className="w-full px-4 py-3 text-left text-white"
                                    >
                                        {language}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};