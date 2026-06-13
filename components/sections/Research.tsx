"use client";

import { motion } from "framer-motion";
import { ExternalLink, FileText, Loader2 } from "lucide-react";
import { Bubbles } from "@/components/Bubbles";
import {
  academicProfiles,
  publications,
  researchInterests,
  researchStatement,
  type Publication,
} from "@/data/research";
import { Section } from "./Section";

const statusLabel: Record<Publication["status"], string> = {
  "in-preparation": "In preparation",
  "in-submission": "In submission",
  accepted: "Accepted",
  published: "Published",
};

const statusStyle: Record<Publication["status"], string> = {
  "in-preparation":
    "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  "in-submission":
    "bg-sky-500/15 text-sky-600 dark:text-sky-400",
  accepted: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  published: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

export function Research() {
  return (
    <>
      <Section id="research-statement" eyebrow="01" title="Research statement">
        <p className="max-w-3xl text-justify text-base leading-relaxed text-muted-foreground hyphens-auto">
          {researchStatement}
        </p>
        <h3 className="mt-8 mb-3 text-sm font-mono uppercase tracking-wider text-accent">
          Interests
        </h3>
        <ul className="space-y-2">
          {researchInterests.map((interest) => (
            <li
              key={interest}
              className="flex gap-2 text-sm text-foreground/90"
            >
              <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span>{interest}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="publications"
        eyebrow="02"
        title="Publications & preprints"
      >
        <div className="space-y-5">
          {publications.map((pub, i) => (
            <motion.article
              key={pub.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition hover:border-accent/50 hover:shadow-lg [&>*:not(.bubble-layer)]:relative [&>*:not(.bubble-layer)]:z-10"
            >
              <Bubbles className="bubble-layer" />
              <div className="mb-2 flex flex-wrap items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-snug">
                  {pub.title}
                </h3>
                <span
                  className={`inline-flex shrink-0 items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium ${statusStyle[pub.status]}`}
                >
                  {pub.status === "in-preparation" ||
                  pub.status === "in-submission" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : null}
                  {statusLabel[pub.status]}
                </span>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {pub.venue} · {pub.year}
                {pub.authors ? ` · ${pub.authors}` : ""}
              </p>
              <p className="mt-3 text-justify text-sm leading-relaxed text-muted-foreground hyphens-auto">
                {pub.abstract}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {pub.topics.map((t) => (
                  <span
                    key={t}
                    className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              {pub.links &&
              (pub.links.paper || pub.links.code || pub.links.project) ? (
                <div className="mt-4 flex gap-3 text-sm">
                  {pub.links.paper ? (
                    <a
                      href={pub.links.paper}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-accent"
                    >
                      <FileText className="size-3.5" /> Paper
                    </a>
                  ) : null}
                  {pub.links.code ? (
                    <a
                      href={pub.links.code}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-muted-foreground transition hover:text-accent"
                    >
                      <ExternalLink className="size-3.5" /> Code
                    </a>
                  ) : null}
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      </Section>

      <Section id="academic-profiles" eyebrow="03" title="Academic profiles">
        <div className="grid gap-3 sm:grid-cols-2">
          {academicProfiles.map((p) => {
            const empty = !p.url;
            return empty ? (
              <div
                key={p.name}
                className="flex items-center justify-between rounded-lg border border-dashed border-border bg-card p-4 text-muted-foreground"
              >
                <span className="font-medium">{p.name}</span>
                <span className="font-mono text-xs">{p.handle}</span>
              </div>
            ) : (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 transition hover:border-accent/50 hover:bg-muted"
              >
                <span className="font-medium transition group-hover:text-accent">
                  {p.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  @{p.handle}
                </span>
              </a>
            );
          })}
        </div>
      </Section>
    </>
  );
}
