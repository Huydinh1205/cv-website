import { AsciiCam } from "@/components/lab/AsciiCam";
import { profile } from "@/data/profile";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: `ASCII Cam | ${profile.name}`,
  description:
    "Turn your webcam feed into live ASCII art. Person segmentation runs in the browser, so only you become characters.",
  path: "/ascii-cam",
});

export default function AsciiCamPage() {
  return <AsciiCam />;
}
