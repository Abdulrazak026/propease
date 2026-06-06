import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { validate } from "../middleware/validate";
import { updateUserSchema } from "../validators";
import { logger } from "../lib/logger";
import { cached, invalidate } from "../lib/cache";
const router = Router();

router.get("/dashboard", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const stats = await cached("dashboard:stats", 30, async () => {
      const [totalUsers, totalListings, availableListings, totalTasks, openTasks, totalCommissions, totalCommissionsPaid] =
        await Promise.all([
          prisma.user.count(),
          prisma.listing.count(),
          prisma.listing.count({ where: { status: "available" } }),
          prisma.task.count(),
          prisma.task.count({ where: { status: "open" } }),
          prisma.commission.aggregate({ _sum: { companyCut: true } }),
          prisma.commission.aggregate({ _sum: { ambassadorCut: true, agentCut: true } }),
        ]);
      return {
        totalUsers,
        totalListings,
        availableListings,
        totalTasks,
        openTasks,
        totalRevenue: totalCommissions._sum.companyCut || 0,
        totalCommissionsPaid: (totalCommissionsPaid._sum.ambassadorCut || 0) + (totalCommissionsPaid._sum.agentCut || 0),
      };
    });

    res.json({ stats });
  } catch (error) {
    logger.error({ err: error }, "Dashboard error:");
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

router.get("/users", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, name: true, email: true, role: true, city: true,
        walletBalance: true, canCreateTasks: true, canCloseDeals: true,
        isApproved: true, createdAt: true,
        ambassadorId: true,
        _count: { select: { agents: true, listings: true, assignedTasks: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ users });
  } catch (error) {
    logger.error({ err: error }, "List users error:");
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.put("/users/:id", authenticate, authorize("head"), validate(updateUserSchema), async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.params.id as string;
    const user = await prisma.user.update({
      where: { id: userId },
      data: req.body,
      select: {
        id: true, name: true, email: true, role: true, city: true,
        walletBalance: true, canCreateTasks: true, canCloseDeals: true,
        isApproved: true, ambassadorId: true,
      },
    });

    await prisma.auditLog.create({
      data: {
        action: "UPDATE_USER",
        entity: "User",
        entityId: userId,
        userId: req.user!.id,
        details: req.body,
      },
    });

    res.json({ user });
  } catch (error) {
    logger.error({ err: error }, "Update user error:");
    res.status(500).json({ error: "Failed to update user" });
  }
});

router.delete("/users/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id as string } });
    res.json({ message: "User deleted" });
  } catch (error) {
    logger.error({ err: error }, "Delete user error:");
    res.status(500).json({ error: "Failed to delete user" });
  }
});

router.get("/audit-logs", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { user: { select: { id: true, name: true, role: true } } },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    res.json({ logs });
  } catch (error) {
    logger.error({ err: error }, "Audit logs error:");
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

router.get("/all-listings", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        photos: { orderBy: { order: "asc" } },
        postedBy: { select: { id: true, name: true } },
        assignedAgent: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ listings });
  } catch (error) {
    logger.error({ err: error }, "All listings error:");
    res.status(500).json({ error: "Failed to fetch listings" });
  }
});

export default router;


