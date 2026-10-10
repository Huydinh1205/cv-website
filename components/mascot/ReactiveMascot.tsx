"use client";

/**
 * The page mascot, adapted from the `page-mascot` package (MIT, Kamran Ahmed).
 * Same sprite sheets and cursor tracking, plus two things the package does not
 * offer: other components can trigger an expression with `mascotReact()`, and
 * the mascot dozes off when the page has been idle for a while.
 */

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type RefObject,
} from "react";
import {
  MASCOT_EVENT,
  MASCOT_REACTIONS,
  type MascotReactDetail,
  type MascotReaction,
} from "@/lib/mascot";

const DIRECTIONS = [
  "up-left",
  "up",
  "up-right",
  "left",
  "center",
  "right",
  "down-left",
  "down",
  "down-right",
] as const;

type Direction = (typeof DIRECTIONS)[number];

// Clockwise from the right, matching atan2 with y pointing down.
const CLOCKWISE: readonly Direction[] = [
  "right",
  "down-right",
  "down",
  "down-left",
  "left",
  "up-left",
  "up",
  "up-right",
];

const SECTOR = (Math.PI * 2) / CLOCKWISE.length;
const HYSTERESIS = 0.12;
const DEAD_ZONE = 70;
const PAYOFFS: readonly MascotReaction[] = ["heart", "sparkle", "delighted"];
const BOOP_PAYOFF = 120;
const BOOP_END = 560;
const SQUASH_MS = 420;
const DIZZY_AFTER = 4;
const DIZZY_WINDOW = 1600;
const DIZZY_END = 1100;
const IDLE_MS = 60_000;
const WAKE_MS = 600;

const SQUASH: Keyframe[] = [
  { transform: "scale(1, 1)", easing: "ease-in" },
  { transform: "scale(1.10, 0.86)", offset: 0.18, easing: "ease-out" },
  { transform: "scale(0.95, 1.08)", offset: 0.45, easing: "ease-in-out" },
  { transform: "scale(1.03, 0.97)", offset: 0.72, easing: "ease-in-out" },
  { transform: "scale(1, 1)" },
];

// background-size 300% makes each cell a clean 0/50/100% step on both axes.
function cell(index: number): CSSProperties {
  return {
    backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
  };
}

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle));
}

function clearTimers(timers: RefObject<number[]>) {
  timers.current.forEach((id) => window.clearTimeout(id));
  timers.current = [];
}

function later(timers: RefObject<number[]>, ms: number, run: () => void) {
  timers.current.push(window.setTimeout(run, ms));
}

const layer: CSSProperties = {
  position: "absolute",
  inset: 0,
  backgroundSize: "300% 300%",
  backgroundRepeat: "no-repeat",
};

export type ReactiveMascotProps = {
  /** The 3x3 sheet of head directions. */
  directions: string;
  /** The 3x3 sheet of expressions. */
  reactions: string;
  size?: number;
  className?: string;
  /** What a screen reader calls it. */
  label?: string;
};

export function ReactiveMascot({
  directions,
  reactions,
  size = 140,
  className,
  label = "mascot",
}: ReactiveMascotProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const squashRef = useRef<HTMLSpanElement>(null);
  const timersRef = useRef<number[]>([]);
  const boopsRef = useRef({ count: 0, at: 0 });
  const asleepRef = useRef(false);
  const [direction, setDirection] = useState<Direction>("center");
  const [reaction, setReaction] = useState<MascotReaction | null>(null);

  // Follow the cursor (only where there is a fine pointer to follow).
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      return;
    }
    let sector = -1;
    let pointer: { x: number; y: number } | null = null;
    const aim = () => {
      const button = buttonRef.current;
      if (!button || !pointer) return;
      const box = button.getBoundingClientRect();
      const dx = pointer.x - (box.left + box.width / 2);
      const dy = pointer.y - (box.top + box.height / 2);
      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1;
        setDirection("center");
        return;
      }
      // Hold the current sector until the pointer is well past its edge.
      const angle = Math.atan2(dy, dx);
      if (
        sector !== -1 &&
        Math.abs(wrap(angle - sector * SECTOR)) < SECTOR / 2 + HYSTERESIS
      ) {
        return;
      }
      sector =
        (Math.round(angle / SECTOR) + CLOCKWISE.length) % CLOCKWISE.length;
      setDirection(CLOCKWISE[sector]);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
      aim();
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("scroll", aim, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("scroll", aim);
    };
  }, []);

  // Expressions requested by the rest of the page via mascotReact().
  useEffect(() => {
    const onReact = (event: Event) => {
      const detail = (event as CustomEvent<MascotReactDetail>).detail;
      if (!detail || !MASCOT_REACTIONS.includes(detail.reaction)) return;
      clearTimers(timersRef);
      asleepRef.current = false;
      setReaction(detail.reaction);
      later(timersRef, detail.duration, () => setReaction(null));
    };
    window.addEventListener(MASCOT_EVENT, onReact);
    return () => window.removeEventListener(MASCOT_EVENT, onReact);
  }, []);

  // Doze off after a minute without activity; wake up startled.
  useEffect(() => {
    let idleTimer = 0;
    let armedAt = 0;
    const fallAsleep = () => {
      clearTimers(timersRef);
      asleepRef.current = true;
      setReaction("sleepy");
    };
    const arm = () => {
      armedAt = Date.now();
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(fallAsleep, IDLE_MS);
    };
    const onActivity = () => {
      if (asleepRef.current) {
        asleepRef.current = false;
        clearTimers(timersRef);
        setReaction("surprised");
        later(timersRef, WAKE_MS, () => setReaction(null));
        arm();
        return;
      }
      // pointermove fires constantly; re-arming once a second is plenty.
      if (Date.now() - armedAt > 1000) arm();
    };
    const events = ["pointermove", "pointerdown", "keydown", "scroll"] as const;
    events.forEach((name) =>
      window.addEventListener(name, onActivity, { passive: true }),
    );
    arm();
    return () => {
      window.clearTimeout(idleTimer);
      events.forEach((name) => window.removeEventListener(name, onActivity));
    };
  }, []);

  useEffect(() => {
    return () => clearTimers(timersRef);
  }, []);

  const boop = () => {
    clearTimers(timersRef);
    asleepRef.current = false;
    const now = Date.now();
    const boops = boopsRef.current;
    boops.count = now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1;
    boops.at = now;
    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0;
      setReaction("dizzy");
      later(timersRef, DIZZY_END, () => setReaction(null));
    } else {
      const payoff = PAYOFFS[(boops.count - 1) % PAYOFFS.length];
      setReaction("blink");
      later(timersRef, BOOP_PAYOFF, () => setReaction(payoff));
      later(timersRef, BOOP_END, () => setReaction(null));
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    // Per-keyframe easing with the effect itself linear: an easing on the
    // effect would reinterpret every offset and front-load the whole bounce.
    squashRef.current?.animate(SQUASH, { duration: SQUASH_MS, easing: "linear" });
  };

  return (
    <button
      ref={buttonRef}
      type="button"
      onClick={boop}
      aria-label={`Boop the ${label}`}
      className={className}
      style={{
        position: "relative",
        display: "block",
        flexShrink: 0,
        width: size,
        height: size,
        padding: 0,
        border: 0,
        background: "transparent",
        appearance: "none",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <span
        ref={squashRef}
        style={{
          position: "relative",
          display: "block",
          width: "100%",
          height: "100%",
          transformOrigin: "50% 78%",
        }}
      >
        <span
          style={{
            ...layer,
            backgroundImage: `url(${directions})`,
            ...cell(DIRECTIONS.indexOf(direction)),
            opacity: reaction ? 0 : 1,
          }}
        />
        <span
          style={{
            ...layer,
            backgroundImage: `url(${reactions})`,
            ...cell(MASCOT_REACTIONS.indexOf(reaction ?? "blink")),
            opacity: reaction ? 1 : 0,
          }}
        />
      </span>
    </button>
  );
}
