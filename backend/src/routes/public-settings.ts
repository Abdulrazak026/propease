import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { cached } from "../lib/cache";

const router = Router();

const PUBLIC_KEYS = [
  "site_name", "site_tagline", "support_email", "support_phone", "support_whatsapp",
  "office_address", "business_hours", "primary_color", "secondary_color", "accent_color",
  "heading_font", "body_font", "hero_image", "meta_title", "meta_description",
  "og_image", "ga_id", "gtm_id", "fb_pixel", "robots_txt",
  "terms_of_service", "privacy_policy", "cookie_text",
  "measurement", "currency", "currency_pos", "property_statuses", "property_types", "amenities",
  "agent_dir_visible", "maintenance_mode",
  "facebook_url", "instagram_url", "linkedin_url", "youtube_url", "twitter_url", "tiktok_url",
  "site_logo", "site_favicon",
  "available_cities", "about_hero_image",
  "team_members", "research_reports",
  "seo_canonical_url", "seo_geo_region", "seo_geo_placename", "seo_geo_position", "seo_icbm",
  "seo_content_language", "seo_robots", "seo_og_locale",
  "seo_schema_phone", "seo_schema_email", "seo_schema_street", "seo_schema_city",
  "seo_schema_state", "seo_schema_country", "seo_schema_lat", "seo_schema_lng",
  "seo_schema_opening_days", "seo_schema_open_time", "seo_schema_close_time",
  "seo_schema_area_served", "seo_schema_same_as", "seo_schema_description",
  "seo_property_schema_enabled",
];

router.get("/", async (_req, res: Response) => {
  try {
    const map = await cached("settings:public", 300, async () => {
      const rows = await prisma.siteSettings.findMany();
      const m: Record<string, string> = {};
      for (const r of rows) {
        if (PUBLIC_KEYS.includes(r.key)) m[r.key] = r.value;
      }
      return m;
    });
    res.json({ settings: map });
  } catch {
    res.json({ settings: {} });
  }
});

export default router;

