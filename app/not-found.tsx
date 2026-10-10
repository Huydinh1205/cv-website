import Link from "next/link";
import { Bubbles } from "@/components/Bubbles";
import { MascotFace } from "@/components/mascot/MascotFace";

const routes = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/resume", label: "Resume" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-4 py-20 text-center sm:px-6 sm:py-28">
      <div className="bubbles-live relative mb-6 flex size-48 items-center justify-center rounded-full bg-accent/10">
        <Bubbles />
        <MascotFace reaction="dizzy" size={150} className="relative" />
      </div>
      <p className="font-mono text-sm text-accent">404 · lost at sea</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
        This page drifted away
      </h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        Nothing lives at this address. The current only runs through these
        routes:
      </p>
      <ul className="mt-6 flex flex-wrap justify-center gap-2">
        {routes.map((route) => (
          <li key={route.href}>
            <Link
              href={route.href}
              className="inline-flex rounded-md border border-border bg-card px-4 py-2 text-sm transition hover:border-accent/50 hover:text-accent"
            >
              {route.label}
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-10 font-mono text-xs text-muted-foreground">
        or press <kbd className="rounded border border-border px-1.5 py-0.5">`</kbd> and run{" "}
        <code className="text-foreground">cd /</code>
      </p>
    </section>
  );
}
