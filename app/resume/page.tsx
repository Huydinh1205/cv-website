import type { Metadata } from "next";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Resume — ${profile.name}`,
  description: `Experience, education, and skills of ${profile.name}.`,
};

export default function ResumePage() {
  return (
    <>
      <Experience />
      <Education />
      <Skills />
    </>
  );
}
