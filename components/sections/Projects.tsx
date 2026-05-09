"use client";

import { motion } from "framer-motion";
import { ExternalLink, FolderLock, Loader2, Lock, Star } from "lucide-react";
import { GithubIcon } from "@/components/icons/Brands";
import { projects } from "@/data/projects";
import { Section } from "./Section";

export function Projects() {
  return (
    <Section id="projects" eyebrow="04" title="Projects">
      <div className="grid gap-5 sm:grid-cols-2">
        {projects.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group flex flex-col rounded-lg border border-border bg-card p-5 transition hover:border-accent/50 hover:shadow-lg"
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                {p.status === "in-progress" ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <Loader2 className="size-3 animate-spin" /> In progress
                  </span>
                ) : null}
                {p.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-md bg-accent/15 px-2 py-0.5 text-[11px] font-medium text-accent">
                    <Star className="size-3" /> Featured
                  </span>
                ) : null}
              </div>
            </div>
            <p className="flex-1 text-sm text-muted-foreground">{p.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              {p.links.github ? (
                (Array.isArray(p.links.github) ? p.links.github : [p.links.github]).map(
                  (url) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${p.name} GitHub — ${url.split("/").pop()}`}
                      title={url.split("/").pop()}
                      className="text-muted-foreground transition hover:text-accent"
                    >
                      <GithubIcon className="size-4" />
                    </a>
                  ),
                )
              ) : p.repoVisibility === "private" ? (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <Lock className="size-3.5" /> Private repo
                </span>
              ) : p.repoVisibility === "local" ? (
                <span className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                  <FolderLock className="size-3.5" /> Local only
                </span>
              ) : null}
              {p.links.demo ? (
                <a
                  href={p.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${p.name} demo`}
                  className="text-muted-foreground transition hover:text-accent"
                >
                  <ExternalLink className="size-4" />
                </a>
              ) : null}
            </div>
          </motion.article>
        ))}
      </div>
    </Section>
  );
}
