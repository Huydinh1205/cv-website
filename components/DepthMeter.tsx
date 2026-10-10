"use client";

import { useEffect, useState, type CSSProperties } from "react";

/** How far down the page one "metre" is. */
const PX_PER_METRE = 10;

/**
 * The Deep Ocean theme, taken literally: a small depth gauge that follows the
 * scroll position, a tint that darkens the page the deeper you go, and light
 * rays near the surface that fade out as you dive.
 */
export function DepthMeter() {
  const [metres, setMetres] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      setMetres(Math.max(0, Math.round(y / PX_PER_METRE)));
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const atSeabed = progress > 0.985;

  return (
    <>
      {/* Page tint: deeper means darker. Sits behind the content. */}
      <div
        aria-hidden
        className="depth-tint pointer-events-none fixed inset-0 -z-10"
        style={{ "--depth": progress } as CSSProperties}
      />
      {/* Light rays at the surface, dark theme only. */}
      <div
        aria-hidden
        className="surface-light pointer-events-none fixed inset-x-0 top-0 -z-10 h-[70vh]"
        style={{ opacity: Math.max(0, 1 - progress * 3) }}
      />

      <div
        aria-live="off"
        className="pointer-events-none fixed bottom-6 left-4 z-30 hidden items-end gap-2 font-mono text-[11px] text-muted-foreground transition-opacity duration-300 sm:flex sm:left-6"
        style={{ opacity: metres > 4 ? 1 : 0 }}
      >
        <span className="relative block h-16 w-1 overflow-hidden rounded-full bg-border">
          <span
            className="absolute inset-x-0 top-0 rounded-full bg-accent"
            style={{ height: `${progress * 100}%` }}
          />
        </span>
        <span className="leading-tight">
          <span className="block uppercase tracking-wider opacity-70">
            {atSeabed ? "seabed" : "depth"}
          </span>
          <span className="block text-sm text-foreground tabular-nums">
            {metres} m
          </span>
        </span>
      </div>
    </>
  );
}
