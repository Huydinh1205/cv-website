"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Mascot } from "page-mascot";
import { ChatWindow } from "./ChatWindow";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowNudge(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  function dismissNudge() {
    setShowNudge(false);
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      <AnimatePresence>
        {open ? (
          <motion.div
            key="window"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="absolute right-0 bottom-[calc(100%+0.75rem)] w-[min(360px,calc(100vw-2rem))] origin-bottom-right"
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        ) : !open && showNudge ? (
          <motion.div
            key="nudge"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 24 }}
            onClick={() => {
              setShowNudge(false);
              setOpen(true);
            }}
            className="absolute right-4 bottom-[calc(100%+0.9rem)] w-60 cursor-pointer"
          >
            <div className="relative rounded-[22px] bg-accent px-4 py-3 text-sm text-accent-foreground shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              <button
                type="button"
                aria-label="Dismiss"
                onClick={(e) => {
                  e.stopPropagation();
                  dismissNudge();
                }}
                className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-card text-foreground shadow transition hover:bg-muted"
              >
                <X className="size-3" />
              </button>
              <p className="font-semibold">Hi, I&apos;m Ryan 👋</p>
              <p className="mt-0.5 text-accent-foreground/70">Curious about me? Click here to ask!</p>
              {/* tail pointing down to the mascot */}
              <span className="absolute right-9 -bottom-[7px] size-4 rotate-45 rounded-[3px] bg-accent" />
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* The Mascot renders its own focusable <button>; this wrapper just
          catches its bubbled click to toggle the chat window. */}
      <div
        onClick={() => {
          setOpen((v) => !v);
          if (showNudge) dismissNudge();
        }}
        className="drop-shadow-lg"
      >
        <Mascot
          directions="/mascots/huy-directions.webp"
          reactions="/mascots/huy-reactions.webp"
          size={110}
          label={open ? "Huy — close chatbot" : "Huy — open chatbot"}
        />
      </div>
    </div>
  );
}
