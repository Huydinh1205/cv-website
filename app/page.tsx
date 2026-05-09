import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Experience } from "@/components/sections/Experience";
import { Education } from "@/components/sections/Education";
import { Skills } from "@/components/sections/Skills";
import { Projects } from "@/components/sections/Projects";
import { Contact } from "@/components/sections/Contact";
import { ChatWidget } from "@/components/chatbot/ChatWidget";
import { profile } from "@/data/profile";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Experience />
        <Education />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <footer className="border-t border-border py-8 text-center text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} {profile.name}. Built with Next.js, Tailwind, and a custom-trained transformer.
        </p>
      </footer>
      <ChatWidget />
    </>
  );
}
