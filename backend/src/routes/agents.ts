import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";
const router = Router();

router.get("/dashboard", authenticate, authorize("agent"), async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: { assignedToId: req.user!.id },
      select: { status: true },
    });

    const totalTasks = tasks.length;
    const openTasks = tasks.filter((t) => t.status === "open").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
    const fulfilledTasks = tasks.filter((t) => t.status === "fulfilled").length;

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: { walletBalance: true },
    });

    res.json({
      stats: { totalTasks, openTasks, inProgressTasks, fulfilledTasks },
      walletBalance: user?.walletBalance || 0,
    });
  } catch (error) {
    logger.error({ err: error }, "Agent dashboard error:");
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

export default router;


