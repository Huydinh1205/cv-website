"use client";

import { motion } from "framer-motion";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
      >
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
          about
        </p>
        <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
          A bit about me
        </h2>
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          {profile.bio}
        </p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Location
            </dt>
            <dd className="mt-1 text-sm font-medium">{profile.location}</dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </dt>
            <dd className="mt-1 break-all text-sm font-medium">
              <a
                href={`mailto:${profile.email}`}
                className="transition hover:text-accent"
              >
                {profile.email}
              </a>
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Currently
            </dt>
            <dd className="mt-1 text-sm font-medium">
              Research Assistant @ UTS
            </dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}
