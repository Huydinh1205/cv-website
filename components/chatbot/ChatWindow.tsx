"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { mascotReact } from "@/lib/mascot";

type Message = {
  role: "user" | "bot";
  content: string;
  /** Answered from the site's data because the model was not ready. */
  fromFacts?: boolean;
};

type ModelStatus = "checking" | "online" | "waking";

const STATUS_INTERVAL_MS = 5000;
const MAX_STATUS_CHECKS = 12;

const statusMeta: Record<ModelStatus, { dot: string; text: string }> = {
  checking: { dot: "bg-muted-foreground/50", text: "Checking the model..." },
  online: { dot: "bg-emerald-500", text: "Custom transformer is online" },
  waking: {
    dot: "bg-amber-500 animate-pulse",
    text: "Model is waking up. Quick answers meanwhile.",
  },
};

const initialBotMessage: Message = {
  role: "bot",
  content:
    "Hi! I'm a chatbot running on a transformer LLM Huy built from scratch (small vocab, demo quality). Ask me about him, but answers may be limited 😅",
};

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ModelStatus>("checking");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  // Ask the server whether the model is awake; keep checking while it wakes.
  useEffect(() => {
    let cancelled = false;
    let tries = 0;
    let timer = 0;
    async function check() {
      let ready = false;
      try {
        const res = await fetch("/api/chat", { cache: "no-store" });
        ready = ((await res.json()) as { ready?: boolean }).ready === true;
      } catch {
        ready = false;
      }
      if (cancelled) return;
      setStatus(ready ? "online" : "waking");
      tries += 1;
      if (!ready && tries < MAX_STATUS_CHECKS) {
        timer = window.setTimeout(check, STATUS_INTERVAL_MS);
      }
    }
    check();
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = (await res.json()) as {
        reply?: string;
        error?: string;
        source?: "model" | "facts";
      };
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "bot", content: data.error ?? "Something went wrong. Please try again." },
        ]);
        mascotReact("dizzy", 1000);
        return;
      }
      const fromFacts = data.source === "facts";
      setMessages((m) => [
        ...m,
        { role: "bot", content: data.reply || "(no reply)", fromFacts },
      ]);
      setStatus(fromFacts ? "waking" : "online");
      mascotReact(fromFacts ? "bashful" : "delighted", 1000);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", content: "Network error. Please check your connection and try again." },
      ]);
      mascotReact("dizzy", 1000);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Ask me anything</h3>
          <p
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground"
            aria-live="polite"
          >
            <span className={`size-1.5 shrink-0 rounded-full ${statusMeta[status].dot}`} />
            {statusMeta[status].text}
          </p>
        </div>
        <button
          aria-label="Close"
          onClick={onClose}
          className="text-muted-foreground transition hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div ref={scrollRef} className="scrollbar-thin flex-1 space-y-3 overflow-y-auto px-4 py-3">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm break-words whitespace-pre-line ${
                m.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.content}
              {m.fromFacts ? (
                <span className="mt-1.5 block border-t border-border/60 pt-1.5 text-[11px] text-muted-foreground">
                  Quick answer from Huy&apos;s profile data. The transformer is still waking up.
                </span>
              ) : null}
            </div>
          </motion.div>
        ))}
        {loading ? (
          <div className="flex justify-start">
            <div className="rounded-lg bg-muted px-3 py-2">
              <span className="inline-flex gap-1">
                <Dot delay={0} />
                <Dot delay={0.15} />
                <Dot delay={0.3} />
              </span>
            </div>
          </div>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-center gap-2 border-t border-border bg-background/50 p-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a question..."
          className="flex-1 rounded-md bg-card px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          aria-label="Send"
          className="inline-flex size-9 items-center justify-center rounded-md bg-accent text-accent-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      animate={{ opacity: [0.3, 1, 0.3] }}
      transition={{ duration: 0.9, repeat: Infinity, delay }}
      className="size-1.5 rounded-full bg-foreground/60"
    />
  );
}
