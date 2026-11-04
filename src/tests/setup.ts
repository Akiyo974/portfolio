import { afterAll, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Cleanup after each test case
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as unknown as typeof IntersectionObserver;

// Mock requestAnimationFrame, avec de vrais identifiants pour que cancelAnimationFrame annule
const frames = new Map<number, ReturnType<typeof setTimeout>>();
let lastFrame = 0;

global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  const id = ++lastFrame;
  frames.set(id, setTimeout(() => {
    frames.delete(id);
    cb(performance.now());
  }, 0));
  return id;
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(frames.get(id));
  frames.delete(id);
};

// GSAP et ScrollTrigger continuent de tourner après un test : sans ça, une animation
// se déclenche une fois jsdom détruit (« getComputedStyle is not defined »)
afterEach(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  gsap.globalTimeline.getChildren().forEach((animation) => animation.kill());
});

afterAll(() => {
  gsap.ticker.sleep();
  frames.forEach(clearTimeout);
  frames.clear();
});

// Mock scrollIntoView for jsdom
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  writable: true,
  value: () => {},
});
