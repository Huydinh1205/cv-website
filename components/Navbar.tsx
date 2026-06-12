"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./Logo";
import { profile } from "@/data/profile";

const navItems = [
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${profile.name} — home`}
          className="group inline-flex items-center gap-2 transition hover:opacity-80"
        >
          <LogoMark size="md" initials="QH" />
          <span className="hidden font-mono text-sm font-semibold sm:inline">
            {profile.nickname}
          </span>
        </Link>
        <div className="flex items-center gap-1 sm:gap-3">
          <ul className="hidden gap-1 sm:flex">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`rounded-md px-2.5 py-1.5 text-sm transition ${
                      active
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <a
            href={profile.cvUrl}
            download
            className="hidden items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 sm:inline-flex"
          >
            <Download className="size-3.5" /> CV
          </a>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
