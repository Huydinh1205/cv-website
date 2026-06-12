import type { Metadata } from "next";
import { Research } from "@/components/sections/Research";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Research — ${profile.name}`,
  description: `Publications, preprints, and research interests of ${profile.name}.`,
};

export default function ResearchPage() {
  return <Research />;
}
