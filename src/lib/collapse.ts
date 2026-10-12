// Mesures de hauteur repliée pour ui/Expandable.
// Positions de mise en page (offsetTop), pas getBoundingClientRect : les éléments en cours
// d'animation d'entrée (translateY) fausseraient la mesure.

/** Distance verticale entre le haut de `ancestor` et le haut de `node`. */
const topWithin = (node: HTMLElement, ancestor: HTMLElement) => {
  let y = 0;
  let n: HTMLElement | null = node;
  while (n && n !== ancestor) {
    y += n.offsetTop;
    const parent = n.offsetParent as HTMLElement | null;
    // L'ancêtre n'est pas positionné : on retire son propre décalage pour rester relatif à lui
    if (parent && !ancestor.contains(parent)) return y - ancestor.offsetTop;
    n = parent;
  }
  return y;
};

/** Hauteur repliée = les `n` premières lignes du premier paragraphe. */
export const firstLines = (n: number) => (el: HTMLElement) => {
  const p = el.querySelector<HTMLElement>('p') ?? el;
  const lh = parseFloat(getComputedStyle(p).lineHeight) || 24;
  return Math.min(el.scrollHeight, topWithin(p, el) + lh * n);
};

/**
 * Hauteur repliée = les `n` premiers éléments de liste entiers, plus le haut du suivant
 * (`peek` px) : c'est lui qui s'estompe au bord, les `n` premiers restent entiers.
 */
export const firstItems = (n: number, peek = 60) => (el: HTMLElement) => {
  const items = el.querySelectorAll<HTMLElement>('li');
  const last = items[Math.min(n, items.length) - 1];
  if (!last) return 0;
  return Math.min(el.scrollHeight, topWithin(last, el) + last.offsetHeight + (items.length > n ? peek : 0));
};
