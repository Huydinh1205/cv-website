import { NextResponse } from "next/server";
import { z } from "zod";
import { answerFromFacts } from "@/lib/chat-facts";

const schema = z.object({
  message: z.string().min(1).max(500),
});

/** The model answers in well under a second once the Space is awake. */
const CHAT_TIMEOUT_MS = 15_000;
const WARM_TIMEOUT_MS = 8_000;

function spaceUrl() {
  return process.env.HF_SPACE_URL?.replace(/\/$/, "");
}

/**
 * Warm-up and status check. The site calls this as soon as a page loads so a
 * sleeping Hugging Face Space starts waking before the visitor opens the chat.
 */
export async function GET() {
  const target = spaceUrl();
  if (!target) return NextResponse.json({ ready: false });
  try {
    const upstream = await fetch(`${target}/`, {
      cache: "no-store",
      signal: AbortSignal.timeout(WARM_TIMEOUT_MS),
    });
    if (!upstream.ok) return NextResponse.json({ ready: false });
    const data = (await upstream.json()) as { model_loaded?: boolean };
    return NextResponse.json({ ready: data.model_loaded === true });
  } catch {
    return NextResponse.json({ ready: false });
  }
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid message (1-500 chars)." },
      { status: 400 }
    );
  }

  const { message } = parsed.data;
  // If the model cannot answer in time, reply from the site's own data instead
  // of an error. `source` lets the UI say which one the visitor is reading.
  const facts = () =>
    NextResponse.json({ reply: answerFromFacts(message), source: "facts" });

  const target = spaceUrl();
  if (!target) {
    console.error("Chatbot not configured (HF_SPACE_URL).");
    return facts();
  }

  try {
    const upstream = await fetch(`${target}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
      signal: AbortSignal.timeout(CHAT_TIMEOUT_MS),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("LLM upstream error", upstream.status, text.slice(0, 500));
      return facts();
    }
    const data = (await upstream.json()) as { reply?: string };
    return NextResponse.json({ reply: data.reply ?? "", source: "model" });
  } catch (err) {
    console.error("Chat proxy error", err);
    return facts();
  }
}
