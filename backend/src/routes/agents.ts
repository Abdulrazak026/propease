import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";
import { logger } from "../lib/logger";
const router = Router();

router.get("/dashboard", authenticate, authorize("agent"), async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.id;
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [tasks, user, totalEarned, thisMonthEarned, lastMonthEarned, recentCommissions, inquiryStats, unreadMessages] =
      await Promise.all([
        prisma.task.findMany({ where: { assignedToId: uid }, select: { status: true } }),
        prisma.user.findUnique({ where: { id: uid }, select: { walletBalance: true } }),
        prisma.commission.aggregate({ where: { agentId: uid }, _sum: { agentCut: true } }),
        prisma.commission.aggregate({ where: { agentId: uid, paidAt: { gte: startOfMonth } }, _sum: { agentCut: true } }),
        prisma.commission.aggregate({ where: { agentId: uid, paidAt: { gte: startOfLastMonth, lte: endOfLastMonth } }, _sum: { agentCut: true } }),
        prisma.commission.findMany({ where: { agentId: uid }, orderBy: { paidAt: "desc" }, take: 5 }),
        prisma.inquiry.groupBy({ by: ["status"], where: { assignedAgentId: uid }, _count: { id: true } }),
        prisma.conversation.count({ where: { participants: { some: { userId: uid } }, messages: { some: { senderId: { not: uid }, read: false } } } }),
      ]);

    const totalTasks = tasks.length;
    const openTasks = tasks.filter((t) => t.status === "open").length;
    const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
    const fulfilledTasks = tasks.filter((t) => t.status === "fulfilled").length;

    const inqStats: Record<string, number> = { new: 0, read: 0, responded: 0 };
    for (const s of inquiryStats) inqStats[s.status] = s._count.id;

    res.json({
      stats: { totalTasks, openTasks, inProgressTasks, fulfilledTasks },
      walletBalance: user?.walletBalance || 0,
      earnings: {
        totalEarned: totalEarned._sum.agentCut || 0,
        thisMonth: thisMonthEarned._sum.agentCut || 0,
        lastMonth: lastMonthEarned._sum.agentCut || 0,
      },
      recentCommissions: recentCommissions.map(c => ({
        amount: c.agentCut,
        dealTitle: c.dealTitle,
        date: c.paidAt,
      })),
      inquiryStats: inqStats,
      unreadMessages,
    });
  } catch (error) {
    logger.error({ err: error }, "Agent dashboard error:");
    res.status(500).json({ error: "Failed to fetch dashboard" });
  }
});

export default router;


