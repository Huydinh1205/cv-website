"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import { Section } from "./Section";

export function Experience() {
  return (
    <Section id="experience" eyebrow="01" title="Experience">
      <ol className="relative ml-3 border-l border-border">
        {experiences.map((exp, i) => (
          <motion.li
            key={`${exp.company}-${i}`}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="mb-10 ml-6 last:mb-0"
          >
            <span className="absolute -left-1.5 mt-1.5 size-3 rounded-full bg-accent ring-4 ring-background" />
            <div className="mb-1 flex flex-wrap items-baseline gap-x-3">
              <h3 className="text-lg font-semibold">{exp.role}</h3>
              <span className="text-sm text-muted-foreground">@ {exp.company}</span>
            </div>
            <p className="font-mono text-xs text-muted-foreground">
              {exp.period}
              {exp.location ? ` · ${exp.location}` : ""}
            </p>
            <p className="mt-3 text-justify text-sm leading-relaxed text-muted-foreground hyphens-auto">
              {exp.description}
            </p>
            <ul className="mt-3 space-y-1.5">
              {exp.highlights.map((h, hi) => (
                <li
                  key={hi}
                  className="flex gap-2 text-sm leading-relaxed text-foreground/90"
                >
                  <span className="shrink-0 text-accent">▹</span>
                  <span className="text-justify hyphens-auto">{h}</span>
                </li>
              ))}
            </ul>
            {exp.tech?.length ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {exp.tech.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border bg-card px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
