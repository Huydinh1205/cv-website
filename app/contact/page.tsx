import type { Metadata } from "next";
import { Contact } from "@/components/sections/Contact";
import { profile } from "@/data/profile";

export const metadata: Metadata = {
  title: `Contact — ${profile.name}`,
  description: `Get in touch with ${profile.name}.`,
};

export default function ContactPage() {
  return <Contact />;
}
