import type { MetadataRoute } from "next";

const BASE = "https://mbpproperties.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["/", "/about", "/contact", "/news", "/help", "/list-property", "/sell", "/careers", "/research", "/zestimates", "/mobile-apps", "/fair-housing", "/terms", "/privacy", "/login", "/register"];

  const entries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "/" ? 1 : 0.7,
  }));

  try {
    const API = process.env.NEXT_PUBLIC_API_URL || "https://propease-production.up.railway.app";
    const res = await fetch(`${API}/api/listings`);
    if (res.ok) {
      const data = await res.json();
      const listings = data.listings || [];
      listings.forEach((l: any) => {
        entries.push({
          url: `${BASE}/listings/${l.id}`,
          lastModified: new Date(l.updatedAt || Date.now()),
          changeFrequency: "daily" as const,
          priority: 0.9,
        });
      });
    }
  } catch {}

  return entries;
}
