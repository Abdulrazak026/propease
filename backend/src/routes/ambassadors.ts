import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";
const router = Router();

router.get("/dashboard", authenticate, authorize("ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const userCities = await prisma.userCity.findMany({
      where: { userId: uid },
      include: { city: true },
    });
    const cityNames = userCities.map((uc) => uc.city.name);

    const [activeListings, totalListings, agentsUnder, openTasks, totalEarned, thisMonthEarned, lastMonthEarned, recentCommissions, inquiryStats, agentPerf] =
      await Promise.all([
        prisma.listing.count({ where: { city: { in: cityNames }, status: { notIn: ["sold", "rented"] } } }),
        prisma.listing.count({ where: { city: { in: cityNames } } }),
        prisma.user.count({ where: { ambassadorId: uid } }),
        prisma.task.count({ where: { area: { in: cityNames }, status: { in: ["open", "in_progress"] } } }),
        prisma.commission.aggregate({ where: { ambassadorId: uid }, _sum: { ambassadorCut: true } }),
        prisma.commission.aggregate({ where: { ambassadorId: uid, paidAt: { gte: startOfMonth } }, _sum: { ambassadorCut: true } }),
        prisma.commission.aggregate({ where: { ambassadorId: uid, paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { ambassadorCut: true } }),
        prisma.commission.findMany({ where: { ambassadorId: uid }, orderBy: { paidAt: "desc" }, take: 5 }),
        prisma.inquiry.groupBy({ by: ["status"], where: { listing: { city: { in: cityNames } } }, _count: { id: true } }),
        prisma.user.findMany({
          where: { ambassadorId: uid },
          select: {
            id: true, name: true,
            _count: { select: { assignedListings: true } },
          },
          orderBy: { name: "asc" },
        }),
      ]);

    const inqStats: Record<string, number> = { new: 0, read: 0, responded: 0 };
    for (const s of inquiryStats) inqStats[s.status] = s._count.id;

    res.json({
      stats: { activeListings, totalListings, agentsUnder, openTasks },
      cities: cityNames,
      earnings: {
        totalEarned: totalEarned._sum.ambassadorCut || 0,
        thisMonth: thisMonthEarned._sum.ambassadorCut || 0,
        lastMonth: lastMonthEarned._sum.ambassadorCut || 0,
      },
      recentCommissions: recentCommissions.map(c => ({
        amount: c.ambassadorCut,
        dealTitle: c.dealTitle,
        date: c.paidAt,
      })),
      agentPerformance: agentPerf.map(a => ({
        id: a.id,
        name: a.name,
        listings: a._count.assignedListings,
        earnings: 0,
      })),
      inquiryStats: inqStats,
    });
  } catch (error) {
    logger.error({ err: error }, "Ambassador dashboard error:");
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
    logger.error({ err: error }, "List agents error:");
    res.status(500).json({ error: "Failed to fetch agents" });
  }
});

router.get("/tasks", authenticate, authorize("ambassador"), async (req: AuthRequest, res: Response) => {
  try {
    const userCities = await prisma.userCity.findMany({
      where: { userId: req.user!.id },
      include: { city: true },
    });
    const cityNames = userCities.map((uc) => uc.city.name);

    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { assignedToId: req.user!.id },
          ...(cityNames.length > 0 ? [{ area: { in: cityNames } }] : []),
        ],
      },
      include: {
        createdBy: { select: { id: true, name: true, role: true } },
        assignedTo: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ tasks });
  } catch (error) {
    logger.error({ err: error }, "Ambassador tasks error:");
    res.status(500).json({ error: "Failed to fetch tasks" });
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
    logger.error({ err: error }, "City listings error:");
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;


