import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/dashboard", authenticate, authorize("ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const userCities = await prisma.userCity.findMany({
      where: { userId: req.user!.id },
      include: { city: true },
    });
    const cityNames = userCities.map((uc) => uc.city.name);

    const activeListings = await prisma.listing.count({
      where: { city: { in: cityNames }, status: { not: "taken" } },
    });
    const totalListings = await prisma.listing.count({
      where: { city: { in: cityNames } },
    });
    const agentsUnder = await prisma.user.count({
      where: { ambassadorId: req.user!.id },
    });
    const openTasks = await prisma.task.count({
      where: { area: { in: cityNames }, status: { in: ["open", "in_progress"] } },
    });

    res.json({
      stats: { activeListings, totalListings, agentsUnder, openTasks },
      cities: cityNames,
    });
  } catch (error) {
    console.error("Ambassador dashboard error:", error);
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

router.get("/agents", authenticate, authorize("ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const agents = await prisma.user.findMany({
      where: { ambassadorId: req.user!.id },
      select: {
        id: true, name: true, email: true, city: true, walletBalance: true,
        canCloseDeals: true, createdAt: true,
        _count: { select: { assignedListings: true, assignedTasks: true } },
      },
      orderBy: { name: "asc" },
    });

    res.json({ agents });
  } catch (error) {
    console.error("List agents error:", error);
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

router.get("/city-listings", authenticate, authorize("ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const userCities = await prisma.userCity.findMany({
      where: { userId: req.user!.id },
      include: { city: true },
    });
    const cityNames = userCities.map((uc) => uc.city.name);

    const listings = await prisma.listing.findMany({
      where: { city: { in: cityNames } },
      include: {
        photos: { take: 1 },
        assignedAgent: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ listings });
  } catch (error) {
    console.error("City listings error:", error);
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;
