import { Contact } from "@/components/sections/Contact";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: `Contact — ${profile.name}`,
  description: `Get in touch with ${profile.name}.`,
  path: "/contact",
});

export default function ContactPage() {
  return <Contact />;
}
