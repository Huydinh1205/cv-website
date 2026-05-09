"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  title: string;
  eyebrow?: string;
  children: ReactNode;
};

export function Section({ id, title, eyebrow, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6 sm:py-24">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-10"
      >
        {eyebrow ? (
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">{eyebrow}</p>
        ) : null}
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}
