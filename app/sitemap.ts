import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { path: "", priority: 1 },
    { path: "/projects", priority: 0.9 },
    { path: "/research", priority: 0.9 },
    { path: "/resume", priority: 0.8 },
    { path: "/contact", priority: 0.5 },
  ].map(({ path, priority }) => ({
    url: `${siteUrl}${path}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
