import type { CSSProperties } from "react";

// Deterministic bubble positions/sizes so SSR + CSR match (no hydration warning).
// Each bubble: x% from left, size in px, delay s, duration s, horizontal drift px.
const BUBBLES: Array<{
  x: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
}> = [
  { x: 8, size: 10, delay: 0.0, duration: 4.2, drift: -8 },
  { x: 22, size: 6, delay: 0.6, duration: 3.8, drift: 6 },
  { x: 35, size: 14, delay: 0.2, duration: 5.0, drift: -4 },
  { x: 48, size: 8, delay: 1.4, duration: 4.0, drift: 10 },
  { x: 61, size: 11, delay: 0.9, duration: 4.5, drift: -6 },
  { x: 74, size: 7, delay: 0.4, duration: 3.6, drift: 4 },
  { x: 86, size: 13, delay: 1.1, duration: 4.8, drift: -10 },
  { x: 92, size: 5, delay: 1.7, duration: 3.4, drift: 8 },
];

export function Bubbles({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit] ${className}`}
    >
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
