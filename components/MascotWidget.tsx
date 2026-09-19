"use client";

import { Mascot } from "page-mascot";

export function MascotWidget() {
  return (
    <div className="fixed bottom-4 left-4 z-40 sm:bottom-6 sm:left-6">
      <Mascot
        directions="/mascots/huy-directions.webp"
        reactions="/mascots/huy-reactions.webp"
        size={110}
        label="Huy"
      />
    </div>
  );
}
