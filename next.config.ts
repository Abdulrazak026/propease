import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app",
  },
  productionBrowserSourceMaps: false,
  // cache-buster: 2026-06-05T18:00
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon).*)",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.paystack.com https://*.googleapis.com http://localhost:4000 https://*.up.railway.app https://*.railway.app",
              "frame-src 'self' https://*.paystack.com",
              "media-src 'self' https://*.r2.cloudflarestorage.com",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
