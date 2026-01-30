import { intents } from './intents';
import { botKnowledge } from './knowledge';
import Fuse from 'fuse.js';

const fuseOptions = {
  includeScore: true,
  threshold: 0.4,
  keys: ['patterns'],
};

const fuse = new Fuse(
  Object.entries(intents).map(([key, value]) => ({
    key,
    patterns: value.patterns.map(regex => regex.source),
    responses: value.responses,
  })),
  fuseOptions
);

const normalizeText = (text: string): string => {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
};

const findSpecificTechnology = (message: string): string | null => {
  const technologies = botKnowledge.skills;
  const normalizedMessage = normalizeText(message);
  
  for (const tech of technologies) {
    if (normalizedMessage.includes(normalizeText(tech))) {
      return tech;
    }
  }
  return null;
};

const generateContextualResponse = (message: string): string | null => {
  const normalizedMessage = normalizeText(message);
  
  // Réponses spécifiques pour les technologies
  const technology = findSpecificTechnology(message);
  if (technology) {
    return `${technology} fait partie des compétences de ${botKnowledge.name}. C'est l'une des technologies qu'il utilise régulièrement dans ses projets.`;
  }

  // Réponses pour les projets spécifiques
  for (const project of botKnowledge.projects) {
    if (normalizedMessage.includes(normalizeText(project.name))) {
      return `${project.name} est ${project.description}. Vous pouvez voir le projet ici : ${project.url}`;
    }
  }

  // Réponses pour les formations spécifiques
  for (const edu of botKnowledge.education) {
    if (normalizedMessage.includes(normalizeText(edu.school))) {
      return `${botKnowledge.name} étudie ${edu.title} à ${edu.school} (${edu.period}).`;
    }
  }

  return null;
};

const checkIntent = (message: string): string => {
  const normalizedMessage = normalizeText(message);
  
  // Vérifier d'abord les réponses contextuelles
  const contextualResponse = generateContextualResponse(message);
  if (contextualResponse) {
    return contextualResponse;
  }

  // Rechercher l'intention avec Fuse.js
  const result = fuse.search(normalizedMessage);
  if (result.length > 0) {
    const bestMatch = result[0].item;
    const intentCategory = intents[bestMatch.key];
    return intentCategory.responses[Math.floor(Math.random() * intentCategory.responses.length)];
  }

  return intents.unknown.responses[Math.floor(Math.random() * intents.unknown.responses.length)];
};

/**
 * Handles incoming user messages and returns an appropriate bot response
 * Uses Fuse.js for fuzzy matching and contextual knowledge base
 * @param message - The user's input message
 * @returns Promise resolving to the bot's response string
 * @example
 * const response = await handleMessage('Bonjour');
 */
export const handleMessage = async (message: string): Promise<string> => {
  // Simuler un délai de réponse naturel
  await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));
  
  return checkIntent(message);
};