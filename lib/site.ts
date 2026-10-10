/** Canonical production URL, used for metadata, the sitemap and robots.txt. */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://dinhquochuy.vercel.app"
).replace(/\/$/, "");
