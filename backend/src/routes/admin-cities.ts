import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize, requirePermission } from "../middleware/rbac";
import { logger } from "../lib/logger";
const router = Router();

router.post("/sync", authenticate, authorize("head"), requirePermission("canManageUsers"), async (_req: AuthRequest, res: Response) => {
  try {
    const setting = await prisma.siteSettings.findUnique({ where: { key: "available_cities" } });
    if (!setting || !setting.value) {
      return res.status(400).json({ error: "No available_cities setting found" });
    }

    const entries = setting.value.split(";").map(s => s.trim()).filter(Boolean);
    let created = 0;
    let updated = 0;

    for (const entry of entries) {
      const [name, statePart] = entry.split(",").map(s => s.trim());
      const state = statePart || "Kano";
      const existing = await prisma.city.findUnique({ where: { name_state: { name, state } } });
      if (existing) {
        updated++;
      } else {
        await prisma.city.create({ data: { name, state } });
        created++;
      }
    }

    res.json({ created, updated, total: entries.length });
  } catch (error) {
    logger.error({ err: error }, "Sync cities error:");
    res.status(500).json({ error: "Failed to sync cities" });
  }
});

router.get("/", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const cities = await prisma.city.findMany({ orderBy: { name: "asc" } });
    res.json({ cities });
  } catch (error) {
    logger.error({ err: error }, "List cities error:");
    res.status(500).json({ error: "Failed to fetch cities" });
  }
});

router.get("/users/:userId", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const userCities = await prisma.userCity.findMany({
      where: { userId: req.params.userId as string },
      include: { city: true },
    });
    res.json({ cityIds: userCities.map(uc => uc.cityId) });
  } catch (error) {
    logger.error({ err: error }, "Get user cities error:");
    res.status(500).json({ error: "Failed to fetch user cities" });
  }
});

router.put("/users/:userId", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.userId as string;
    const { cityIds } = req.body;
    if (!Array.isArray(cityIds)) {
      return res.status(400).json({ error: "cityIds array is required" });
    }

    await prisma.userCity.deleteMany({ where: { userId } });

    if (cityIds.length > 0) {
      await prisma.userCity.createMany({
        data: cityIds.map((cityId: string) => ({ userId, cityId })),
      });
    }

    // Also sync the single city field to the first city name
    if (cityIds.length > 0) {
      const firstCity = await prisma.city.findUnique({ where: { id: cityIds[0] } });
      if (firstCity) {
        await prisma.user.update({ where: { id: userId }, data: { city: firstCity.name } });
      }
    }

    res.json({ success: true, cityIds });
  } catch (error) {
    logger.error({ err: error }, "Update user cities error:");
    res.status(500).json({ error: "Failed to update user cities" });
  }
});

export default router;
