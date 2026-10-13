"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CardFx } from "@/components/CardFx";
import {
  BrainCircuit,
  Code2,
  Database,
  ExternalLink,
  FolderLock,
  LayoutGrid,
  Loader2,
  Lock,
  MonitorPlay,
  Play,
  Star,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/Brands";
import {
  categoryMeta,
  projects,
  type Project,
  type ProjectCategory,
} from "@/data/projects";
import { slugify } from "@/lib/utils";

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
                  <ProjectCard
                    key={`${cat}-${p.name}`}
                    p={p}
                    index={i}
                    // A project can sit in several categories; only its first
                    // visible card carries the id, so `/projects#slug` is unique.
                    anchor={
                      cat === (filter === "all" ? p.categories[0] : filter)
                    }
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function ProjectCard({
  p,
  index,
  anchor,
}: {
  p: Project;
  index: number;
  anchor: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);
  const [inView, setInView] = useState(false);
  const canHover = useCanHover();
  const reduceMotion = useReducedMotion();

  // Touch screens have no hover, so a clip plays while its card is mostly on screen.
  useEffect(() => {
    if (canHover || !p.video || !ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      threshold: 0.6,
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [canHover, p.video]);

  const playing = !reduceMotion && (canHover ? hovered : inView);

  return (
    <motion.article
      ref={ref}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      id={anchor ? slugify(p.name) : undefined}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      whileHover={{
        y: -8,
        transition: { type: "spring", stiffness: 260, damping: 20 },
      }}
      whileTap={{ y: -3, transition: { duration: 0.12 } }}
      tabIndex={-1}
      className="group relative isolate flex scroll-mt-20 flex-col overflow-hidden rounded-lg border border-border bg-card p-5 transition card-lift hover:border-accent/50 [&>*:not(.overlay-layer)]:relative [&>*:not(.overlay-layer)]:z-10"
    >
      <CardFx className="overlay-layer" />
      {/* Detector-style annotation: corner brackets and a label on hover. */}
      <span
        aria-hidden
        className="overlay-layer pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <span className="absolute top-1.5 left-1.5 size-3 border-t-2 border-l-2 border-accent" />
        <span className="absolute top-1.5 right-1.5 size-3 border-t-2 border-r-2 border-accent" />
        <span className="absolute bottom-1.5 left-1.5 size-3 border-b-2 border-l-2 border-accent" />
        <span className="absolute right-1.5 bottom-1.5 size-3 border-r-2 border-b-2 border-accent" />
        <span className="absolute top-1 left-5 rounded-sm bg-accent px-1.5 py-0.5 font-mono text-[10px] leading-none font-semibold text-accent-foreground">
          {p.categories.join("+")}
          {p.status ? " · in-progress" : p.featured ? " · featured" : ""}
        </span>
      </span>
      {p.image ? (
        <ProjectMedia p={p} playing={playing} canHover={canHover} />
      ) : null}
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
      <p className="text-sm leading-relaxed text-muted-foreground">
        {p.description}
      </p>
      {p.metrics?.length ? (
        <ul className="mt-3 space-y-1.5">
          {p.metrics.map((m) => (
            <li
              key={m}
              className="flex gap-2 text-sm leading-relaxed text-foreground/90"
            >
              <span className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="flex-1" />
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
                aria-label={`${p.name} GitHub: ${url.split("/").pop()}`}
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
        {p.links.video ? (
          <a
            href={p.links.video}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${p.name} demo video`}
            className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground transition hover:text-accent"
          >
            <MonitorPlay className="size-4" /> Demo video
          </a>
        ) : null}
      </div>
    </motion.article>
  );
}

/** True on devices with a real pointer that can hover (not touch screens). */
const HOVER_QUERY = "(hover: hover)";

function useCanHover() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(HOVER_QUERY);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  );
}

/**
 * Thumbnail strip at the top of a card. Projects with a `video` swap the
 * still for a short muted clip while the card is hovered (or on screen, on
 * touch devices). The clip is not downloaded until it first plays.
 */
function ProjectMedia({
  p,
  playing,
  canHover,
}: {
  p: Project;
  playing: boolean;
  canHover: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [playing]);

  return (
    <div className="relative -mx-5 -mt-5 mb-4 aspect-video overflow-hidden border-b border-border bg-muted">
      {/* Plain <img>: covers are a mix of webp screenshots and svg drawings. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.image}
        alt={`${p.name} preview`}
        width={960}
        height={540}
        loading="lazy"
        decoding="async"
        className="size-full object-cover transition duration-500 group-hover:scale-[1.03]"
      />
      {p.video ? (
        <>
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="none"
            aria-hidden
            onPlaying={() => setReady(true)}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-300 ${
              playing && ready ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* VP9 first for Chrome/Firefox, H.264 for Safari. */}
            <source src={p.video.replace(/\.mp4$/, ".webm")} type="video/webm" />
            <source src={p.video} type="video/mp4" />
          </video>
          <span className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-white/90 backdrop-blur-sm">
            {playing ? (
              <>
                <span className="size-1.5 animate-pulse rounded-full bg-red-500" />{" "}
                live
              </>
            ) : (
              <>
                <Play className="size-2.5 fill-current" />{" "}
                {canHover ? "hover to play" : "scroll to play"}
              </>
            )}
          </span>
        </>
      ) : null}
    </div>
  );
}
