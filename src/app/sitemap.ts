import type { MetadataRoute } from "next";

const BASE = "https://mbpproperties.com";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/search", "/about", "/contact", "/news", "/help", "/sell", "/careers", "/research", "/zestimates", "/mobile-apps", "/fair-housing", "/terms", "/privacy", "/login", "/register"];

  const entries: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  try {
    const API = "https://propease-production.up.railway.app";
    const res = await fetch(`${API}/api/listings`, { signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      const data = await res.json();
      const listings: any[] = data.listings || [];
      listings.forEach((l) => {
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
