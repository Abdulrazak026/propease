import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  },
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.paystack.com https://*.googleapis.com http://localhost:4000 https://backend.railway.app",
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
