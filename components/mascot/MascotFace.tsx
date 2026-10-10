import type { CSSProperties } from "react";
import { MASCOT_REACTIONS, type MascotReaction } from "@/lib/mascot";

/** One fixed expression from the reactions sheet, no tracking or events. */
export function MascotFace({
  reaction,
  size = 140,
  className = "",
}: {
  reaction: MascotReaction;
  size?: number;
  className?: string;
}) {
  const index = MASCOT_REACTIONS.indexOf(reaction);
  const style: CSSProperties = {
    width: size,
    height: size,
    backgroundImage: "url(/mascots/huy-reactions.webp)",
    backgroundSize: "300% 300%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: `${(index % 3) * 50}% ${Math.floor(index / 3) * 50}%`,
  };
  return <span aria-hidden className={`block ${className}`} style={style} />;
}
