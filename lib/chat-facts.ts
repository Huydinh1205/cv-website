/**
 * Quick answers built straight from the site's data files. Used by the chat
 * API when the from-scratch transformer on Hugging Face Spaces is asleep or
 * unreachable, so a visitor still gets a correct answer instead of an error.
 * Nothing here is written by hand: every fact comes from `data/*.ts`.
 */

import { awards, certifications } from "@/data/credentials";
import { educations } from "@/data/education";
import { experiences } from "@/data/experience";
import { profile } from "@/data/profile";
import { projects } from "@/data/projects";
import { publications, researchInterests } from "@/data/research";
import { skillGroups } from "@/data/skills";

type Intent = { test: RegExp; answer: () => string };

const bullets = (items: string[]) => items.map((item) => `• ${item}`).join("\n");

const TOPICS =
  "projects, research, experience, education, skills, awards, or how to contact him";

const intents: Intent[] = [
  {
    test: /\b(cv|resume|résumé)\b/,
    answer: () =>
      "You can download Huy's CV with the CV button in the top bar, or read the full version on the Resume page.",
  },
  {
    test: /\b(contact|email|e-mail|reach|hire|hiring|linkedin|github)\b|liên hệ/,
    answer: () =>
      [
        `Email: ${profile.email}`,
        `LinkedIn: ${profile.socials.linkedin}`,
        `GitHub: ${profile.socials.github}`,
        "Or use the form on the Contact page.",
      ].join("\n"),
  },
  {
    test: /\b(available|availability|open to|looking for|opportunit\w*)\b/,
    answer: () => profile.lookingFor,
  },
  {
    test: /\b(research|papers?|publications?|publish\w*|phd|vlm)\b|nghiên cứu/,
    answer: () =>
      [
        "Research interests:",
        bullets(researchInterests.slice(0, 2)),
        "",
        "Papers in progress:",
        bullets(publications.slice(0, 2).map((p) => `${p.title}, ${p.venue}`)),
        "",
        "More on the Research page.",
      ].join("\n"),
  },
  {
    test: /\b(projects?|built|build|portfolio|demo)\b|dự án/,
    answer: () => {
      const featured = projects.filter((p) => p.featured).slice(0, 5);
      return [
        `Huy has ${projects.length} projects on this site. Some featured ones:`,
        bullets(featured.map((p) => p.name)),
        "Details are on the Projects page.",
      ].join("\n");
    },
  },
  {
    test: /\b(experience|work\w*|jobs?|intern\w*|company|role|csiro)\b|kinh nghiệm|làm việc/,
    answer: () =>
      bullets(experiences.map((e) => `${e.role} at ${e.company}, ${e.period}`)),
  },
  {
    test: /\b(education|stud(y|ies|ying|ent)|university|uni|degree|school|uts|gpa)\b|đại học|trường/,
    answer: () =>
      bullets(
        educations
          .slice(0, 2)
          .map((e) => `${e.degree} in ${e.field}, ${e.school} (${e.period})`),
      ),
  },
  {
    test: /\b(skills?|tech|stack|languages?|frameworks?|tools?|python|pytorch)\b|kỹ năng/,
    answer: () =>
      skillGroups
        .slice(0, 3)
        .map((g) => `${g.category}: ${g.items.join(", ")}`)
        .join("\n"),
  },
  {
    test: /\b(awards?|certificates?|certifications?|achievements?|prizes?)\b/,
    answer: () =>
      bullets([
        ...awards.map((a) => `${a.title}, ${a.organisation} (${a.year})`),
        ...certifications.map((c) => `${c.title}, ${c.issuer} (${c.year})`),
      ]),
  },
  {
    test: /\b(where|location|based|lives?|city|country)\b/,
    answer: () => `Huy is based in ${profile.location}.`,
  },
  {
    test: /^(hi|hello|hey|yo|xin chào|chào)\b/,
    answer: () => `Hi! I can tell you about Huy's ${TOPICS}.`,
  },
  {
    test: /\b(who|about|yourself|introduce|bio)\b/,
    answer: () => profile.bio,
  },
];

export function answerFromFacts(message: string): string {
  const text = message.toLowerCase().trim();
  const match = intents.find((intent) => intent.test.test(text));
  if (match) return match.answer();
  return `I couldn't match that to something I know for sure. Try asking about Huy's ${TOPICS}.`;
}
