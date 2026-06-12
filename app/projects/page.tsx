import type { Metadata } from "next";
import { Projects } from "@/components/sections/Projects";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Projects — ${profile.name}`,
  description: `Selected projects by ${profile.name}.`,
};

export default function ProjectsPage() {
  return <Projects />;
}
