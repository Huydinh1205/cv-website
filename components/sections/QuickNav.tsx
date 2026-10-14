"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, FileText, FlaskConical, FolderGit2, Mail, ScanFace } from "lucide-react";

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

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.45, delay: 0.4 }}
        className="mt-4"
      >
        <Link
          href="/ascii-cam"
          className="group flex flex-col gap-4 overflow-hidden rounded-lg border border-border bg-[#050a14] p-5 text-slate-200 transition hover:border-accent/60 hover:shadow-lg sm:flex-row sm:items-center"
        >
          <pre
            aria-hidden
            className="shrink-0 font-mono text-[9px] leading-[1.05] text-sky-300/80 transition group-hover:text-sky-300"
          >{` .:;i1tf;.
:1fLCG0GCf1:
iLG08@@80GLi
tC0@@@@@@0Ct
:fG08@@80Gf:
 .;1tLCLt1;.
   :i1f1i:   `}</pre>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-xs text-slate-400">
              <span className="text-orange-400">ryan@huy</span>:~$ <span className="text-sky-400">ascii-cam --person</span>
            </p>
            <h3 className="mt-1 flex items-center gap-2 text-lg font-semibold text-slate-100">
              <ScanFace className="size-5 text-sky-400" /> Lab: turn yourself into ASCII
            </h3>
            <p className="mt-1 text-sm text-slate-400">
              Live webcam to coloured characters. A segmentation model keeps the room as video and
              redraws only you. Runs entirely in your browser.
            </p>
          </div>
          <ArrowUpRight className="size-5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-sky-400" />
        </Link>
      </motion.div>
    </section>
  );
}
