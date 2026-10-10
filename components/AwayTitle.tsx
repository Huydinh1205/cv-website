"use client";

import { useEffect } from "react";

const AWAY_TITLE = "Huy is waiting 👀";
const SLEEPY_ICON = "/mascots/huy-sleepy.png";

/**
 * When the visitor switches to another tab, the tab title changes and the
 * favicon becomes the sleepy mascot. Both come back when they return.
 */
export function AwayTitle() {
  useEffect(() => {
    let title = document.title;
    let icons: { link: HTMLLinkElement; href: string }[] = [];

    const restore = () => {
      if (document.title === AWAY_TITLE) document.title = title;
      icons.forEach(({ link, href }) => {
        link.href = href;
      });
      icons = [];
    };

    const onVisibility = () => {
      if (!document.hidden) {
        restore();
        return;
      }
      title = document.title;
      icons = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]'),
      ).map((link) => ({ link, href: link.href }));
      document.title = AWAY_TITLE;
      icons.forEach(({ link }) => {
        link.href = SLEEPY_ICON;
      });
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      restore();
    };
  }, []);

  return null;
}
