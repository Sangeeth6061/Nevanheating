"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ServicesHashScroller() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      if (pathname !== "/services") return;

      const hash = window.location.hash.slice(1);
      if (!hash) return;

      const target = document.getElementById(hash);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    scrollToHash();
    const timeoutId = window.setTimeout(scrollToHash, 150);
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [pathname]);

  return null;
}
