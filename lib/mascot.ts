/** The nine cells of the mascot's reactions sheet, in sheet order. */
export const MASCOT_REACTIONS = [
  "blink",
  "heart",
  "sparkle",
  "surprised",
  "wink",
  "bashful",
  "sleepy",
  "dizzy",
  "delighted",
] as const;

export type MascotReaction = (typeof MASCOT_REACTIONS)[number];

export type MascotReactDetail = { reaction: MascotReaction; duration: number };

export const MASCOT_EVENT = "mascot:react";

/**
 * Ask the mascot to show an expression for a moment. Safe to call from any
 * client component; it is a no-op on the server or when no mascot is mounted.
 */
export function mascotReact(reaction: MascotReaction, duration = 900) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<MascotReactDetail>(MASCOT_EVENT, {
      detail: { reaction, duration },
    }),
  );
}
