"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { mascotReact } from "@/lib/mascot";
import { transitionTheme } from "@/lib/theme-transition";

const subscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  // The theme is only known on the client; render a placeholder on the server.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <div className="size-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={() => {
        const next = isDark ? "light" : "dark";
        transitionTheme(next, () => setTheme(next));
        mascotReact("surprised", 700);
      }}
      className="inline-flex size-9 items-center justify-center rounded-md border border-border bg-card text-foreground transition hover:bg-muted"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
