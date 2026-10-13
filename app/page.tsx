import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ExperiencePreview } from "@/components/sections/ExperiencePreview";
import { QuickNav } from "@/components/sections/QuickNav";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: `${profile.name} | ${profile.title}`,
  description: profile.tagline,
  path: "/",
});

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <ExperiencePreview />
      <QuickNav />
    </>
  );
}
