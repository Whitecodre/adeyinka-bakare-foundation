import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // This helps with path resolution
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
