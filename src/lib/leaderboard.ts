/**
 * Classement du jeu des étoiles.
 * En ligne : API PHP livrée avec le build (public/api/leaderboard.php, hébergement cPanel).
 * Hors ligne / en développement : meilleur score conservé dans le navigateur.
 */

export interface LeaderboardEntry {
  id: number | string;
  nickname: string;
  score: number;
  created_at: string;
}

export const GAME_SECONDS = 20;
const API = '/api/leaderboard.php';
const BEST_KEY = 'cd-star-best';

const request = async <T,>(url: string, init?: RequestInit): Promise<T | null> => {
  try {
    const res = await fetch(url, { ...init, headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) } });
    if (!res.ok) return null;
    const type = res.headers.get('content-type') ?? '';
    // En dev, Vite renvoie index.html au lieu du PHP : on ignore
    if (!type.includes('application/json')) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
};

/** Top 10 en ligne, ou `null` si l'API est indisponible. */
export const fetchLeaderboard = async (): Promise<LeaderboardEntry[] | null> => {
  const data = await request<{ entries: LeaderboardEntry[] }>(API);
  return data?.entries ?? null;
};

/** Jeton de partie signé par le serveur (anti-triche minimal). */
export const startRun = async (): Promise<string | null> => {
  const data = await request<{ token: string }>(`${API}?action=start`, { method: 'POST', body: '{}' });
  return data?.token ?? null;
};

export const submitScore = async (
  nickname: string,
  score: number,
  token: string | null
): Promise<{ entries: LeaderboardEntry[]; rank: number } | null> => {
  if (!token) return null;
  return request(`${API}?action=submit`, {
    method: 'POST',
    body: JSON.stringify({ nickname, score, token }),
  });
};

export const getBestScore = (): number => {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
};

/** Enregistre le score s'il bat le record local ; renvoie true si nouveau record. */
export const saveBestScore = (score: number): boolean => {
  const best = getBestScore();
  if (score <= best) return false;
  try {
    localStorage.setItem(BEST_KEY, String(score));
  } catch {
    /* stockage indisponible */
  }
  return true;
};
