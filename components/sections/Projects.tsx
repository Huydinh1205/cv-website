"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BrainCircuit,
  Code2,
  Database,
  ExternalLink,
  FolderLock,
  LayoutGrid,
  Loader2,
  Lock,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/Brands";
import {
  categoryMeta,
  projects,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import { Section } from "./Section";

type Filter = "all" | ProjectCategory;

const filterOrder: Filter[] = ["all", "ai", "software", "data"];

const filterIcon: Record<Filter, typeof Code2> = {
  all: LayoutGrid,
  ai: BrainCircuit,
  software: Code2,
  data: Database,
};

const filterLabel: Record<Filter, string> = {
  all: "All",
  ai: categoryMeta.ai.short,
  software: categoryMeta.software.short,
  data: categoryMeta.data.short,
};

const categoryOrder: ProjectCategory[] = ["ai", "software", "data"];

export function Projects() {
  const [filter, setFilter] = useState<Filter>("all");

  const visibleCategories: ProjectCategory[] =
    filter === "all" ? categoryOrder : [filter];

  return (
    <Section id="projects" eyebrow="04" title="Projects">
      <div
        className="mb-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Project category filter"
      >
        {filterOrder.map((f) => {
          const Icon = filterIcon[f];
          const active = filter === f;
          const count =
            f === "all"
              ? projects.length
              : projects.filter((p) => p.categories.includes(f)).length;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition ${
                active
                  ? "border-accent bg-accent text-accent-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              <Icon className="size-3.5" />
              {filterLabel[f]}
              <span
                className={`ml-1 rounded font-mono text-[10px] ${
                  active
                    ? "text-accent-foreground/80"
                    : "text-muted-foreground/70"
                }`}
              >
                ({count})
              </span>
            </button>
          );
        })}
      </div>

      <div className="space-y-12">
        {visibleCategories.map((cat) => {
          const items = projects.filter((p) => p.categories.includes(cat));
          if (items.length === 0) return null;
          const meta = categoryMeta[cat];
          const Icon = filterIcon[cat];
          return (
            <div key={cat}>
              <div className="mb-5 flex items-baseline gap-3 border-b border-border pb-2">
                <Icon className="size-4 self-center text-accent" />
                <h3 className="text-xl font-semibold">{meta.label}</h3>
                <span className="font-mono text-xs text-muted-foreground">
                  {items.length} project{items.length === 1 ? "" : "s"}
                </span>
                <p className="ml-auto hidden text-xs text-muted-foreground sm:block">
                  {meta.description}
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                {items.map((p, i) => (
                  <ProjectCard key={`${cat}-${p.name}`} p={p} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ProjectCard({ p, index }: { p: Project; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group flex flex-col rounded-lg border border-border bg-card p-5 transition hover:border-accent/50 hover:shadow-lg"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <h4 className="text-lg font-semibold">{p.name}</h4>
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
      <p className="text-sm text-muted-foreground">{p.description}</p>
      {p.metrics?.length ? (
        <ul className="mt-3 space-y-1">
          {p.metrics.map((m) => (
            <li key={m} className="flex gap-2 text-sm text-foreground/90">
              <span className="mt-1.5 size-1 shrink-0 rounded-full bg-accent" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4 flex-1" />
      <div className="flex flex-wrap gap-1.5">
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
  );
}
