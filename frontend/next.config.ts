// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow images served by Drupal (JSON:API file URLs)
    remotePatterns: [
      {
        protocol: "http",
        hostname: "portfolio.lndo.site",
        pathname: "/sites/**",
      },
    ],
  },
};

export default nextConfig;
