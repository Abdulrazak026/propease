import { Router, Response } from "express";
import prisma from "../lib/prisma";

const router = Router();

const PUBLIC_KEYS = [
  "site_name", "site_tagline", "support_email", "support_phone", "support_whatsapp",
  "office_address", "business_hours", "primary_color", "secondary_color", "accent_color",
  "heading_font", "body_font", "hero_image", "meta_title", "meta_description",
  "og_image", "ga_id", "gtm_id", "fb_pixel", "robots_txt",
  "terms_of_service", "privacy_policy", "cookie_text",
  "measurement", "currency", "currency_pos", "property_statuses", "property_types", "amenities",
  "agent_dir_visible", "maintenance_mode",
  "facebook_url", "instagram_url", "linkedin_url", "youtube_url", "twitter_url",
];

router.get("/", async (_req, res: Response) => {
  try {
    const rows = await prisma.siteSettings.findMany();
    const map: Record<string, string> = {};
    for (const r of rows) {
      if (PUBLIC_KEYS.includes(r.key)) map[r.key] = r.value;
    }
    res.json({ settings: map });
  } catch {
    res.json({ settings: {} });
  }
});

export default router;
