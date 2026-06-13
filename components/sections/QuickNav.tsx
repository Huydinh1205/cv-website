"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, FlaskConical, FolderGit2, Mail } from "lucide-react";

const items = [
  {
    href: "/resume",
    label: "Resume",
    description: "Experience, education, and skills",
    icon: FileText,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    href: "/projects",
    label: "Projects",
    description: "Selected engineering and research work",
    icon: FolderGit2,
    gradient: "from-rose-400 to-red-500",
  },
  {
    href: "/research",
    label: "Research",
    description: "Publications, preprints, and interests",
    icon: FlaskConical,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    href: "/contact",
    label: "Contact",
    description: "Reach out — open to opportunities",
    icon: Mail,
    gradient: "from-sky-400 to-cyan-500",
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

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
                className="group flex flex-col items-center text-center"
              >
                <div
                  className={`relative flex size-40 items-center justify-center rounded-full bg-gradient-to-br ${item.gradient} shadow-lg transition group-hover:scale-105 group-hover:shadow-xl sm:size-44`}
                >
                  <Icon className="size-12 text-white" strokeWidth={1.8} />
                </div>
                <h3 className="mt-5 text-xl font-semibold transition group-hover:text-accent">
                  {item.label}
                </h3>
                <p className="mt-1 max-w-[14rem] text-sm text-muted-foreground">
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
