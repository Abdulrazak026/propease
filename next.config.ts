import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app",
  },
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.up.railway.app" },
    ],
  },
  productionBrowserSourceMaps: false,
  // cache-buster: 2026-06-05T18:00
  async headers() {
    return [
      {
        source: "/((?!_next/static|_next/image|favicon).*)",
        headers: [
          { key: "Cache-Control", value: "no-cache" },
          { key: "CDN-Cache-Control", value: "no-cache" },
        ],
      },
      {
        source: "/:path(about|contact|help|careers|list-property|sell|research|mobile-apps|fair-housing|privacy|terms|disclaimer)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=3600" },
          { key: "CDN-Cache-Control", value: "public, s-maxage=3600" },
        ],
      },
      {
        source: "/news",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=3600" },
          { key: "CDN-Cache-Control", value: "public, s-maxage=3600" },
        ],
      },
      {
        source: "/news/:slug",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=3600" },
          { key: "CDN-Cache-Control", value: "public, s-maxage=3600" },
        ],
      },
      {
        source: "/sold",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=300" },
          { key: "CDN-Cache-Control", value: "public, s-maxage=300" },
        ],
      },
      {
        source: "/listings/:id",
        headers: [
          { key: "Cache-Control", value: "public, max-age=60, s-maxage=120" },
          { key: "CDN-Cache-Control", value: "public, s-maxage=120" },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://static.cloudflareinsights.com",
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
