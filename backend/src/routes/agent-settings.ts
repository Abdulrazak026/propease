import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { logger } from "../lib/logger";

const router = Router();

// Get agent/ambassador profile settings
router.get("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { id: true, name: true, whatsapp: true, city: true },
    });
    if (!user) return res.status(404).json({ error: "User not found" });

    const prefs = await prisma.siteSettings.findMany({
      where: { key: { startsWith: `pref_${req.user!.id}_` } },
    });
    const preferences: Record<string, boolean> = {};
    for (const p of prefs) {
      preferences[p.key.replace(`pref_${req.user!.id}_`, "")] = p.value === "true";
    }

    res.json({ profile: user, preferences });
  } catch { res.status(500).json({ error: "Failed to fetch settings" }); }
});

// Update agent/ambassador profile
router.patch("/me", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { name, whatsapp, city } = req.body;
    const data: Record<string, unknown> = {};
    if (name) data.name = name;
    if (whatsapp !== undefined) data.whatsapp = whatsapp;
    if (city) data.city = city;

    const user = await prisma.user.update({
      where: { id: req.user!.id },
      data,
      select: { id: true, name: true, whatsapp: true, city: true },
    });

    res.json({ profile: user });
  } catch (error) {
    logger.error({ err: error }, "Agent profile update error:");
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Update notification preferences
router.patch("/me/notifications", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { notifyNewTasks, notifyInquiries, notifyCommissions, taskAutoAssign } = req.body;

    const prefs: Record<string, string> = {};
    if (notifyNewTasks !== undefined) prefs[`pref_${req.user!.id}_notifyNewTasks`] = String(notifyNewTasks);
    if (notifyInquiries !== undefined) prefs[`pref_${req.user!.id}_notifyInquiries`] = String(notifyInquiries);
    if (notifyCommissions !== undefined) prefs[`pref_${req.user!.id}_notifyCommissions`] = String(notifyCommissions);
    if (taskAutoAssign !== undefined) prefs[`pref_${req.user!.id}_taskAutoAssign`] = String(taskAutoAssign);

    for (const [key, value] of Object.entries(prefs)) {
      await prisma.siteSettings.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      });
    }

    res.json({ success: true, preferences: prefs });
  } catch (error) {
    logger.error({ err: error }, "Notification prefs error:");
    res.status(500).json({ error: "Failed to save preferences" });
  }
});

export default router;
