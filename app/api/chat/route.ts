import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  const target = process.env.HF_SPACE_URL;
  if (!target) {
    return NextResponse.json(
      { error: "Chatbot not configured (HF_SPACE_URL)." },
      { status: 500 }
    );
  }

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

  try {
    const upstream = await fetch(`${target.replace(/\/$/, "")}/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: parsed.data.message }),
      signal: AbortSignal.timeout(45_000),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error("LLM upstream error", upstream.status, text);
      return NextResponse.json(
        { error: "Chatbot is starting up or hit an error. Try again in a moment." },
        { status: 502 }
      );
    }
    const data = (await upstream.json()) as { reply?: string };
    return NextResponse.json({ reply: data.reply ?? "" });
  } catch (err) {
    console.error("Chat proxy error", err);
    return NextResponse.json(
      { error: "Could not reach chatbot. Model may be spinning up (~30s)." },
      { status: 504 }
    );
  }
}
