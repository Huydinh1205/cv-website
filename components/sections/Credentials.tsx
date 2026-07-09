"use client";

import { motion } from "framer-motion";
import { Award as AwardIcon, BadgeCheck, ExternalLink } from "lucide-react";
import { Bubbles } from "@/components/Bubbles";
import { awards, certifications } from "@/data/credentials";
import { Section } from "./Section";

export function Credentials() {
  return (
    <>
      <Section id="certifications" eyebrow="04" title="Certifications">
        <ul className="grid gap-3 sm:grid-cols-2">
          {certifications.map((c, i) => (
            <motion.li
              key={c.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition hover:border-accent/50 hover:shadow-lg"
            >
              <Bubbles className="bubble-layer" />
              <div className="relative z-10 flex gap-3">
                <BadgeCheck className="mt-0.5 size-5 shrink-0 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight">
                    {c.title}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {c.issuer} · {c.year}
                  </p>
                  {c.description ? (
                    <p className="mt-2 text-justify text-sm leading-relaxed text-muted-foreground hyphens-auto">
                      {c.description}
                    </p>
                  ) : null}
                  {c.certificateUrl ? (
                    <a
                      href={c.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition hover:opacity-80"
                    >
                      <ExternalLink className="size-3.5" /> View certificate
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </Section>

      <Section id="awards" eyebrow="05" title="Awards">
        <ul className="grid gap-3 sm:grid-cols-2">
          {awards.map((a, i) => (
            <motion.li
              key={a.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-4 transition hover:border-accent/50 hover:shadow-lg"
            >
              <Bubbles className="bubble-layer" />
              <div className="relative z-10 flex gap-3">
                <AwardIcon className="mt-0.5 size-5 shrink-0 text-accent" />
                <div className="flex-1">
                  <p className="text-sm font-semibold leading-tight">
                    {a.title}
                  </p>
                  <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                    {a.organisation} · {a.year} · {a.level}
                  </p>
                  {a.description ? (
                    <p className="mt-2 text-justify text-sm leading-relaxed text-muted-foreground hyphens-auto">
                      {a.description}
                    </p>
                  ) : null}
                  {a.certificateUrl ? (
                    <a
                      href={a.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-accent transition hover:opacity-80"
                    >
                      <ExternalLink className="size-3.5" /> View certificate
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </Section>
    </>
  );
}
