import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";
import { siteUrl } from "@/lib/site";

// The preview card shown when a link to the site is shared (LinkedIn, Slack,
// Messenger...). Generated once at build time from the profile data.

export const alt = `${profile.name}, ${profile.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Deep Ocean palette, matching the site's dark theme in globals.css.
const colors = {
  background: "#0B1220",
  card: "#0F172A",
  border: "#334155",
  foreground: "#F1F5F9",
  muted: "#94A3B8",
  accent: "#38BDF8",
};

export default async function Image() {
  const face = await readFile(
    join(process.cwd(), "public/mascots/huy-face.png"),
  );
  const faceSrc = `data:image/png;base64,${face.toString("base64")}`;
  // First clause of the tagline, so the card stays short enough to read.
  const summary = profile.tagline.split(" — ")[0];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: `linear-gradient(135deg, ${colors.background} 0%, ${colors.card} 60%, #10263F 100%)`,
          color: colors.foreground,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            maxWidth: 700,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 26,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: colors.accent,
            }}
          >
            Portfolio
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 84,
                fontWeight: 700,
                lineHeight: 1.05,
                letterSpacing: -2,
              }}
            >
              {profile.name}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 18,
                fontSize: 40,
                color: colors.accent,
              }}
            >
              {profile.title}
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 26,
                fontSize: 28,
                lineHeight: 1.4,
                color: colors.muted,
              }}
            >
              {summary}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 26, color: colors.muted }}>
            {siteUrl.replace(/^https?:\/\//, "")}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 340,
            height: 340,
            borderRadius: 48,
            background: colors.accent,
            boxShadow: "0 30px 80px rgba(56, 189, 248, 0.25)",
          }}
        >
          <img src={faceSrc} alt="" width={320} height={320} />
        </div>
      </div>
    ),
    size,
  );
}
