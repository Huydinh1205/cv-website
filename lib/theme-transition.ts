import { flushSync } from "react-dom";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

const WAVE_CLASS = "theme-wave";

/**
 * Switch theme with a "water line" sweeping down the page, using the View
 * Transitions API where available. Falls back to an instant switch elsewhere
 * and when the visitor prefers reduced motion.
 */
export function transitionTheme(next: "light" | "dark", apply: () => void) {
  const root = document.documentElement;
  const swap = () => {
    // Apply the class ourselves inside the transition callback so the new
    // snapshot is guaranteed to show the new theme; next-themes then stores
    // the choice and keeps things in sync.
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    apply();
  };

  const doc = document as ViewTransitionDocument;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!doc.startViewTransition || reduceMotion) {
    swap();
    return;
  }

  root.classList.add(WAVE_CLASS);
  const transition = doc.startViewTransition(() => flushSync(swap));
  transition.finished.finally(() => root.classList.remove(WAVE_CLASS));
}
