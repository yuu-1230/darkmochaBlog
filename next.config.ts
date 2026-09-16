import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const imageBaseUrl = new URL(
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ?? "https://images.darkmocha.dev",
);

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/images/**" }],
    remotePatterns: [
      {
        protocol: imageBaseUrl.protocol.replace(":", "") as "https",
        hostname: imageBaseUrl.hostname,
        port: imageBaseUrl.port,
        pathname: "/images/**",
        search: "",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 768, 1080, 1280],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
