"use client";

import { motion } from "framer-motion";
import { skillGroups } from "@/data/skills";
import { Section } from "./Section";

export function Skills() {
  return (
    <Section id="skills" eyebrow="03" title="Skills">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, i) => (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
            className="rounded-lg border border-border bg-card p-5"
          >
            <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-accent">
              {group.category}
            </h3>
            <ul className="flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="rounded-md bg-muted px-2 py-1 text-xs text-foreground/90 transition hover:bg-accent hover:text-accent-foreground"
                >
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
