"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons/Brands";
import { profile } from "@/data/profile";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col-reverse items-center gap-10 px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-20 md:flex-row md:justify-between md:gap-12">
      <motion.div
        initial="hidden"
        animate="visible"
        transition={{ staggerChildren: 0.12, delayChildren: 0.05 }}
        className="flex-1"
      >
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mb-3 font-mono text-sm text-accent"
        >
          hi, my name is
        </motion.p>
        <motion.h1
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl"
        >
          {profile.name} ({profile.nickname})
        </motion.h1>
        <motion.h2
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-2 text-3xl font-semibold tracking-tight text-muted-foreground sm:text-4xl md:text-5xl"
        >
          {profile.title}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground"
        >
          {profile.tagline}
        </motion.p>

        <motion.div
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          className="mt-8 flex flex-wrap items-center gap-3"
        >
          <a
            href="#contact"
            className="inline-flex items-center rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition hover:opacity-90"
          >
            Get in touch
          </a>
          <a
            href="#projects"
            className="inline-flex items-center rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            View projects
          </a>
          <div className="ml-2 flex gap-2">
            <SocialLink href={profile.socials.github} label="GitHub">
              <GithubIcon className="size-4" />
            </SocialLink>
            <SocialLink href={profile.socials.linkedin} label="LinkedIn">
              <LinkedinIcon className="size-4" />
            </SocialLink>
            <SocialLink href={`mailto:${profile.email}`} label="Email">
              <Mail className="size-4" />
            </SocialLink>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="relative shrink-0"
      >
        <div className="absolute -inset-2 rounded-full bg-accent/20 blur-2xl" aria-hidden />
        <div className="relative size-48 overflow-hidden rounded-full border-4 border-border shadow-xl sm:size-56 md:size-64">
          <Image
            src={profile.avatar}
            alt={`Portrait of ${profile.name}`}
            fill
            priority
            sizes="(min-width: 768px) 16rem, (min-width: 640px) 14rem, 12rem"
            className="object-cover"
          />
        </div>
      </motion.div>
    </section>
  );
}

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-muted"
    >
      {children}
    </a>
  );
}
