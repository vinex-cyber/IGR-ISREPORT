import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    agentUpgrade: "security",
  },
  images: {
    qualities: [75, 100],
  },
};

export default nextConfig;
