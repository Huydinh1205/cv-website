"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, FlaskConical, FolderGit2, Mail } from "lucide-react";

const items = [
  {
    href: "/resume",
    label: "Resume",
    description: "Experience, education, and skills",
    icon: FileText,
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Selected engineering and research work",
    icon: FolderGit2,
  },
  {
    href: "/research",
    label: "Research",
    description: "Publications, preprints, and interests",
    icon: FlaskConical,
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Reach out, open to opportunities",
    icon: Mail,
  },
];

export function QuickNav() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <p className="mb-2 font-mono text-xs uppercase tracking-wider text-accent">
          explore
        </p>
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Where to next?
        </h2>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <Link
                href={item.href}
                className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition hover:border-accent/50 hover:shadow-lg"
              >
                <div className="flex items-start justify-between">
                  <div className="flex size-11 items-center justify-center rounded-md bg-accent/10 text-accent transition group-hover:bg-accent group-hover:text-accent-foreground">
                    <Icon className="size-5" strokeWidth={1.8} />
                  </div>
                  <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
