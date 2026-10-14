"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  BookOpen,
  Copy,
  CornerDownLeft,
  Download,
  ExternalLink,
  FileText,
  FolderGit2,
  GraduationCap,
  House,
  Mail,
  MessageCircle,
  ScanFace,
  Search,
  SunMoon,
  TerminalSquare,
  type LucideIcon,
} from "lucide-react";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { publications } from "@/data/research";
import { mascotReact } from "@/lib/mascot";
import { transitionTheme } from "@/lib/theme-transition";
import { PALETTE_OPEN_EVENT, openChat, openTerminal } from "@/lib/ui-events";
import { useIsMac } from "@/lib/use-is-mac";
import { slugify } from "@/lib/utils";

type Command = {
  id: string;
  group: string;
  label: string;
  /** Extra words the search should match, beyond the label. */
  keywords?: string;
  icon: LucideIcon;
  run: () => void;
};

const LISTBOX_ID = "command-palette-list";

export function CommandPalette() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isMac = useIsMac();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const show = useCallback(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setQuery("");
    setActive(0);
    setOpen(true);
    mascotReact("wink", 700);
  }, []);

  const hide = useCallback(() => setOpen(false), []);

  // Cmd/Ctrl+K toggles the palette from anywhere on the site.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (open) hide();
        else show();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener(PALETTE_OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(PALETTE_OPEN_EVENT, show);
    };
  }, [open, show, hide]);

  // While open: focus the search box and lock page scroll. On close, hand
  // focus back to whatever had it before.
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
      returnFocusRef.current?.focus?.();
    };
  }, [open]);

  const commands = useMemo<Command[]>(() => {
    const go = (href: string) => () => router.push(href);
    const external = (url: string) => () =>
      window.open(url, "_blank", "noopener,noreferrer");

    return [
      { id: "nav-home", group: "Go to", label: "Home", icon: House, run: go("/") },
      {
        id: "nav-resume",
        group: "Go to",
        label: "Resume",
        keywords: "experience education skills certifications awards",
        icon: FileText,
        run: go("/resume"),
      },
      {
        id: "nav-projects",
        group: "Go to",
        label: "Projects",
        icon: FolderGit2,
        run: go("/projects"),
      },
      {
        id: "nav-research",
        group: "Go to",
        label: "Research",
        keywords: "publications papers",
        icon: BookOpen,
        run: go("/research"),
      },
      {
        id: "nav-contact",
        group: "Go to",
        label: "Contact",
        keywords: "message email form",
        icon: Mail,
        run: go("/contact"),
      },
      {
        id: "act-cv",
        group: "Actions",
        label: "Download CV",
        keywords: "resume pdf",
        icon: Download,
        run: () => {
          const link = document.createElement("a");
          link.href = profile.cvUrl;
          link.download = "";
          link.click();
          mascotReact("heart", 1200);
        },
      },
      {
        id: "act-chat",
        group: "Actions",
        label: "Ask the chatbot",
        keywords: "chat transformer question",
        icon: MessageCircle,
        run: openChat,
      },
      {
        id: "act-theme",
        group: "Actions",
        label: `Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`,
        keywords: "dark light mode toggle",
        icon: SunMoon,
        run: () => {
          const next = resolvedTheme === "dark" ? "light" : "dark";
          transitionTheme(next, () => setTheme(next));
          mascotReact("surprised", 700);
        },
      },
      {
        id: "act-terminal",
        group: "Actions",
        label: "Open terminal",
        keywords: "shell console console command line",
        icon: TerminalSquare,
        run: openTerminal,
      },
      {
        id: "act-ascii-cam",
        group: "Actions",
        label: "Turn yourself into ASCII",
        keywords: "ascii cam camera webcam lab playground mirror fun",
        icon: ScanFace,
        run: go("/ascii-cam"),
      },
      {
        id: "act-email",
        group: "Actions",
        label: "Copy email address",
        keywords: `contact ${profile.email}`,
        icon: Copy,
        run: () => {
          navigator.clipboard.writeText(profile.email).then(
            () => toast.success("Email copied to clipboard"),
            () => toast.error(`Could not copy. Email: ${profile.email}`),
          );
        },
      },
      {
        id: "link-github",
        group: "Links",
        label: "GitHub",
        icon: ExternalLink,
        run: external(profile.socials.github),
      },
      {
        id: "link-linkedin",
        group: "Links",
        label: "LinkedIn",
        icon: ExternalLink,
        run: external(profile.socials.linkedin),
      },
      {
        id: "link-huggingface",
        group: "Links",
        label: "Hugging Face",
        icon: ExternalLink,
        run: external(profile.socials.huggingface),
      },
      ...projects.map((p) => ({
        id: `project-${slugify(p.name)}`,
        group: "Projects",
        label: p.name,
        keywords: p.tech.join(" "),
        icon: FolderGit2,
        run: go(`/projects#${slugify(p.name)}`),
      })),
      ...publications.map((p) => ({
        id: `paper-${slugify(p.title)}`,
        group: "Research",
        label: p.title,
        keywords: p.topics.join(" "),
        icon: GraduationCap,
        run: go("/research"),
      })),
    ];
  }, [router, resolvedTheme, setTheme]);

  const results = useMemo(() => {
    const tokens = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (tokens.length === 0) return commands;
    return commands.filter((command) => {
      const haystack =
        `${command.label} ${command.group} ${command.keywords ?? ""}`.toLowerCase();
      return tokens.every((token) => haystack.includes(token));
    });
  }, [commands, query]);

  const activeIndex = Math.min(active, Math.max(results.length - 1, 0));
  const activeCommand = results[activeIndex];

  // Keep the highlighted row in view while arrowing through the list.
  useEffect(() => {
    if (!open || !activeCommand) return;
    document
      .getElementById(activeCommand.id)
      ?.scrollIntoView({ block: "nearest" });
  }, [open, activeCommand]);

  const run = (command: Command) => {
    hide();
    command.run();
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (results.length) setActive((activeIndex + 1) % results.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        if (results.length) {
          setActive((activeIndex - 1 + results.length) % results.length);
        }
        break;
      case "Enter":
        event.preventDefault();
        if (activeCommand) run(activeCommand);
        break;
      case "Escape":
        event.preventDefault();
        hide();
        break;
      case "Tab":
        // The search box is the only focusable control; keep focus inside.
        event.preventDefault();
        break;
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/50 px-4 pt-[12vh] backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) hide();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls={LISTBOX_ID}
                aria-activedescendant={activeCommand?.id}
                aria-label="Search pages, projects and actions"
                placeholder="Search pages, projects, actions..."
                autoComplete="off"
                spellCheck={false}
                className="h-12 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground sm:text-sm"
              />
              <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
                Esc
              </kbd>
            </div>

            <div
              id={LISTBOX_ID}
              role="listbox"
              aria-label="Results"
              className="scrollbar-thin flex-1 overflow-y-auto p-2"
            >
              {results.length === 0 ? (
                <p className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Nothing matches &ldquo;{query}&rdquo;.
                </p>
              ) : (
                results.map((command, index) => {
                  const Icon = command.icon;
                  const selected = index === activeIndex;
                  const startsGroup =
                    index === 0 || results[index - 1].group !== command.group;
                  return (
                    <div key={command.id} role="presentation">
                      {startsGroup ? (
                        <p
                          role="presentation"
                          className="px-3 pt-3 pb-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase first:pt-1"
                        >
                          {command.group}
                        </p>
                      ) : null}
                      <div
                        id={command.id}
                        role="option"
                        aria-selected={selected}
                        onMouseMove={() => setActive(index)}
                        onClick={() => run(command)}
                        className={`flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm ${
                          selected
                            ? "bg-accent text-accent-foreground"
                            : "text-foreground"
                        }`}
                      >
                        <Icon
                          className={`size-4 shrink-0 ${
                            selected
                              ? "text-accent-foreground"
                              : "text-muted-foreground"
                          }`}
                        />
                        <span className="min-w-0 flex-1 truncate">
                          {command.label}
                        </span>
                        {selected ? (
                          <CornerDownLeft className="size-3.5 shrink-0 opacity-70" />
                        ) : null}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="hidden items-center justify-between border-t border-border px-4 py-2 text-[11px] text-muted-foreground sm:flex">
              <span>
                <kbd className="font-mono">↑↓</kbd> to move,{" "}
                <kbd className="font-mono">Enter</kbd> to select
              </span>
              <span>
                <kbd className="font-mono">{isMac ? "⌘K" : "Ctrl K"}</kbd> to
                toggle
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
