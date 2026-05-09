"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { profile } from "@/data/profile";
import { Section } from "./Section";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type FormValues = z.infer<typeof schema>;

export function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Message sent! I'll get back to you soon 👋");
      reset();
    } catch (err) {
      toast.error("Failed to send. Please try again later.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Section id="contact" eyebrow="05" title="Get in touch">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="grid gap-6 lg:grid-cols-2"
      >
        <div className="space-y-3">
          <p className="text-muted-foreground">
            Have an interesting project, an ML question, or just want to say hi? Drop me a message — I usually reply within 24 hours.
          </p>
          <p className="text-sm text-muted-foreground">
            Or email directly:{" "}
            <a className="text-accent hover:underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name" error={errors.name?.message}>
            <input
              {...register("name")}
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-accent"
              placeholder="Jane Doe"
            />
          </Field>
          <Field label="Email" error={errors.email?.message}>
            <input
              {...register("email")}
              type="email"
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-accent"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Message" error={errors.message?.message}>
            <textarea
              {...register("message")}
              rows={5}
              className="w-full resize-none rounded-md border border-border bg-card px-3 py-2 text-sm outline-none transition focus:border-accent"
              placeholder="Hi Huy, I'd like to..."
            />
          </Field>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 disabled:opacity-60"
          >
            <Send className="size-4" />
            {submitting ? "Sending..." : "Send message"}
          </button>
        </form>
      </motion.div>
    </Section>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {error ? <span className="mt-1 block text-xs text-red-500">{error}</span> : null}
    </label>
  );
}
