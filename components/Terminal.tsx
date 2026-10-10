"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "@/data/profile";
import { mascotReact } from "@/lib/mascot";
import { runCommand } from "@/lib/shell";
import { transitionTheme } from "@/lib/theme-transition";
import { TERMINAL_OPEN_EVENT, openChat } from "@/lib/ui-events";

type Line = { kind: "input" | "output"; text: string };

const PROMPT = "visitor@dinhquochuy:~$";
const MAX_LINES = 400;

const welcome: Line[] = [
  { kind: "output", text: `Welcome to ${profile.nickname}'s portfolio shell. Type help to begin.` },
];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/** A Quake-style console that drops from the top when you press `. */
export function Terminal() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<Line[]>(welcome);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const show = useCallback(() => {
    setOpen(true);
    mascotReact("surprised", 700);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "`" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        if (!open && isTypingTarget(event.target)) return;
        event.preventDefault();
        if (open) setOpen(false);
        else show();
      } else if (event.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(TERMINAL_OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(TERMINAL_OPEN_EVENT, show);
    };
  }, [open, show]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines, open]);

  const submit = () => {
    const command = input.trim();
    const result = runCommand(command, {
      pathname,
      theme: resolvedTheme === "light" ? "light" : "dark",
      navigate: (href) => router.push(href),
      openExternal: (url) => window.open(url, "_blank", "noopener,noreferrer"),
      setTheme: (next) => transitionTheme(next, () => setTheme(next)),
      openChat,
      mascot: (reaction) => mascotReact(reaction, 1200),
      downloadCv: () => {
        const link = document.createElement("a");
        link.href = profile.cvUrl;
        link.download = "";
        link.click();
      },
    });

    setInput("");
    setCursor(-1);
    if (command) setHistory((h) => [command, ...h].slice(0, 50));
    setLines((prev) => {
      if (result.clear) return [];
      const next = [
        ...prev,
        { kind: "input" as const, text: command },
        ...result.lines.map((text) => ({ kind: "output" as const, text })),
      ];
      return next.slice(-MAX_LINES);
    });
    if (result.close) setOpen(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(cursor + 1, history.length - 1);
      if (next >= 0) {
        setCursor(next);
        setInput(history[next]);
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = cursor - 1;
      setCursor(next);
      setInput(next >= 0 ? history[next] : "");
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="terminal"
          role="dialog"
          aria-label="Terminal"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ type: "spring", stiffness: 420, damping: 38 }}
          className="fixed inset-x-0 top-0 z-[70] mx-auto flex h-[46vh] max-h-[520px] w-full max-w-4xl flex-col overflow-hidden rounded-b-xl border border-t-0 border-border bg-[#070b14]/95 font-mono text-[13px] text-slate-200 shadow-2xl backdrop-blur"
          onClick={() => inputRef.current?.focus()}
        >
          <div className="flex items-center justify-between border-b border-border/60 px-4 py-2 text-[11px] text-slate-400">
            <span>{profile.nickname}&apos;s shell</span>
            <span>
              press <kbd className="rounded border border-border/60 px-1">`</kbd> or Esc to close
            </span>
          </div>
          <div ref={bodyRef} className="scrollbar-thin flex-1 overflow-y-auto px-4 py-3">
            {lines.map((line, index) =>
              line.kind === "input" ? (
                <p key={index} className="whitespace-pre-wrap">
                  <span className="text-accent">{PROMPT}</span> {line.text}
                </p>
              ) : (
                <p key={index} className="whitespace-pre-wrap break-words text-slate-300">
                  {line.text}
                </p>
              ),
            )}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                submit();
              }}
              className="flex items-center gap-2"
            >
              <label htmlFor="terminal-input" className="shrink-0 text-accent">
                {PROMPT}
              </label>
              <input
                id="terminal-input"
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                autoComplete="off"
                autoCapitalize="off"
                spellCheck={false}
                aria-label="Terminal command"
                className="min-w-0 flex-1 bg-transparent text-slate-100 caret-accent outline-none"
              />
            </form>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
