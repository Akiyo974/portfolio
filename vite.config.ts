import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { compression } from 'vite-plugin-compression2'
import { VitePWA } from 'vite-plugin-pwa'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'node:path'

export default defineConfig(({ command }) => ({
  resolve: {
    // Force a single React runtime instance across all optimized deps.
    dedupe: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-i18next'],
    alias: {
      react: path.resolve(__dirname, 'node_modules/react'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime', 'react-i18next'],
  },
  plugins: [
    react(),
    // Pas de version compressée du PHP ni des .htaccess (leur source serait téléchargeable),
    // ni des images/PDF/polices (déjà compressés : .br/.gz inutiles)
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/, /\.php$/, /\.htaccess$/, /\.(webp|png|jpe?g|pdf|woff2?)$/],
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/, /\.php$/, /\.htaccess$/, /\.(webp|png|jpe?g|pdf|woff2?)$/],
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/favicon.ico', 'assets/favicon.svg'],
      manifest: {
        name: 'Christen Dijoux - Portfolio',
        short_name: 'Portfolio',
        description: 'Portfolio interactif de Christen Dijoux - Développeur Full-stack',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/assets/favicon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/assets/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
            purpose: 'apple-touch-icon'
          },
          {
            src: '/assets/favicon.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,webp}'],
        globIgnores: ['**/apple-touch-icon.png', '**/favicon*.{png,ico,svg}'],
        dontCacheBustURLsMatching: /\.(webp)$/,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.github\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'github-api-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    // Sentry plugin (only in production with auth token)
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      telemetry: false,
    }),
  ].filter(Boolean) as Plugin[],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'gsap-vendor': ['gsap'],
          'framer-motion': ['framer-motion'],
          'i18n': ['i18next', 'react-i18next'],
        },
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        passes: 2,
        pure_funcs: ['console.log', 'console.info', 'console.debug']
      },
      mangle: {
        safari10: true
      }
    },
    chunkSizeWarningLimit: 600,
  },
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'react',
  },
  server: {
    headers: {
      // Never cache dev modules to avoid stale mixed dependency graphs.
      'Cache-Control': command === 'serve' ? 'no-store' : 'public, max-age=31536000',
    },
  },
}));
