"use client";

import { useEffect, useRef, type CSSProperties } from "react";

// Deterministic bubbles so server and client render the same markup.
const BUBBLES: Array<{ x: number; size: number; delay: number; duration: number; drift: number }> = [
  { x: 8, size: 9, delay: 0.0, duration: 2.6, drift: -10 },
  { x: 21, size: 5, delay: 0.35, duration: 2.2, drift: 7 },
  { x: 34, size: 12, delay: 0.15, duration: 3.0, drift: -6 },
  { x: 47, size: 6, delay: 0.5, duration: 2.4, drift: 11 },
  { x: 59, size: 10, delay: 0.25, duration: 2.8, drift: -8 },
  { x: 71, size: 5, delay: 0.6, duration: 2.1, drift: 6 },
  { x: 83, size: 8, delay: 0.1, duration: 2.7, drift: -9 },
  { x: 94, size: 6, delay: 0.45, duration: 2.3, drift: 5 },
];

/**
 * Hover dressing for a card: a soft spotlight that follows the pointer, a
 * brightening top edge, and a few small bubbles drifting up inside. Drop it
 * in as the first child of a `group relative isolate overflow-hidden` card.
 */
export function CardFx({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    const card = layer?.parentElement;
    if (!layer || !card) return;
    const onMove = (event: PointerEvent) => {
      const box = card.getBoundingClientRect();
      layer.style.setProperty("--mx", `${event.clientX - box.left}px`);
      layer.style.setProperty("--my", `${event.clientY - box.top}px`);
    };
    card.addEventListener("pointermove", onMove, { passive: true });
    // Bubbles travel the full height of the card, whatever its size.
    const observer = new ResizeObserver(([entry]) => {
      layer.style.setProperty("--rise", `${entry.contentRect.height + 24}px`);
    });
    observer.observe(card);
    return () => {
      card.removeEventListener("pointermove", onMove);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`card-fx pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[inherit] ${className}`}
    >
      <span className="card-fx-spot" />
      <span className="card-fx-edge" />
      {BUBBLES.map((b, i) => {
        const style: CSSProperties & { ["--bubble-drift"]?: string } = {
          left: `${b.x}%`,
          bottom: `-${b.size + 4}px`,
          width: `${b.size}px`,
          height: `${b.size}px`,
          animationDelay: `${b.delay}s`,
          animationDuration: `${b.duration}s`,
          "--bubble-drift": `${b.drift}px`,
        };
        return <span key={i} className="bubble" style={style} />;
      })}
    </div>
  );
}
