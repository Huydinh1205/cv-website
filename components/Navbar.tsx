"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download, Menu, Search, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { LogoMark } from "./Logo";
import { profile } from "@/data/profile";
import { mascotReact } from "@/lib/mascot";
import { openPalette } from "@/lib/ui-events";
import { useIsMac } from "@/lib/use-is-mac";

const navItems = [
  { href: "/resume", label: "Resume" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  // The mobile menu remembers the route it was opened on, so navigating to
  // another page closes it without needing an effect.
  const [openedOn, setOpenedOn] = useState<string | null>(null);
  const open = openedOn === pathname;
  const setOpen = (next: boolean) => setOpenedOn(next ? pathname : null);
  const isMac = useIsMac();

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          aria-label={`${profile.name} — home`}
          className="group inline-flex items-center gap-2 transition hover:opacity-80"
        >
          <LogoMark size="md" />
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
          <button
            type="button"
            onClick={openPalette}
            aria-label="Search the site and run commands"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-2.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <Search className="size-4" />
            <kbd className="hidden font-mono text-[11px] sm:inline">
              {isMac ? "⌘K" : "Ctrl K"}
            </kbd>
          </button>
          <a
            href={profile.cvUrl}
            download
            onClick={() => mascotReact("heart", 1200)}
            className="hidden items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground transition hover:opacity-90 sm:inline-flex"
          >
            <Download className="size-3.5" /> CV
          </a>
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
            className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-muted sm:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu sheet */}
      <div
        id="mobile-nav"
        className={`sm:hidden ${open ? "block" : "hidden"} border-t border-border bg-background`}
      >
        <ul className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-3">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium transition ${
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
          <li className="mt-1">
            <a
              href={profile.cvUrl}
              download
              onClick={() => mascotReact("heart", 1200)}
              className="flex items-center justify-center gap-2 rounded-md bg-accent px-3 py-2 text-base font-medium text-accent-foreground transition hover:opacity-90"
            >
              <Download className="size-4" /> Download CV
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
