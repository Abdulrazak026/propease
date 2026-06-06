import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin/", "/agent/", "/ambassador/", "/api/"] },
    sitemap: "https://mbpproperties.com/sitemap.xml",
  };
}
