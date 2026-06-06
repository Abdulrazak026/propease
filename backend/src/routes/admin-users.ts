import { Router, Response } from "express";
import prisma from "../lib/prisma";
import { authenticate, AuthRequest } from "../middleware/auth";
import { authorize } from "../middleware/rbac";

const router = Router();

router.get("/", authenticate, authorize("head"), async (_req: AuthRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, city: true, walletBalance: true, isApproved: true, isVerified: true, canCreateTasks: true, canCloseDeals: true, ambassadorId: true, whatsapp: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    res.json({ users });
  } catch { res.status(500).json({ error: "Failed to fetch users" }); }
});

router.patch("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const { isApproved, isVerified, canCreateTasks, canCloseDeals, role, ambassadorId } = req.body;
    const id = String(req.params.id);
    const user = await prisma.user.update({
      where: { id },
      data: { isApproved, isVerified, canCreateTasks, canCloseDeals, role, ambassadorId },
      select: { id: true, name: true, email: true, role: true, isApproved: true, canCreateTasks: true, canCloseDeals: true },
    });
    res.json({ user });
  } catch { res.status(500).json({ error: "Failed to update user" }); }
});

router.post("/", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const bcrypt = (await import("bcryptjs")).default;
    const { name, email, password, role, city } = req.body;
    const hashed = await bcrypt.hash(password || "password123", 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed, role, city, isApproved: role === "head" },
      select: { id: true, name: true, email: true, role: true },
    });
    res.status(201).json({ user });
  } catch { res.status(500).json({ error: "Failed to create user" }); }
});

router.delete("/:id", authenticate, authorize("head"), async (req: AuthRequest, res: Response) => {
  try {
    const uid = String(req.params.id);
    // Clean up ALL related records to avoid FK constraints
    await prisma.$transaction([
      prisma.message.deleteMany({ where: { senderId: uid } }),
      prisma.auditLog.deleteMany({ where: { userId: uid } }),
      prisma.notification.deleteMany({ where: { userId: uid } }),
      prisma.savedSearch.deleteMany({ where: { userId: uid } }),
      prisma.reservation.deleteMany({ where: { userId: uid } }),
      prisma.withdrawal.deleteMany({ where: { userId: uid } }),
      prisma.transaction.deleteMany({ where: { userId: uid } }),
      prisma.inquiry.deleteMany({ where: { assignedAgentId: uid } }),
      prisma.tenantApplication.deleteMany({ where: { assignedAgentId: uid } }),
      prisma.taskComment.deleteMany({ where: { authorId: uid } }),
      prisma.task.deleteMany({ where: { OR: [{ createdById: uid }, { assignedToId: uid }] } }),
      prisma.priceChange.deleteMany({ where: { changedById: uid } }),
      prisma.review.deleteMany({ where: { OR: [{ authorId: uid }, { agentId: uid }] } }),
      prisma.commission.deleteMany({ where: { OR: [{ ambassadorId: uid }, { agentId: uid }] } }),
      prisma.rentAgreement.deleteMany({ where: { OR: [{ tenantId: uid }, { agentId: uid }] } }),
      prisma.customOrder.deleteMany({ where: { task: { assignedToId: uid } } }),
      prisma.listing.updateMany({ where: { postedById: uid }, data: { postedById: "" } }),
      prisma.listing.updateMany({ where: { assignedAgentId: uid }, data: { assignedAgentId: null } }),
      prisma.conversationParticipant.deleteMany({ where: { userId: uid } }),
      prisma.refreshToken.deleteMany({ where: { userId: uid } }),
      prisma.passwordResetToken.deleteMany({ where: { userId: uid } }),
      prisma.userCity.deleteMany({ where: { userId: uid } }),
    ]);
    await prisma.user.delete({ where: { id: uid } });
    res.json({ success: true });
  } catch (err) { 
    console.error("Delete user error:", err);
    res.status(500).json({ error: "Failed to delete user" }); 
  }
});

export default router;
