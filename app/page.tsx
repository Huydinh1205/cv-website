import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { ExperiencePreview } from "@/components/sections/ExperiencePreview";
import { QuickNav } from "@/components/sections/QuickNav";

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
