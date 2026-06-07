import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", async (req, res: Response) => {
  try {
    const { limit, offset, city } = req.query;
    const where: any = {};
    if (city) where.city = city;
    const take = Math.min(parseInt(limit as string) || 12, 50);
    const skip = parseInt(offset as string) || 0;

    const [items, total] = await Promise.all([
      prisma.soldProperty.findMany({
        where,
        take,
        skip,
        orderBy: { soldAt: "desc" },
      }),
      prisma.soldProperty.count({ where }),
    ]);

    res.json({ items, total, limit: take, offset: skip });
  } catch (error) {
    logger.error({ err: error }, "List sold properties error:");
    res.status(500).json({ error: "Failed to fetch sold properties" });
  }
});

router.post("/", authenticate, authorize("head", "ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const data = req.body;
    if (!data.title || !data.city || !data.salePrice) {
      return res.status(400).json({ error: "title, city and salePrice are required" });
    }
    let agentName: string | null = null;
    if (req.user?.id) {
      const u = await prisma.user.findUnique({ where: { id: req.user.id }, select: { name: true } });
      agentName = u?.name || null;
    }
    const created = await prisma.soldProperty.create({
      data: {
        title: data.title,
        city: data.city,
        salePrice: parseInt(data.salePrice),
        coverPhoto: data.coverPhoto,
        listingId: data.listingId,
        agentId: req.user!.id,
        agentName,
        soldAt: data.soldAt ? new Date(data.soldAt) : new Date(),
      },
    });
    res.status(201).json({ item: created });
  } catch (error) {
    logger.error({ err: error }, "Create sold property error:");
    res.status(500).json({ error: "Failed to create sold property" });
  }
});

router.delete("/:id", authenticate, authorize("head", "ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.soldProperty.delete({ where: { id: req.params.id as string } });
    res.json({ message: "Deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete sold property error:");
    res.status(500).json({ error: "Failed to delete" });
  }
});

export default router;
