"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, X } from "lucide-react";

type Message = {
  role: "user" | "bot";
  content: string;
};

const initialBotMessage: Message = {
  role: "bot",
  content:
    "Hi! I'm a chatbot running on a transformer LLM Huy built from scratch (small vocab, demo quality). Ask me about him — answers may be limited 😅",
};

export function ChatWindow({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

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
      const data = await res.json();
      const reply = res.ok
        ? data.reply ?? "(no reply)"
        : data.error ?? "Error: chatbot is waking up. Please try again in a moment.";
      setMessages((m) => [...m, { role: "bot", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "bot", content: "Network error. The model may be spinning up — try again in ~30s." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex h-[500px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-3">
        <div>
          <h3 className="text-sm font-semibold">Ask me anything</h3>
          <p className="text-[11px] text-muted-foreground">Powered by custom transformer</p>
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
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-foreground"
              }`}
            >
              {m.content}
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
