"use client";

import { motion } from "framer-motion";
import { CardFx } from "@/components/CardFx";
import { educations } from "@/data/education";
import { Section } from "./Section";

export function Education() {
  return (
    <Section id="education" eyebrow="02" title="Education">
      <div className="grid gap-4 sm:grid-cols-2">
        {educations.map((edu, i) => (
          <motion.div
            key={`${edu.school}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            whileHover={{
              y: -8,
              transition: { type: "spring", stiffness: 260, damping: 20 },
            }}
            whileTap={{ y: -3, transition: { duration: 0.12 } }}
            tabIndex={-1}
            className="group relative isolate overflow-hidden rounded-lg border border-border bg-card p-5 transition card-lift hover:border-accent/50"
          >
            <CardFx />
            <h3 className="text-lg font-semibold">{edu.school}</h3>
            <p className="text-sm text-muted-foreground">
              {edu.degree} · {edu.field}
            </p>
            <p className="mt-1 font-mono text-xs text-accent">{edu.period}</p>
            {edu.description ? (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {edu.description}
              </p>
            ) : null}
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
