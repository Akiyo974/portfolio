import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Hook to register and manage Service Worker for PWA
 * Handles automatic updates and displays update notifications
 */
export function usePWA() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('SW Registered: ' + r);
    },
    onRegisterError(error) {
      console.log('SW registration error', error);
    },
  });

  const close = () => {
    setOfflineReady(false);
    setNeedRefresh(false);
  };

  useEffect(() => {
    if (needRefresh) {
      const updateApp = confirm(
        'Une nouvelle version est disponible. Voulez-vous mettre à jour ?'
      );
      if (updateApp) {
        updateServiceWorker(true);
      }
    }
  }, [needRefresh, updateServiceWorker]);

  return {
    offlineReady,
    needRefresh,
    updateServiceWorker,
    close,
  };
}
