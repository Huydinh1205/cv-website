import { Research } from "@/components/sections/Research";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: `Research | ${profile.name}`,
  description: `Publications, preprints, and research interests of ${profile.name}.`,
  path: "/research",
});

export default function ResearchPage() {
  return <Research />;
}
