import { Router, Response } from "express";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize, requirePermission } from "../middleware/rbac";
import prisma from "../lib/prisma";
import { logger } from "../lib/logger";

const router = Router();

router.get("/", authenticate, authorize("head"), requirePermission("canManageUsers"), async (_req: AuthRequest, res: Response) => {
  try {
    const [agentApps, contacts] = await Promise.all([
      prisma.user.findMany({
        where: { role: "agent", isApproved: false },
        select: { id: true, name: true, email: true, city: true, whatsapp: true, createdAt: true },
        orderBy: { createdAt: "desc" },
      }),
      prisma.contactSubmission.findMany({
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
    ]);

    res.json({ agentApplications: agentApps, contactSubmissions: contacts });
  } catch (error) {
    logger.error({ err: error }, "Failed to fetch submissions");
    res.status(500).json({ error: "Failed to fetch submissions" });
  }
});

router.patch("/contact/:id/read", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.contactSubmission.update({ where: { id: req.params.id }, data: { read: true } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/agent/:id", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

router.delete("/contact/:id", authenticate, authorize("head"), requirePermission("canManageUsers"), async (req: AuthRequest, res: Response) => {
  try {
    await prisma.contactSubmission.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed" });
  }
});

export default router;
