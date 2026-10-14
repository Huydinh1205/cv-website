/**
 * The fake shell behind the hidden terminal (press ` on any page). Every
 * answer is built from the same `data/*.ts` files as the rest of the site.
 */

import { awards, certifications } from "@/data/credentials";
import { educations } from "@/data/education";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { publications, researchInterests, researchStatement } from "@/data/research";
import { skillGroups } from "@/data/skills";
import { MASCOT_REACTIONS, type MascotReaction } from "./mascot";
import { slugify } from "./utils";

export type ShellContext = {
  pathname: string;
  theme: "light" | "dark";
  navigate: (href: string) => void;
  openExternal: (url: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  openChat: () => void;
  mascot: (reaction: MascotReaction) => void;
  downloadCv: () => void;
};

export type ShellResult = {
  lines: string[];
  clear?: boolean;
  close?: boolean;
};

const HELP = [
  "help              this list",
  "ls [dir]          list projects, research, resume, skills",
  "cat <file>        about.md, research.md, resume.md, projects/<slug>",
  "cd <path>         go to /, /projects, /research, /resume, /contact",
  "open <target>     github, linkedin, hf, or a project slug",
  "cv                download the CV",
  "contact           how to reach Huy",
  "whoami            who you are, and who he is",
  "theme [dark|light] switch theme",
  "chat              open the chatbot",
  "ascii-cam         turn yourself into ASCII (camera)",
  "mascot <reaction> make the mascot react",
  "clear, exit       tidy up, close",
];

const ROUTES = ["/", "/projects", "/research", "/resume", "/contact", "/ascii-cam"];

const bullet = (items: string[]) => items.map((item) => `  - ${item}`);

function projectBySlug(slug: string) {
  const wanted = slugify(slug);
  return projects.find(
    (p) => slugify(p.name) === wanted || slugify(p.name).startsWith(wanted),
  );
}

function ls(dir: string | undefined): string[] {
  switch ((dir ?? "").replace(/^\/|\/$/g, "")) {
    case "":
    case "~":
      return [
        "about.md     cv.pdf       research.md  resume.md",
        "projects/    research/    resume/      skills/",
      ];
    case "projects":
      return projects.map(
        (p) =>
          `${slugify(p.name).padEnd(44)} ${p.categories.join(",")}${
            p.status ? "  (in progress)" : ""
          }`,
      );
    case "research":
      return publications.map((p) => `[${p.status}] ${p.title}`);
    case "resume":
      return experiences.map((e) => `${e.period.padEnd(28)} ${e.role}, ${e.company}`);
    case "skills":
      return skillGroups.map((g) => `${g.category}: ${g.items.join(", ")}`);
    default:
      return [`ls: cannot access '${dir}': No such file or directory`];
  }
}

function cat(file: string | undefined): string[] {
  const name = (file ?? "").replace(/^\/|\/$/g, "");
  if (!name) return ["cat: missing file. Try: cat about.md"];
  if (name === "about.md") {
    return [
      `# ${profile.name} (${profile.nickname})`,
      profile.title,
      "",
      profile.bio,
      "",
      `Location: ${profile.location}`,
      `Email: ${profile.email}`,
    ];
  }
  if (name === "research.md") {
    return [
      "# Research",
      researchStatement,
      "",
      "## Interests",
      ...bullet(researchInterests),
      "",
      "## Papers",
      ...bullet(publications.map((p) => `${p.title} [${p.venue}, ${p.status}]`)),
    ];
  }
  if (name === "resume.md") {
    return [
      "# Experience",
      ...experiences.flatMap((e) => [
        `${e.role}, ${e.company} (${e.period})`,
        ...bullet(e.highlights),
      ]),
      "",
      "# Education",
      ...bullet(educations.map((e) => `${e.degree} in ${e.field}, ${e.school} (${e.period})`)),
      "",
      "# Awards & certifications",
      ...bullet([
        ...awards.map((a) => `${a.title}, ${a.organisation} (${a.year})`),
        ...certifications.map((c) => `${c.title}, ${c.issuer} (${c.year})`),
      ]),
    ];
  }
  if (name === "cv.pdf") {
    return ["cat: cv.pdf is a binary file. Run `cv` to download it."];
  }
  if (name.startsWith("projects/")) {
    const project = projectBySlug(name.slice("projects/".length));
    if (!project) return [`cat: ${name}: No such file or directory`];
    const links = [
      ...(project.links.demo ? [`demo: ${project.links.demo}`] : []),
      ...(Array.isArray(project.links.github)
        ? project.links.github.map((g) => `github: ${g}`)
        : project.links.github
          ? [`github: ${project.links.github}`]
          : []),
    ];
    return [
      `# ${project.name}`,
      project.description,
      "",
      `Tech: ${project.tech.join(", ")}`,
      ...(project.metrics?.length ? ["", ...bullet(project.metrics)] : []),
      ...(links.length ? ["", ...links] : ["", "(no public links)"]),
    ];
  }
  return [`cat: ${name}: No such file or directory`];
}

export function runCommand(input: string, ctx: ShellContext): ShellResult {
  const [command = "", ...args] = input.trim().split(/\s+/);
  const arg = args[0];

  switch (command.toLowerCase()) {
    case "":
      return { lines: [] };
    case "help":
    case "?":
      return { lines: HELP };
    case "ls":
    case "dir":
      return { lines: ls(arg) };
    case "cat":
    case "less":
    case "more":
      return { lines: cat(arg) };
    case "ascii-cam":
    case "asciicam":
    case "camera":
      ctx.navigate("/ascii-cam");
      return { lines: ["-> /ascii-cam  (say cheese)"], close: true };
    case "pwd":
      return { lines: [ctx.pathname] };
    case "cd": {
      const target = !arg || arg === "~" ? "/" : arg.startsWith("/") ? arg : `/${arg}`;
      if (!ROUTES.includes(target)) {
        return { lines: [`cd: no such route: ${target}`, `Routes: ${ROUTES.join(" ")}`] };
      }
      ctx.navigate(target);
      return { lines: [`-> ${target}`], close: true };
    }
    case "open": {
      if (!arg) return { lines: ["open: what? github, linkedin, hf, or a project slug"] };
      const known: Record<string, string> = {
        github: profile.socials.github,
        linkedin: profile.socials.linkedin,
        hf: profile.socials.huggingface,
        huggingface: profile.socials.huggingface,
      };
      if (known[arg.toLowerCase()]) {
        ctx.openExternal(known[arg.toLowerCase()]);
        return { lines: [`Opening ${known[arg.toLowerCase()]}`] };
      }
      const project = projectBySlug(arg);
      if (!project) return { lines: [`open: nothing called '${arg}'. Try: ls projects`] };
      ctx.navigate(`/projects#${slugify(project.name)}`);
      return { lines: [`-> /projects#${slugify(project.name)}`], close: true };
    }
    case "cv":
    case "resume":
      ctx.downloadCv();
      return { lines: ["Downloading the CV..."] };
    case "contact":
    case "email":
      return {
        lines: [
          `email:    ${profile.email}`,
          `linkedin: ${profile.socials.linkedin}`,
          `github:   ${profile.socials.github}`,
          "or: cd /contact",
        ],
      };
    case "whoami":
      return {
        lines: [
          "visitor",
          `This site belongs to ${profile.name} (${profile.nickname}), ${profile.title}.`,
          profile.lookingFor,
        ],
      };
    case "theme": {
      const next =
        arg === "dark" || arg === "light" ? arg : ctx.theme === "dark" ? "light" : "dark";
      ctx.setTheme(next);
      return { lines: [`Theme: ${next}`] };
    }
    case "chat":
      ctx.openChat();
      return { lines: ["Opening the chatbot..."], close: true };
    case "mascot": {
      const reaction = MASCOT_REACTIONS.find((r) => r === arg);
      if (!reaction) {
        return { lines: [`mascot: pick one of ${MASCOT_REACTIONS.join(", ")}`] };
      }
      ctx.mascot(reaction);
      return { lines: [`*${reaction}*`] };
    }
    case "echo":
      return { lines: [args.join(" ")] };
    case "date":
      return { lines: [new Date().toString()] };
    case "clear":
    case "cls":
      return { lines: [], clear: true };
    case "exit":
    case "quit":
    case "q":
      return { lines: [], close: true };
    case "sudo":
      return { lines: ["Nice try. Huy's laptop stays Huy's."] };
    case "rm":
      return { lines: ["rm: this portfolio is read-only, and so is my patience."] };
    case "vim":
    case "nano":
    case "emacs":
      return { lines: [`${command}: no editor here, but the source is on GitHub.`] };
    default:
      return { lines: [`${command}: command not found. Type help.`] };
  }
}
