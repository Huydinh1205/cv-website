"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { X } from "lucide-react";
import { ReactiveMascot } from "@/components/mascot/ReactiveMascot";
import { mascotReact, type MascotReaction } from "@/lib/mascot";
import { CHAT_OPEN_EVENT } from "@/lib/ui-events";
import { ChatWindow } from "./ChatWindow";

const NUDGE_SEEN_KEY = "chat-nudge-seen";
/** Hop heights (px) after a drop: each bounce is smaller and ends at the floor. */
const HOPS = [-60, -36, -20, -9];
/** Seconds each hop takes, up and down. */
const HOP_SECONDS = [0.44, 0.36, 0.28, 0.2];
/** Scrolling this many pixels within a short window makes the mascot dizzy. */
const DIZZY_SCROLL_PX = 900;
const DIZZY_WINDOW_MS = 150;
const DIZZY_COOLDOWN_MS = 6_000;

/** A short expression when the visitor lands on each page. */
const pageReactions: Record<string, MascotReaction> = {
  "/": "wink",
  "/resume": "bashful",
  "/projects": "delighted",
  "/research": "sparkle",
  "/contact": "heart",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const pathname = usePathname();
  const lastPathRef = useRef<string | null>(null);

  // Drag state: the whole widget (mascot, bubble, chat window) moves together.
  const boundsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const draggedRef = useRef(false);
  const arriveTimerRef = useRef(0);

  // Show the "ask me" bubble once per browser session, not on every page.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(NUDGE_SEEN_KEY)) return;
    } catch {
      // Storage can be unavailable (private mode, blocked cookies); just show it.
    }
    const timer = setTimeout(() => {
      setShowNudge(true);
      try {
        sessionStorage.setItem(NUDGE_SEEN_KEY, "1");
      } catch {
        // Ignore: the bubble will simply show again on the next page.
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Wake the Hugging Face Space as soon as the site loads, so the model is
  // usually ready by the time someone opens the chat.
  useEffect(() => {
    fetch("/api/chat", { cache: "no-store" }).catch(() => {});
  }, []);

  // Let other components (the command palette, the terminal) open the chat.
  useEffect(() => {
    const onOpen = () => {
      setShowNudge(false);
      setOpen(true);
    };
    window.addEventListener(CHAT_OPEN_EVENT, onOpen);
    return () => window.removeEventListener(CHAT_OPEN_EVENT, onOpen);
  }, []);

  // React when the visitor navigates to another page (not on first load).
  useEffect(() => {
    const previous = lastPathRef.current;
    lastPathRef.current = pathname;
    if (previous === null || previous === pathname) return;
    mascotReact(pageReactions[pathname] ?? "blink", 1000);
  }, [pathname]);

  // Scrolling very fast makes the mascot dizzy.
  useEffect(() => {
    let lastY = window.scrollY;
    let windowStart = 0;
    let travelled = 0;
    let lastDizzy = -Infinity;
    const onScroll = () => {
      const now = performance.now();
      const dy = Math.abs(window.scrollY - lastY);
      lastY = window.scrollY;
      if (now - windowStart > DIZZY_WINDOW_MS) {
        windowStart = now;
        travelled = 0;
      }
      travelled += dy;
      if (travelled > DIZZY_SCROLL_PX && now - lastDizzy > DIZZY_COOLDOWN_MS) {
        lastDizzy = now;
        travelled = 0;
        mascotReact("dizzy", 1400);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    return () => window.clearTimeout(arriveTimerRef.current);
  }, []);

  function dismissNudge() {
    setShowNudge(false);
  }

  function onDragEnd() {
    // Let the click that ends the drag pass before accepting clicks again.
    window.setTimeout(() => {
      draggedRef.current = false;
    }, 0);

    // Gravity: drop straight to the floor, then bounce home in shrinking hops,
    // sliding sideways a little with each one until it is back in the corner.
    const startX = x.get();
    const startY = y.get();
    const fall = Math.min(0.5, 0.18 + Math.abs(startY) / 1000);
    const yFrames = [startY, 0];
    const times = [0, fall];
    const eases: ("easeIn" | "easeOut")[] = ["easeIn"];
    let t = fall;
    HOPS.forEach((height, i) => {
      yFrames.push(height, 0);
      times.push(t + HOP_SECONDS[i] / 2, t + HOP_SECONDS[i]);
      eases.push("easeOut", "easeIn");
      t += HOP_SECONDS[i];
    });
    const total = t;
    animate(y, yFrames, {
      duration: total,
      times: times.map((time) => time / total),
      ease: eases,
    });
    // Stay put while falling, then travel home across the hops.
    animate(x, [startX, startX, 0], {
      duration: total,
      times: [0, fall / total, 1],
      ease: "linear",
    });

    mascotReact("surprised", 900);
    window.clearTimeout(arriveTimerRef.current);
    arriveTimerRef.current = window.setTimeout(
      () => mascotReact("delighted", 900),
      total * 1000,
    );
  }

  return (
    <div ref={boundsRef} className="pointer-events-none fixed inset-0 z-50">
      <motion.div
        drag
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={boundsRef}
        dragElastic={0.08}
        dragMomentum={false}
        onDragStart={() => {
          draggedRef.current = true;
          window.clearTimeout(arriveTimerRef.current);
        }}
        onDragEnd={onDragEnd}
        style={{ x, y }}
        onClickCapture={(event) => {
          if (draggedRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className="pointer-events-auto absolute right-4 bottom-4 sm:right-6 sm:bottom-6"
      >
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

        {/* The mascot renders its own focusable <button>; this wrapper catches
            its bubbled click to toggle the chat window, and starts a drag when
            the pointer moves instead. */}
        <div
          onClick={() => {
            setOpen((v) => !v);
            if (showNudge) dismissNudge();
          }}
          onPointerDown={(event) => dragControls.start(event)}
          style={{ touchAction: "none" }}
          className="cursor-grab drop-shadow-lg active:cursor-grabbing"
        >
          <ReactiveMascot
            directions="/mascots/huy-directions.webp"
            reactions="/mascots/huy-reactions.webp"
            size={110}
            label={open ? "Huy: close chatbot" : "Huy: open chatbot"}
          />
        </div>
      </motion.div>
    </div>
  );
}
