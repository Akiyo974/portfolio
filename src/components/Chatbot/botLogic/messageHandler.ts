import { respond } from './brain';
import { BotContext, BotReply, Lang } from './types';

/**
 * Traite un message utilisateur et renvoie la réponse de l'assistant
 * avec le contexte mis à jour (pour les questions de suivi).
 * @example
 * const { reply } = await handleMessage('Quels projets ?', 'fr');
 */
export const handleMessage = async (
  message: string,
  lang: Lang = 'fr',
  context: BotContext = {}
): Promise<{ reply: BotReply; context: BotContext }> => {
  const result = respond(message, lang, context);
  // Délai proportionnel à la longueur de la réponse, pour un rythme naturel
  const delay = Math.min(1100, 350 + result.reply.text.length * 2);
  await new Promise((resolve) => setTimeout(resolve, delay));
  return result;
};
