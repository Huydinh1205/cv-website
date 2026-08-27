"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase } from "lucide-react";
import { Bubbles } from "@/components/Bubbles";
import { experiences } from "@/data/experience";

export function ExperiencePreview() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex items-baseline justify-between gap-4"
      >
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
            experience
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Where I've worked
          </h2>
        </div>
        <Link
          href="/resume"
          className="hidden shrink-0 items-center gap-1 text-sm text-accent transition hover:opacity-80 sm:inline-flex"
        >
          Full resume <ArrowRight className="size-3.5" />
        </Link>
      </motion.div>

      <ol className="grid gap-4 sm:grid-cols-2">
        {experiences.map((exp, i) => (
          <motion.li
            key={`${exp.company}-${i}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="group relative overflow-hidden rounded-lg border border-border bg-card p-5 transition hover:border-accent/50 hover:shadow-lg"
          >
            <Bubbles className="bubble-layer" />
            <div className="relative z-10">
              <div className="mb-2 flex items-start gap-2">
                <Briefcase className="mt-1 size-4 shrink-0 text-accent" />
                <div className="flex-1">
                  <h3 className="text-base font-semibold leading-tight">
                    {exp.role}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    @ {exp.company}
                  </p>
                </div>
              </div>
              <p className="font-mono text-xs text-accent">
                {exp.period}
                {exp.location ? ` · ${exp.location}` : ""}
              </p>
              <p className="mt-3 text-justify text-sm leading-relaxed text-muted-foreground hyphens-auto">
                {exp.description}
              </p>
              {exp.tech?.length ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {exp.tech.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-border px-2 py-0.5 font-mono text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </motion.li>
        ))}
      </ol>

      <Link
        href="/resume"
        className="mt-6 inline-flex items-center gap-1 text-sm text-accent transition hover:opacity-80 sm:hidden"
      >
        Full resume <ArrowRight className="size-3.5" />
      </Link>
    </section>
  );
}
