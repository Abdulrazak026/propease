import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "https://mbpproperties.com",
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "mbpproperties.com" },
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
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://*.paystack.com https://*.googleapis.com https://mbpproperties.com https://*.google-analytics.com https://www.googletagmanager.com https://*.cloudflareinsights.com",
              "frame-src 'self' https://*.paystack.com",
              "media-src 'self' https://mbpproperties.com",
              "worker-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
    ];
  },
};

export default nextConfig;
