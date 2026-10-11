/** Écran d'attente entre deux pages chargées à la demande (très bref). */
export const LoadingScreen = () => (
  <div className="flex min-h-[60vh] items-center justify-center bg-ink" role="status" aria-label="Chargement">
    <span className="label">
      {'>'} loading <span className="animate-blink">_</span>
    </span>
  </div>
);
