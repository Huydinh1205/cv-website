import { Projects } from "@/components/sections/Projects";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: `Projects — ${profile.name}`,
  description: `Selected projects by ${profile.name}.`,
  path: "/projects",
});

export default function ProjectsPage() {
  return <Projects />;
}
