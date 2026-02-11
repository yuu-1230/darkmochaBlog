import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/images/**" }],
    deviceSizes: [640, 768, 1024, 1280, 1536, 1920, 2560],
  },
};

export default nextConfig;
