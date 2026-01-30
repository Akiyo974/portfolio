import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft } from 'lucide-react';
import ThreeScene from '../components/ThreeScene';

export function NotFoundPage() {
  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0">
        <ThreeScene />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-9xl font-bold mb-4"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              duration: 0.8,
              type: "spring",
              bounce: 0.5
            }}
          >
            404
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Page non trouvée</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              La page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link 
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg
                        hover:bg-white/90 transition-all duration-300 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Retour à l'accueil
            </Link>
          </motion.div>
        </motion.div>

        <motion.div 
          className="absolute bottom-8 left-0 right-0 text-center text-white/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          <p className="text-sm">
            © {new Date().getFullYear()} Christen Dijoux
          </p>
        </motion.div>
      </div>
    </div>
  );
}