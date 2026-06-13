import type { Metadata } from "next";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Credentials } from "@/components/sections/Credentials";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Resume — ${profile.name}`,
  description: `Experience, education, skills, certifications, and awards of ${profile.name}.`,
};

export default function ResumePage() {
  return (
    <>
      <Experience />
      <Education />
      <Skills />
      <Credentials />
    </>
  );
}
