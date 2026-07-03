import type { NextConfig } from "next";

const wpHostname = (() => {
  const url = process.env.NEXT_PUBLIC_WORDPRESS_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  images: wpHostname
    ? {
        remotePatterns: [
          {
            protocol: "http",
            hostname: wpHostname,
            pathname: "/wp-content/uploads/**",
          },
          {
            protocol: "https",
            hostname: wpHostname,
            pathname: "/wp-content/uploads/**",
          },
        ],
      }
    : undefined,
};

export default nextConfig;
