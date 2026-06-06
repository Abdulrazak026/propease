import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { invalidate } from "../lib/cache";

const router = Router();

router.get("/", authenticate, authorize("head"), async (_req, res: Response) => {
  try {
    const settings = await prisma.siteSettings.findMany();
    const map: Record<string, string> = {};
    for (const s of settings) {
      map[s.key] = s.value;
    }
    res.json({ settings: map });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.put("/", authenticate, authorize("head"), async (req, res: Response) => {
  try {
    const { settings } = req.body as { settings: Record<string, string> };
    for (const [key, value] of Object.entries(settings)) {
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }
    invalidate("settings:public");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
